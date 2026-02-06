from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Profile

class ImprovedUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'is_verified', 'is_staff')
    search_fields = ('username', 'email')
    ordering = ('username',)

class ProfileAdmin(admin.ModelAdmin):
    list_display = ('nickname', 'user', 'lore_score', 'current_streak_count', 'longest_streak')
    search_fields = ('nickname', 'user__username', 'user__email')
    list_filter = ('gender', 'looking_for', 'brain_type')

admin.site.register(User, ImprovedUserAdmin)
admin.site.register(Profile, ProfileAdmin)
