from rest_framework import viewsets, permissions
from django.db.models import Q
from django.contrib.auth import get_user_model
from .models import *
from .serializers import *

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = ProfileWithGamesSerializer  # Используем новый сериализатор
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = UserProfile.objects.all()
        
        # Фильтрация по поиску
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(user__username__icontains=search) |
                Q(user__user_games__game__name__icontains=search)
            ).distinct()
        
        # Фильтрация по игре
        game = self.request.query_params.get('game')
        if game:
            queryset = queryset.filter(user__user_games__game_id=game)
        
        # Сортировка
        sort_by = self.request.query_params.get('sort_by')
        if sort_by == 'rating':
            # Сортировка по рейтингу (пока заглушка)
            queryset = queryset.order_by('-user__username')
        elif sort_by == 'followers':
            # Сортировка по подписчикам (пока заглушка)
            queryset = queryset.order_by('-user__username')
        elif sort_by == 'newest':
            queryset = queryset.order_by('-user__created_at')
        else:
            queryset = queryset.order_by('-user__username')
        
        return queryset

class UserSocialAuthViewSet(viewsets.ModelViewSet):
    queryset = UserSocialAuth.objects.all()
    serializer_class = UserSocialAuthSerializer
    permission_classes = [permissions.AllowAny]

class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [permissions.AllowAny]

class UserGameViewSet(viewsets.ModelViewSet):
    queryset = UserGame.objects.all()
    serializer_class = UserGameSerializer
    permission_classes = [permissions.AllowAny]

class AchievementViewSet(viewsets.ModelViewSet):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    permission_classes = [permissions.AllowAny]

class ContentPostViewSet(viewsets.ModelViewSet):
    queryset = ContentPost.objects.all()
    serializer_class = ContentPostSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = ContentPost.objects.all()
        author_id = self.request.query_params.get('author')
        if author_id:
            queryset = queryset.filter(author_id=author_id)
        return queryset

class UserGalleryViewSet(viewsets.ModelViewSet):
    queryset = UserGallery.objects.all()
    serializer_class = UserGallerySerializer
    permission_classes = [permissions.AllowAny]

class SubscriptionPlanViewSet(viewsets.ModelViewSet):
    queryset = SubscriptionPlan.objects.all()
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = SubscriptionPlan.objects.all()
        author_id = self.request.query_params.get('author')
        if author_id:
            queryset = queryset.filter(author_id=author_id)
        return queryset

class UserSubscriptionViewSet(viewsets.ModelViewSet):
    queryset = UserSubscription.objects.all()
    serializer_class = UserSubscriptionSerializer
    permission_classes = [permissions.AllowAny]

class PurchaseViewSet(viewsets.ModelViewSet):
    queryset = Purchase.objects.all()
    serializer_class = PurchaseSerializer
    permission_classes = [permissions.AllowAny]

class FollowViewSet(viewsets.ModelViewSet):
    queryset = Follow.objects.all()
    serializer_class = FollowSerializer
    permission_classes = [permissions.AllowAny]

class ConversationViewSet(viewsets.ModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
    permission_classes = [permissions.AllowAny]

class ConversationParticipantViewSet(viewsets.ModelViewSet):
    queryset = ConversationParticipant.objects.all()
    serializer_class = ConversationParticipantSerializer
    permission_classes = [permissions.AllowAny]

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.AllowAny]

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.AllowAny]

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]

class PostLikeViewSet(viewsets.ModelViewSet):
    queryset = PostLike.objects.all()
    serializer_class = PostLikeSerializer
    permission_classes = [permissions.AllowAny]

class PostCommentViewSet(viewsets.ModelViewSet):
    queryset = PostComment.objects.all()
    serializer_class = PostCommentSerializer
    permission_classes = [permissions.AllowAny]

class PaymentTransactionViewSet(viewsets.ModelViewSet):
    queryset = PaymentTransaction.objects.all()
    serializer_class = PaymentTransactionSerializer
    permission_classes = [permissions.AllowAny]