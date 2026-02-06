from rest_framework import serializers
from .models import Event, RSVP
from accounts.serializers import UserSerializer

class RSVPSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = RSVP
        fields = ['id', 'user', 'status', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

class EventSerializer(serializers.ModelSerializer):
    organizer = UserSerializer(read_only=True)
    rsvp_count = serializers.IntegerField(source='rsvps.count', read_only=True)
    user_rsvp_status = serializers.SerializerMethodField()
    user_has_voted = serializers.SerializerMethodField()
    is_organizer = serializers.SerializerMethodField()
    can_delete = serializers.SerializerMethodField()
    reaction_counts = serializers.SerializerMethodField()
    user_reaction = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'location', 
            'event_type', 'organizer', 'start_time', 
            'end_time', 'rsvp_count', 'user_rsvp_status',
            'status', 'vote_count', 'user_has_voted', 'is_organizer',
            'can_delete', 'reaction_counts', 'user_reaction'
        ]
        read_only_fields = ['id', 'organizer', 'status', 'vote_count']

    def get_user_rsvp_status(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            rsvp = obj.rsvps.filter(user=request.user).first()
            return rsvp.status if rsvp else None
        return None

    def get_user_has_voted(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.votes.filter(user=request.user).exists()
        return False

    def get_is_organizer(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.organizer == request.user
        return False

    def get_can_delete(self, obj):
        from django.utils import timezone
        from datetime import timedelta
        request = self.context.get('request')
        if request and request.user.is_authenticated and obj.organizer == request.user:
            # Can delete if created less than 24 hours ago (for verification)
            return timezone.now() - obj.created_at < timedelta(hours=24)
        return False

    def get_reaction_counts(self, obj):
        from django.db.models import Count
        reactions = obj.reactions.values('reaction_type').annotate(count=Count('reaction_type'))
        counts = {rtype: 0 for rtype, _ in obj.reactions.model.REACTION_TYPES}
        for r in reactions:
            counts[r['reaction_type']] = r['count']
        return counts

    def get_user_reaction(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            reaction = obj.reactions.filter(user=request.user).first()
            return reaction.reaction_type if reaction else None
        return None
