from django.db import models
from django.conf import settings
import uuid

class WallPost(models.Model):
    MOOD_CHOICES = [
        ('rant', 'Rant'),
        ('confession', 'Confession'),
        ('advice', 'Advice'),
        ('chaos', 'Chaos'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')
    title = models.CharField(max_length=69, blank=True, default="")
    content = models.TextField(max_length=999)
    mood = models.CharField(max_length=20, choices=MOOD_CHOICES, default='chaos')
    created_at = models.DateTimeField(auto_now_add=True)
    is_deleted = models.BooleanField(default=False)
    
    # Reblast (Repost) support
    reblast_of = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='reblasts')
    
    # Anonymity Support
    is_anonymous = models.BooleanField(default=False)
    anon_name = models.CharField(max_length=50, blank=True, default="")
    anon_emoji = models.CharField(max_length=10, blank=True, default="")

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        if is_new:
            # Anti-abuse: check for duplicate content in last 24h by same user
            from django.utils import timezone
            from datetime import timedelta
            one_day_ago = timezone.now() - timedelta(days=1)
            duplicates = WallPost.objects.filter(
                user=self.user, 
                content=self.content, 
                created_at__gte=one_day_ago
            ).exists()
            
            if duplicates:
                # Still allow post but don't flag for Lore reward (handled below)
                pass

            if self.is_anonymous and not self.anon_name:
                import random
                ANON_NAMES = [
                    "Midnight Idli", "Library Phantom", "Bunking Bandit", 
                    "Canteen Ghost", "Hostel Hacker", "Chaos Catalyst", 
                    "Exam Ninja", "Proxy King", "Lab Rat", "Backbencher"
                ]
                ANON_EMOJIS = ["👻", "🕯️", "🕵️", "🏮", "🎭", "🌌", "🦉", "🌫️", "🗝️", "🗿"]
                self.anon_name = random.choice(ANON_NAMES)
                self.anon_emoji = random.choice(ANON_EMOJIS)

            super().save(*args, **kwargs)
            
            # Lore Reward Logic
            from accounts.models import Profile
            profile, created = Profile.objects.get_or_create(user=self.user)
            meta = profile.lore_meta or {}
            posts_today = meta.get('posts_today', {"date": "", "count": 0})
            today = timezone.now().date().isoformat()
            
            if posts_today['date'] != today:
                posts_today = {"date": today, "count": 0}
            
            if posts_today['count'] < 2 and not duplicates:
                profile.lore_score += 4
                posts_today['count'] += 1
                meta['posts_today'] = posts_today
                profile.lore_meta = meta
                profile.save(update_fields=['lore_score', 'lore_meta'])
        else:
            super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Subtract Lore if deleted shortly after (simplified: always subtract if it was rewarded)
        # Note: This is a basic implementation. In a real app, you'd track WHICH posts earned Lore.
        from accounts.models import Profile
        profile = Profile.objects.filter(user=self.user).first()
        # We don't have perfect tracking here, but we can subtract if they still have score
        if profile and profile.lore_score >= 4:
            profile.lore_score -= 4
            profile.save(update_fields=['lore_score'])
        super().delete(*args, **kwargs)

    def __str__(self):
        return f"{self.mood}: {self.content[:20]}..."

class PostReaction(models.Model):
    REACTION_TYPES = [
        ('heart', '❤️'),
        ('joy', '😂'),
        ('fire', '🔥'),
        ('mind_blown', '🤯'),
        ('hundred', '💯'),
        ('cry', '😭'),
    ]
    post = models.ForeignKey(WallPost, on_delete=models.CASCADE, related_name='reactions')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    reaction_type = models.CharField(max_length=20, choices=REACTION_TYPES)
    
    class Meta:
        unique_together = ('post', 'user') # One reaction per user per post

class SavedPost(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='saved_posts')
    post = models.ForeignKey(WallPost, on_delete=models.CASCADE, related_name='saved_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')

class ReportedPost(models.Model):
    REPORT_REASONS = [
        ('harassment', 'Harassment'),
        ('spam', 'Spam'),
        ('inappropriate', 'Inappropriate'),
        ('other', 'Other'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(WallPost, on_delete=models.CASCADE, related_name='reports')
    reason = models.CharField(max_length=20, choices=REPORT_REASONS)
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')
