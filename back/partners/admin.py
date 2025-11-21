from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'is_2fa_enabled', 'created_at']
    search_fields = ['username', 'email']
    list_filter = ['is_2fa_enabled', 'created_at']
    fieldsets = UserAdmin.fieldsets + (
        ('Дополнительно', {'fields': ('phone', 'avatar_url', 'bio', 'is_2fa_enabled')}),
    )

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'country', 'city']
    search_fields = ['user__username', 'country', 'city']

@admin.register(UserSocialAuth)
class UserSocialAuthAdmin(admin.ModelAdmin):
    list_display = ['user', 'provider', 'provider_user_id']
    list_filter = ['provider']

@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']

@admin.register(UserGame)
class UserGameAdmin(admin.ModelAdmin):
    list_display = ['user', 'game', 'playtime_hours', 'current_rank', 'is_primary']
    list_filter = ['game', 'is_primary']

@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ['user_game', 'title', 'unlocked_at']
    search_fields = ['title']

@admin.register(ContentPost)
class ContentPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'access_type', 'price', 'is_published', 'created_at']
    list_filter = ['access_type', 'is_published', 'created_at']
    search_fields = ['title', 'content']

@admin.register(UserGallery)
class UserGalleryAdmin(admin.ModelAdmin):
    list_display = ['user', 'caption', 'access_type', 'price', 'uploaded_at']
    list_filter = ['access_type']

@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'price_per_month', 'is_active']
    list_filter = ['is_active']

@admin.register(UserSubscription)
class UserSubscriptionAdmin(admin.ModelAdmin):
    list_display = ['subscriber', 'plan', 'status', 'starts_at', 'ends_at']
    list_filter = ['status']

@admin.register(Purchase)
class PurchaseAdmin(admin.ModelAdmin):
    list_display = ['user', 'content_type', 'content_id', 'purchase_price', 'purchased_at']
    list_filter = ['content_type']

@admin.register(Follow)
class FollowAdmin(admin.ModelAdmin):
    list_display = ['follower', 'following', 'created_at']
    search_fields = ['follower__username', 'following__username']

@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ['conversation_id', 'is_group', 'title', 'created_by', 'created_at']
    list_filter = ['is_group']

@admin.register(ConversationParticipant)
class ConversationParticipantAdmin(admin.ModelAdmin):
    list_display = ['conversation', 'user', 'joined_at']

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['conversation', 'sender', 'created_at']
    search_fields = ['content']

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'type', 'title', 'is_read', 'created_at']
    list_filter = ['type', 'is_read']

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['author', 'target', 'rating', 'created_at']
    list_filter = ['rating']

@admin.register(PostLike)
class PostLikeAdmin(admin.ModelAdmin):
    list_display = ['post', 'user', 'created_at']

@admin.register(PostComment)
class PostCommentAdmin(admin.ModelAdmin):
    list_display = ['post', 'author', 'created_at']
    search_fields = ['content']

@admin.register(PaymentTransaction)
class PaymentTransactionAdmin(admin.ModelAdmin):
    list_display = ['user', 'type', 'amount', 'status', 'created_at']
    list_filter = ['type', 'status', 'currency']