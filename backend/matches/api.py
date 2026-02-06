from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import MatchPool, MatchRequest, MutualMatch, MatchChatMessage, MatchReport
from .serializers import MatchPoolSerializer, MutualMatchSerializer, ChatMessageSerializer
from accounts.models import Profile
from django.utils import timezone
from datetime import timedelta, datetime
import random
from .compatibility import calculate_all_meters, select_random_meters

CAMPUS_SPOTS = [
    "Campus Café - Central Plaza",
    "Main Library - 2nd Floor Lounge",
    "Student Center - Game Zone",
    "Coffee Day - Near Gate 3",
    "Green Bench - Sports Ground",
    "Food Court - Back Entrance",
]

class MatchingViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def current_pool(self, request):
        user = request.user
        profile = user.profile
        
        # 1. Cooldown Check
        if profile.matching_cooldown_until and profile.matching_cooldown_until > timezone.now():
            diff = profile.matching_cooldown_until - timezone.now()
            hours, remainder = divmod(diff.seconds, 3600)
            return Response({
                "status": "cooldown",
                "message": f"You're booked for now. New matches unlock in {diff.days * 24 + hours}h.",
                "remaining_seconds": int(diff.total_seconds())
            }, status=200)

        # 2. Find Active Pool
        pool = MatchPool.objects.filter(members=user, is_full=False).first()
        if not pool:
            # 3. Find pool to join
            pool = MatchPool.objects.filter(campus=profile.campus, is_full=False).exclude(members=user).first()
            
            if pool:
                pool.members.add(user)
                if pool.members.count() >= 9:
                    pool.is_full = True
                    pool.save()
            else:
                # 4. Create new pool
                pool = MatchPool.objects.create(campus=profile.campus)
                pool.members.add(user)
        
        serializer = MatchPoolSerializer(pool, context={'request': request})
        data = serializer.data
        
        # Remove self from members list
        members = [m for m in data['members'] if m['id'] != str(user.id)]
        
        # Calculate compatibility metrics for each member
        user_profile_data = {
            'brain_type': profile.brain_type,
            'interests': profile.interests,
            'social_energy': profile.social_energy,
            'connection_intent': profile.connection_intent,
        }
        
        today = datetime.now()
        
        for member in members:
            member_profile = Profile.objects.get(user_id=member['id'])
            member_profile_data = {
                'brain_type': member_profile.brain_type,
                'interests': member_profile.interests,
                'social_energy': member_profile.social_energy,
                'connection_intent': member_profile.connection_intent,
            }
            
            # Calculate all meters
            all_meters = calculate_all_meters(user_profile_data, member_profile_data)
            
            # Select 3-4 random meters for this user (seeded by date for consistency)
            selected_meter_keys = select_random_meters(member['id'], today)
            selected_meters = {key: all_meters[key] for key in selected_meter_keys}
            
            # Add to member data
            member['compatibility_meters'] = selected_meters
        
        data['members'] = members
        
        # Get IDs of people already requested in this pool
        requested_ids = MatchRequest.objects.filter(from_user=user, pool=pool).values_list('to_user_id', flat=True)
        data['requested_ids'] = [str(uid) for uid in requested_ids]
        data['requests_sent_count'] = len(requested_ids)
        
        return Response(data)

    @action(detail=False, methods=['post'])
    def request_meetup(self, request):
        user = request.user
        target_user_id = request.data.get('target_user_id')
        pool_id = request.data.get('pool_id')
        
        if not target_user_id or not pool_id:
            return Response({"error": "target_user_id and pool_id required"}, status=400)
            
        pool = MatchPool.objects.get(id=pool_id)
        if not pool.members.filter(id=user.id).exists():
            return Response({"error": "You are not in this pool"}, status=403)
            
        # Check limit (5 per pool)
        if MatchRequest.objects.filter(from_user=user, pool=pool).count() >= 5:
            return Response({"error": "Limit reached: 5 per pool"}, status=400)
            
        target_user = pool.members.get(id=target_user_id)
        
        # Create request
        match_req, created = MatchRequest.objects.get_or_create(
            from_user=user,
            to_user=target_user,
            pool=pool
        )
        
        # Check mutual match
        reciprocal = MatchRequest.objects.filter(from_user=target_user, to_user=user, pool=pool).exists()
        
        if reciprocal:
            # Create MutualMatch
            match, m_created = MutualMatch.objects.get_or_create(
                user1=min(user, target_user, key=lambda u: u.id),
                user2=max(user, target_user, key=lambda u: u.id),
                pool=pool,
                defaults={
                    'meeting_location': random.choice(CAMPUS_SPOTS),
                    'meeting_time': timezone.now() + timedelta(hours=random.randint(2, 6))
                }
            )
            return Response({
                "status": "mutual_match",
                "match_id": match.id,
                "message": "It's a Mutual Vibe!"
            })
            
        return Response({"status": "requested", "requests_sent_count": MatchRequest.objects.filter(from_user=user, pool=pool).count()})

class MutualMatchViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MutualMatchSerializer

    def get_queryset(self):
        user = self.request.user
        return MutualMatch.objects.filter(models.Q(user1=user) | models.Q(user2=user)).order_by('-created_at')

    @action(detail=True, methods=['post'])
    def agree(self, request, pk=None):
        match = self.get_object()
        user = request.user
        
        if match.user1 == user:
            match.user1_agreed = True
        elif match.user2 == user:
            match.user2_agreed = True
        else:
            return Response(status=403)
            
        if match.user1_agreed and match.user2_agreed:
            match.status = 'active'
            match.chat_unlocked_at = timezone.now()
            match.expires_at = timezone.now() + timedelta(hours=24)
            match.save()
            
            # Set cooldown for both
            for u in [match.user1, match.user2]:
                u.profile.matching_cooldown_until = timezone.now() + timedelta(hours=14)
                u.profile.save()
        else:
            match.save()
            
        return Response(self.get_serializer(match).data)

    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        match = self.get_object()
        if match.status != 'active':
            return Response({"error": "Chat is locked until both agree to meet"}, status=403)
            
        text = request.data.get('text')
        if not text:
            return Response(status=400)
            
        msg = MatchChatMessage.objects.create(
            match=match,
            sender=request.user,
            text=text
        )
        return Response(ChatMessageSerializer(msg, context={'request': request}).data)

    @action(detail=True, methods=['post'])
    def report(self, request, pk=None):
        match = self.get_object()
        reporter = request.user
        reported_user = match.user2 if match.user1 == reporter else match.user1
        
        reason = request.data.get('reason')
        details = request.data.get('details', '')
        
        if not reason:
            return Response({"error": "Reason is required"}, status=400)
            
        MatchReport.objects.create(
            match=match,
            reporter=reporter,
            reported_user=reported_user,
            reason=reason,
            details=details
        )
        
        match.status = 'reported'
        match.save()
        
        return Response({"status": "Report submitted. Safety team will review."}, status=201)

    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        match = self.get_object()
        if match.status != 'active':
            return Response({"error": "Chat is locked"}, status=403)
            
        msgs = match.messages.all().order_by('created_at')
        return Response(ChatMessageSerializer(msgs, many=True, context={'request': request}).data)
