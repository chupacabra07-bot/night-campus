from django.contrib import admin
from .models import WallPost, PostReaction

class WallPostAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'mood', 'content_snippet', 'created_at', 'is_deleted')
    list_filter = ('mood', 'is_deleted', 'created_at')
    search_fields = ('content', 'user__username')
    
    def content_snippet(self, obj):
        return obj.content[:50] + "..." if len(obj.content) > 50 else obj.content
    content_snippet.short_description = 'Content'

class PostReactionAdmin(admin.ModelAdmin):
    list_display = ('post_id', 'user', 'reaction_type')
    list_filter = ('reaction_type',)
    search_fields = ('post__id', 'user__username')

    def post_id(self, obj):
        return obj.post.id
    post_id.short_description = 'Post ID'

admin.site.register(WallPost, WallPostAdmin)
admin.site.register(PostReaction, PostReactionAdmin)
