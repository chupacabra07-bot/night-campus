from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid

from django.utils import timezone
from datetime import timedelta

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.username

class Profile(models.Model):
    GENDER_CHOICES = [
        ('man', 'Man'),
        ('woman', 'Woman'),
        ('others', 'Others'),
    ]
    
    PREFERENCE_CHOICES = [
        ('women', 'Women'),
        ('men', 'Men'),
        ('everyone', 'Everyone'),
    ]

    LOOKING_FOR_CHOICES = [
        ('friends', 'Friends'),
        ('dating', 'Dating'),
        ('both', 'Both'),
    ]

    BRAIN_CHOICES = [
        ('overthinker', 'Overthinker'),
        ('flow', 'Go with the flow'),
        ('spreadsheet', 'Spreadsheet human'),
        ('see_what_happens', 'Wait and see'),
        ('delulu', 'Delulu but Functional'),
        ('chaos', 'Chaos Processor'),
        ('wifi', 'Emotionally Wi-Fi Dependent'),
        ('npc', 'NPC With Anxiety DLC'),
    ]


    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    nickname = models.CharField(max_length=50, unique=True, blank=True, null=True)
    bio = models.TextField(max_length=500, blank=True)
    avatar_emoji = models.CharField(max_length=10, default='👻')
    
    # Night Vibe Fields
    social_energy = models.JSONField(default=list)
    personality_style = models.JSONField(default=list)
    brain_type = models.CharField(max_length=50, choices=BRAIN_CHOICES, blank=True)
    brain_type_description = models.TextField(blank=True)
    connection_intent = models.JSONField(default=list)
    interests = models.JSONField(default=list)
    avatar_config = models.JSONField(default=dict, blank=True)
    vibe_settings = models.JSONField(default=dict, blank=True)
    lore_meta = models.JSONField(default=dict, blank=True) # Tracks daily limits: {"daily_login": "YYYY-MM-DD", "votes_today": {"date": "...", "count": 0}, ...}
    privacy_settings = models.JSONField(default=dict, blank=True) # {"show_gender": false, "show_match_preference": false, "show_looking_for": false}
    
    # Gender & Discovery
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, blank=True)
    match_preference = models.CharField(max_length=20, choices=PREFERENCE_CHOICES, default='everyone')
    looking_for = models.CharField(max_length=20, choices=LOOKING_FOR_CHOICES, default='both')
    
    is_developer = models.BooleanField(default=False)
    
    # Metadata
    lore_score = models.IntegerField(default=1)
    current_streak_count = models.IntegerField(default=0)
    longest_streak = models.IntegerField(default=0)
    last_checkin_date = models.DateField(null=True, blank=True)
    streak_freezes = models.IntegerField(default=0)
    last_freeze_grant = models.DateField(null=True, blank=True)
    last_active = models.DateTimeField(auto_now=True)
    
    # Matching System Fields
    campus = models.CharField(max_length=100, default='Main Campus', blank=True)
    matching_cooldown_until = models.DateTimeField(null=True, blank=True)
    
    def save(self, *args, **kwargs):
        # Reserve Lore 500+ for dev accounts only
        if self.lore_score >= 500 and not self.is_developer:
            self.lore_score = 499
        super().save(*args, **kwargs)

    def update_streak(self):
        """Update the user's check-in streak based on current date."""
        today = timezone.now().date()
        
        if self.last_checkin_date == today:
            return False # Already checked in today
            
        is_increase = False
        yesterday = today - timedelta(days=1)
        
        if self.last_checkin_date is None:
            # First time check-in
            self.current_streak_count = 1
            is_increase = True
        elif self.last_checkin_date == yesterday:
            # Consistent check-in
            self.current_streak_count += 1
            is_increase = True
        else:
            # Missed a day
            # Grace/Freeze logic:
            if self.streak_freezes > 0:
                self.streak_freezes -= 1
                # Streak is saved but count doesn't increase for the missed day
                # We treat it as if they checked in today now
                self.current_streak_count += 1 
                is_increase = True
            else:
                self.current_streak_count = 1 # Reset to 1 since they are checking in now
                is_increase = True

        # Update longest streak
        if self.current_streak_count > self.longest_streak:
            self.longest_streak = self.current_streak_count
            
        self.last_checkin_date = today
        
        # 14-day freeze grant logic
        # If last_freeze_grant is None or > 14 days ago, grant a freeze
        if self.last_freeze_grant is None or (today - self.last_freeze_grant).days >= 14:
            self.streak_freezes += 1
            self.last_freeze_grant = today
            
        self.save()
        return is_increase

    def __str__(self):
        return self.nickname or self.user.username
