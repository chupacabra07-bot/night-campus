from rest_framework import serializers
from accounts.models import Profile, User
from .models import MatchPool, MatchRequest, MutualMatch, MatchChatMessage

class BlindProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['avatar_emoji', 'avatar_config', 'interests', 'brain_type', 'social_energy']

class MatchMemberSerializer(serializers.ModelSerializer):
    profile = BlindProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'profile']

class MatchPoolSerializer(serializers.ModelSerializer):
    members = MatchMemberSerializer(many=True, read_only=True)
    
    class Meta:
        model = MatchPool
        fields = ['id', 'campus', 'created_at', 'is_full', 'members']

class MutualMatchSerializer(serializers.ModelSerializer):
    other_user = serializers.SerializerMethodField()
    user1 = MatchMemberSerializer(read_only=True)
    user2 = MatchMemberSerializer(read_only=True)
    
    class Meta:
        model = MutualMatch
        fields = [
            'id', 'other_user', 'user1', 'user2', 'status', 
            'meeting_location', 'meeting_time', 'user1_agreed', 
            'user2_agreed', 'chat_unlocked_at', 'expires_at'
        ]

    def get_other_user(self, obj):
        request_user = self.context['request'].user
        other = obj.user2 if obj.user1 == request_user else obj.user1
        return MatchMemberSerializer(other).data

class ChatMessageSerializer(serializers.ModelSerializer):
    is_me = serializers.SerializerMethodField()
    
    class Meta:
        model = MatchChatMessage
        fields = ['id', 'text', 'created_at', 'is_me']

    def get_is_me(self, obj):
        return obj.sender == self.context['request'].user
