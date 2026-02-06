from django.db import models
from django.conf import settings
import uuid

class Event(models.Model):
    EVENT_TYPES = [
        ('party', '🎉 Party'),
        ('workshop', '📚 Workshop'),
        ('sports', '⚽ Sports'),
        ('meetup', '🤝 Meetup'),
        ('other', '✨ Other'),
    ]

    STATUS_CHOICES = [
        ('pending_vote', 'Pending Vote'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=255)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES, default='meetup')
    organizer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='organized_events')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending_vote')
    is_approved = models.BooleanField(default=False)
    vote_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    def check_approval(self):
        # Threshold: 8 if Lore >= 300, else 10
        from accounts.models import Profile
        profile = Profile.objects.get(user=self.organizer)
        threshold = 8 if profile.lore_score >= 300 else 10

        if self.status == 'pending_vote' and self.vote_count >= threshold:
            self.status = 'approved'
            self.is_approved = True
            self.save()
            # Reward creator
            profile.lore_score += 5 # Master prompt says +5 for approval
            profile.save()
            return True
        return False

class EventComment(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.username} on {self.event.title}"

class EventVote(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='votes')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    is_upvote = models.BooleanField(default=True) # Following "👍 I’m In" vs "👎 Skip"
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('event', 'user')

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new and self.is_upvote:
            self.event.vote_count = self.event.votes.filter(is_upvote=True).count()
            self.event.save()
            self.event.check_approval()

class EventReaction(models.Model):
    REACTION_TYPES = [
        ('love', '❤️'),
        ('okay', '👌'),
        ('cant_say', '🤔'),
        ('pass', '⏭️'),
    ]
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='reactions')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    reaction_type = models.CharField(max_length=20, choices=REACTION_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('event', 'user')

    def __str__(self):
        return f"{self.user.username} - {self.reaction_type} on {self.event.title}"

class RSVP(models.Model):
    STATUS_CHOICES = [
        ('going', 'Going'),
        ('maybe', 'Maybe'),
        ('not_going', 'Not Going'),
    ]
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='rsvps')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='going')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('event', 'user')
