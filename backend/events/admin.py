from django.contrib import admin
from .models import Event, RSVP

class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'organizer', 'event_type', 'location', 'start_time', 'end_time')
    list_filter = ('event_type', 'start_time', 'location')
    search_fields = ('title', 'description', 'organizer__username', 'location')

class RSVPAdmin(admin.ModelAdmin):
    list_display = ('event', 'user', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('event__title', 'user__username')

admin.site.register(Event, EventAdmin)
admin.site.register(RSVP, RSVPAdmin)
