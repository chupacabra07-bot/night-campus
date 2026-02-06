from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Event, RSVP, EventVote, EventReaction
from .serializers import EventSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('start_time')
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        if self.action == 'list':
            return qs.filter(status='approved')
        return qs

    @action(detail=False, methods=['get'])
    def pending_approval(self, request):
        from django.utils import timezone
        from datetime import timedelta
        
        # Expiration check
        expiry_limit = timezone.now() - timedelta(hours=48)
        expired_events = Event.objects.filter(status='pending_vote', created_at__lt=expiry_limit)
        for event in expired_events:
            event.status = 'rejected'
            event.save()
            # Broadcast rejection if needed
            self._broadcast_update({
                'id': event.id,
                'status': 'rejected'
            }, update_type='event_rejected')

        events = Event.objects.filter(status='pending_vote', start_time__gte=timezone.now()).order_by('-created_at')
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)

    def _broadcast_update(self, event_data, update_type='event_created'):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'wall_feed',
            {
                'type': 'wall_update',
                'message': {
                    'type': update_type,
                    'event': event_data
                }
            }
        )

    def create(self, request, *args, **kwargs):
        # Lore Score check (>= 150)
        from accounts.models import Profile
        profile = Profile.objects.get(user=request.user)
        if profile.lore_score < 150:
            return Response(
                {
                    "error": "Lore Score too low",
                    "user_score": profile.lore_score,
                    "required_score": 150
                }, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        event = serializer.save(organizer=self.request.user, status='pending_vote')
        self._broadcast_update(EventSerializer(event).data, update_type='event_proposed')

    @action(detail=True, methods=['post'])
    def vote(self, request, pk=None):
        event = self.get_object()
        if event.status != 'pending_vote':
            return Response({"error": "Event is already approved or rejected"}, status=400)
            
        if event.organizer == request.user:
            return Response({"error": "You cannot vote on your own event"}, status=status.HTTP_400_BAD_REQUEST)

        is_upvote = request.data.get('is_upvote', True)
        vote, created = EventVote.objects.update_or_create(
            event=event,
            user=request.user,
            defaults={'is_upvote': is_upvote}
        )
        
        # Reward Lore for voting (+3, max 5/day)
        if created and is_upvote:
            from accounts.models import Profile
            from django.utils import timezone
            profile = Profile.objects.get(user=request.user)
            meta = profile.lore_meta or {}
            votes_today = meta.get('votes_today', {"date": "", "count": 0})
            today = timezone.now().date().isoformat()
            
            if votes_today['date'] != today:
                votes_today = {"date": today, "count": 0}
            
            if votes_today['count'] < 5:
                profile.lore_score += 3
                votes_today['count'] += 1
                meta['votes_today'] = votes_today
                profile.lore_meta = meta
                profile.save(update_fields=['lore_score', 'lore_meta'])

        event.refresh_from_db()
        return Response({
            'status': 'vote_recorded',
            'vote_count': event.vote_count,
            'event_status': event.status,
            'approved': event.status == 'approved'
        })

    @action(detail=True, methods=['post'])
    def comment(self, request, pk=None):
        event = self.get_object()
        content = request.data.get('content')
        if not content:
            return Response({"error": "Content required"}, status=400)

        from .models import EventComment
        comment = EventComment.objects.create(
            event=event,
            user=request.user,
            content=content
        )

        # Reward Lore for commenting (+2, max 3/day)
        from accounts.models import Profile
        from django.utils import timezone
        profile = Profile.objects.get(user=request.user)
        meta = profile.lore_meta or {}
        comments_today = meta.get('comments_today', {"date": "", "count": 0})
        today = timezone.now().date().isoformat()

        if comments_today['date'] != today:
            comments_today = {"date": today, "count": 0}

        if comments_today['count'] < 3:
            profile.lore_score += 2
            comments_today['count'] += 1
            meta['comments_today'] = comments_today
            profile.lore_meta = meta
            profile.save(update_fields=['lore_score', 'lore_meta'])

        return Response({
            'status': 'comment_added',
            'comment': {
                'id': comment.id,
                'content': comment.content,
                'user': comment.user.username,
                'created_at': comment.created_at
            }
        })

    @action(detail=True, methods=['post'])
    def rsvp(self, request, pk=None):
        event = self.get_object()
        if event.status != 'approved':
            return Response({"error": "Cannot RSVP to unapproved events"}, status=400)
            
        status_val = request.data.get('status', 'going')
        
        rsvp, created = RSVP.objects.get_or_create(
            event=event,
            user=request.user,
            defaults={'status': status_val}
        )
        
        if not created:
            if rsvp.status == status_val:
                rsvp.delete()
                status_val = None
            else:
                rsvp.status = status_val
                rsvp.save()
        
        self._broadcast_update({
            'id': event.id,
            'rsvp_count': event.rsvps.count()
        }, update_type='event_rsvp_updated')
        
        return Response({'status': 'rsvp_updated', 'user_rsvp_status': status_val, 'rsvp_count': event.rsvps.count()})

    @action(detail=True, methods=['post'])
    def react(self, request, pk=None):
        event = self.get_object()
        reaction_type = request.data.get('reaction_type')
        if reaction_type not in ['love', 'okay', 'cant_say', 'pass']:
            return Response({"error": "Invalid reaction type"}, status=400)

        reaction, created = EventReaction.objects.update_or_create(
            event=event,
            user=request.user,
            defaults={'reaction_type': reaction_type}
        )

        # Broadcast update
        serializer = self.get_serializer(event)
        self._broadcast_update(serializer.data, update_type='event_reaction_updated')

        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.organizer != request.user:
            return Response({"error": "Only the organizer can delete this chaos"}, status=403)
        
        from django.utils import timezone
        from datetime import timedelta
        if timezone.now() - instance.created_at > timedelta(hours=24):
            return Response({"error": "The window for deleting this chaos has closed (24 hours)"}, status=400)
            
        event_id = instance.id
        self.perform_destroy(instance)
        
        # Broadcast deletion
        self._broadcast_update({'id': event_id}, update_type='event_deleted')
        
        return Response(status=status.HTTP_204_NO_CONTENT)
