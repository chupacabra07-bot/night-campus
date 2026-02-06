from django.db import models
from django.conf import settings
import uuid

class MatchPool(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    campus = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    is_full = models.BooleanField(default=False)
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='match_pools')

    def __str__(self):
        return f"Pool {self.id} - {self.campus} ({self.members.count()}/9)"

class MatchRequest(models.Model):
    from_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_match_requests')
    to_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_match_requests')
    pool = models.ForeignKey(MatchPool, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    compatibility_metrics = models.JSONField(default=dict, blank=True)  # Stores calculated meters

    class Meta:
        unique_together = ('from_user', 'to_user', 'pool')

class MutualMatch(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Meetup Agreement'),
        ('active', 'Meeting Confirmed / Chat Unlocked'),
        ('expired', 'Link Expired'),
        ('reported', 'Reported'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user1 = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='mutual_matches_1')
    user2 = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='mutual_matches_2')
    pool = models.ForeignKey(MatchPool, on_delete=models.CASCADE)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    meeting_location = models.CharField(max_length=255, blank=True)
    meeting_time = models.DateTimeField(null=True, blank=True)
    
    user1_agreed = models.BooleanField(default=False)
    user2_agreed = models.BooleanField(default=False)
    
    chat_unlocked_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Match: {self.user1.username} & {self.user2.username}"

class MatchChatMessage(models.Model):
    match = models.ForeignKey(MutualMatch, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class MatchReport(models.Model):
    match = models.ForeignKey(MutualMatch, on_delete=models.CASCADE)
    reporter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reports_sent')
    reported_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reports_received')
    reason = models.CharField(max_length=255)
    details = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
