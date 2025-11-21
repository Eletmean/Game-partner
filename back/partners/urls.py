from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

router.register(r'users', views.UserViewSet)
router.register(r'profiles', views.UserProfileViewSet)
router.register(r'social-auth', views.UserSocialAuthViewSet)
router.register(r'games', views.GameViewSet)
router.register(r'user-games', views.UserGameViewSet)
router.register(r'achievements', views.AchievementViewSet)
router.register(r'posts', views.ContentPostViewSet)
router.register(r'gallery', views.UserGalleryViewSet)
router.register(r'subscription-plans', views.SubscriptionPlanViewSet)
router.register(r'subscriptions', views.UserSubscriptionViewSet)
router.register(r'purchases', views.PurchaseViewSet)
router.register(r'follows', views.FollowViewSet)
router.register(r'conversations', views.ConversationViewSet)
router.register(r'conversation-participants', views.ConversationParticipantViewSet)
router.register(r'messages', views.MessageViewSet)
router.register(r'notifications', views.NotificationViewSet)
router.register(r'reviews', views.ReviewViewSet)
router.register(r'post-likes', views.PostLikeViewSet)
router.register(r'post-comments', views.PostCommentViewSet)
router.register(r'payment-transactions', views.PaymentTransactionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]