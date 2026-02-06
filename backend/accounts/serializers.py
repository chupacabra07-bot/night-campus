from rest_framework import serializers
from .models import User, Profile

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = Profile
        fields = [
            'id', 'username', 'nickname', 'bio', 'avatar_emoji', 'social_energy', 
            'personality_style', 'brain_type', 'connection_intent',
            'interests', 'gender', 'match_preference', 
            'looking_for', 'avatar_config', 'vibe_settings',
            'privacy_settings', 'brain_type_description', 
            'lore_score', 'current_streak_count', 'longest_streak',
            'last_checkin_date', 'streak_freezes', 'last_freeze_grant',
            'last_active', 'is_developer'
        ]
        read_only_fields = [
            'id', 'username', 'nickname', 'lore_score', 
            'current_streak_count', 'longest_streak',
            'last_checkin_date', 'streak_freezes', 'last_freeze_grant',
            'last_active', 'is_developer'
        ]

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        request = self.context.get('request')
        
        # If the requester is the owner, they see everything
        if request and request.user == instance.user:
            return ret
            
        # For others, filter based on privacy settings
        privacy = instance.privacy_settings or {}
        
        if not privacy.get('show_gender', False):
            ret.pop('gender', None)
        if not privacy.get('show_match_preference', False):
            ret.pop('match_preference', None)
        if not privacy.get('show_looking_for', False):
            ret.pop('looking_for', None)
            
        return ret

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_verified', 'profile']
        read_only_fields = ['id', 'username', 'is_verified']
