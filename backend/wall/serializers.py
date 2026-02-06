from rest_framework import serializers
from .models import WallPost, PostReaction
from accounts.serializers import UserSerializer

class WallPostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    reaction_count = serializers.IntegerField(source='reactions.count', read_only=True)
    can_delete = serializers.SerializerMethodField()

    reblast_count = serializers.IntegerField(source='reblasts.count', read_only=True)
    is_saved = serializers.SerializerMethodField()
    my_reaction = serializers.SerializerMethodField()

    class Meta:
        model = WallPost
        fields = [
            'id', 'user', 'title', 'content', 'mood', 'created_at', 
            'reaction_count', 'reblast_count', 'can_delete', 
            'is_saved', 'my_reaction', 'reblast_of',
            'is_anonymous', 'anon_name', 'anon_emoji'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'anon_name', 'anon_emoji']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.is_anonymous:
            data['user'] = {
                'profile': {
                    'nickname': instance.anon_name,
                    'avatar_emoji': instance.anon_emoji,
                    'avatar_config': None
                }
            }
            # Also ensure can_delete is still true for the owner even if anonymous
            # (get_can_delete already handles this via obj.user == request.user)
        return data

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.saved_by.filter(user=request.user).exists()
        return False

    def get_my_reaction(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            reaction = obj.reactions.filter(user=request.user).first()
            return reaction.reaction_type if reaction else None
        return None

    def get_can_delete(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.user == request.user
        return False
