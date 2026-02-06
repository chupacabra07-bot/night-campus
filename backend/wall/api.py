from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import WallPost, PostReaction, SavedPost, ReportedPost
from .serializers import WallPostSerializer

class WallPostViewSet(viewsets.ModelViewSet):
    queryset = WallPost.objects.filter(is_deleted=False).order_by('-created_at')
    serializer_class = WallPostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def _broadcast_update(self, post_data, update_type='post_created'):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'wall_feed',
            {
                'type': 'wall_update',
                'message': {
                    'type': update_type,
                    'post': post_data
                }
            }
        )

    def perform_create(self, serializer):
        post = serializer.save(user=self.request.user)
        self._broadcast_update(WallPostSerializer(post).data)

    @action(detail=True, methods=['post'])
    def react(self, request, pk=None):
        post = self.get_object()
        reaction_type = request.data.get('reaction_type', 'heart')
        
        reaction, created = PostReaction.objects.update_or_create(
            post=post,
            user=request.user,
            defaults={'reaction_type': reaction_type}
        )
        
        if not created and reaction.reaction_type == reaction_type:
            # If same reaction, toggle off
            reaction.delete()
            status_msg = "reaction_removed"
        else:
            status_msg = "reaction_added"
            
        # Broadcast reaction update
        self._broadcast_update(WallPostSerializer(post, context={'request': request}).data, update_type='reaction_updated')
            
        return Response({
            'status': status_msg, 
            'reaction_count': post.reactions.count(),
            'my_reaction': reaction_type if status_msg == "reaction_added" else None
        })

    @action(detail=True, methods=['post'])
    def reblast(self, request, pk=None):
        original_post = self.get_object()
        comment = request.data.get('content', '')
        
        # Prevent self-reblast loops or reblasting a reblast of self
        if original_post.user == request.user:
            return Response({"error": "Cannot reblast your own lore."}, status=status.HTTP_400_BAD_REQUEST)
            
        new_post = WallPost.objects.create(
            user=request.user,
            content=comment or original_post.content,
            mood=original_post.mood,
            reblast_of=original_post,
            title=f"Reblast: {original_post.title}" if original_post.title else "Reblast"
        )
        
        serializer = WallPostSerializer(new_post, context={'request': request})
        self._broadcast_update(serializer.data, update_type='post_created')
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def save_post(self, request, pk=None):
        post = self.get_object()
        saved, created = SavedPost.objects.get_or_create(user=request.user, post=post)
        
        if not created:
            saved.delete()
            return Response({'status': 'unsaved'})
        return Response({'status': 'saved'})

    @action(detail=True, methods=['post'])
    def report(self, request, pk=None):
        post = self.get_object()
        reason = request.data.get('reason')
        comment = request.data.get('comment', '')
        
        if not reason:
            return Response({"error": "Reason is required."}, status=status.HTTP_400_BAD_REQUEST)
            
        ReportedPost.objects.get_or_create(
            user=request.user,
            post=post,
            defaults={'reason': reason, 'comment': comment}
        )
        return Response({'status': 'report_received'})
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        post_id = instance.id
        self.perform_destroy(instance)
        self._broadcast_update({'id': post_id}, update_type='post_deleted')
        return Response(status=status.HTTP_204_NO_CONTENT)
