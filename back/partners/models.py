from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator

class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    avatar_url = models.URLField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    is_2fa_enabled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.username

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    timezone = models.CharField(max_length=50, blank=True, null=True)
    preferred_language = models.CharField(max_length=10, blank=True, null=True)

class UserSocialAuth(models.Model):
    social_id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    provider = models.CharField(max_length=20)
    provider_user_id = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['provider', 'provider_user_id']

class Game(models.Model):
    game_id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    icon_url = models.URLField(blank=True, null=True)
    
    def __str__(self):
        return self.name

class UserGame(models.Model):
    user_game_id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    playtime_hours = models.IntegerField(default=0)
    current_rank = models.CharField(max_length=100, blank=True, null=True)
    max_rank = models.CharField(max_length=100, blank=True, null=True)
    is_primary = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ['user', 'game']

class Achievement(models.Model):
    achievement_id = models.BigAutoField(primary_key=True)
    user_game = models.ForeignKey(UserGame, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    icon_url = models.URLField(blank=True, null=True)
    unlocked_at = models.DateField(auto_now_add=True)

class ContentPost(models.Model):
    ACCESS_TYPES = [
        ('free', 'Бесплатно'),
        ('subscription', 'По подписке'),
        ('pay_per_view', 'Платный доступ'),
    ]
    
    post_id = models.BigAutoField(primary_key=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    title = models.CharField(max_length=500)
    content = models.TextField()
    preview_image_url = models.URLField(blank=True, null=True)
    access_type = models.CharField(max_length=20, choices=ACCESS_TYPES, default='free')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(blank=True, null=True)
    
    def __str__(self):
        return self.title

class UserGallery(models.Model):
    ACCESS_TYPES = [
        ('free', 'Бесплатно'),
        ('subscription', 'По подписке'),
        ('pay_per_view', 'Платный доступ'),
    ]
    
    image_id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image_url = models.URLField()
    caption = models.CharField(max_length=500, blank=True, null=True)
    access_type = models.CharField(max_length=20, choices=ACCESS_TYPES, default='free')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    uploaded_at = models.DateTimeField(auto_now_add=True)

class SubscriptionPlan(models.Model):
    plan_id = models.BigAutoField(primary_key=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscription_plans')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price_per_month = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.title} - {self.author.username}"

class UserSubscription(models.Model):
    STATUS_CHOICES = [
        ('active', 'Активная'),
        ('canceled', 'Отменена'),
        ('expired', 'Истекла'),
    ]
    
    subscription_id = models.BigAutoField(primary_key=True)
    subscriber = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

class Purchase(models.Model):
    CONTENT_TYPES = [
        ('post', 'Пост'),
        ('gallery_image', 'Изображение галереи'),
    ]
    
    purchase_id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPES)
    content_id = models.BigIntegerField()
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    purchased_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'content_type', 'content_id']

class Follow(models.Model):
    follow_id = models.BigAutoField(primary_key=True)
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following')
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name='followers')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['follower', 'following']

class Conversation(models.Model):
    conversation_id = models.BigAutoField(primary_key=True)
    is_group = models.BooleanField(default=False)
    title = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class ConversationParticipant(models.Model):
    participant_id = models.BigAutoField(primary_key=True)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['conversation', 'user']

class Message(models.Model):
    message_id = models.BigAutoField(primary_key=True)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    attachment_url = models.URLField(blank=True, null=True)
    is_edited = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class Notification(models.Model):
    notification_id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=50)
    title = models.CharField(max_length=255)
    message = models.TextField(blank=True, null=True)
    related_entity_type = models.CharField(max_length=50, blank=True, null=True)
    related_entity_id = models.BigIntegerField(blank=True, null=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class Review(models.Model):
    review_id = models.BigAutoField(primary_key=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='authored_reviews')
    target = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    rating = models.SmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['author', 'target']

class PostLike(models.Model):
    like_id = models.BigAutoField(primary_key=True)
    post = models.ForeignKey(ContentPost, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['post', 'user']

class PostComment(models.Model):
    comment_id = models.BigAutoField(primary_key=True)
    post = models.ForeignKey(ContentPost, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    parent_comment = models.ForeignKey('self', on_delete=models.CASCADE, blank=True, null=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class PaymentTransaction(models.Model):
    TRANSACTION_TYPES = [
        ('subscription', 'Подписка'),
        ('one_time_purchase', 'Разовая покупка'),
        ('payout', 'Выплата'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'В обработке'),
        ('completed', 'Завершена'),
        ('failed', 'Неудача'),
        ('refunded', 'Возврат'),
    ]
    
    transaction_id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='RUB')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_system = models.CharField(max_length=50, blank=True, null=True)
    payment_system_id = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)