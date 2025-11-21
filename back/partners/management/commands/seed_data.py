# partners/management/commands/seed_data.py
from django.core.management.base import BaseCommand
from partners.models import Game, User, UserGame, ContentPost
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Заполняет базу данных тестовыми данными'

    def handle(self, *args, **options):
        self.stdout.write('Создание тестовых данных...')
        
        # Создаем игры
        games_data = [
            {
                'name': 'Dota 2',
                'description': 'Многопользовательская онлайн-баталия',
                'icon_url': '/static/images/dota2.jpg'
            },
            {
                'name': 'Counter-Strike 2', 
                'description': 'Тактический шутер от первого лица',
                'icon_url': '/static/images/cs2.jpg'
            },
            {
                'name': 'Valorant',
                'description': 'Тактический шутер с персонажами',
                'icon_url': '/static/images/valorant.jpg'
            },
            {
                'name': 'League of Legends',
                'description': 'МОБА игра с огромной популярностью',
                'icon_url': '/static/images/lol.jpg'
            },
            {
                'name': 'Apex Legends',
                'description': 'Королевская битва от Respawn Entertainment',
                'icon_url': '/static/images/apex.jpg'
            }
        ]
        
        for game_data in games_data:
            game, created = Game.objects.get_or_create(
                name=game_data['name'],
                defaults=game_data
            )
            if created:
                self.stdout.write(f'Создана игра: {game.name}')
        
        # Создаем тестовых пользователей
        users_data = [
            {'username': 'pro_gamer', 'email': 'pro@example.com', 'password': 'test123'},
            {'username': 'streamer_queen', 'email': 'queen@example.com', 'password': 'test123'},
            {'username': 'esports_champ', 'email': 'champ@example.com', 'password': 'test123'},
        ]
        
        created_users = {}
        for user_data in users_data:
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults={
                    'email': user_data['email'],
                }
            )
            if created:
                user.set_password(user_data['password'])
                user.save()
                created_users[user_data['username']] = user
                self.stdout.write(f'Создан пользователь: {user.username}')
            else:
                created_users[user_data['username']] = user
        
        # Создаем связи пользователь-игры
        user_game_data = [
            {'user': 'pro_gamer', 'game': 'Dota 2', 'playtime_hours': 1500, 'current_rank': 'Immortal', 'is_primary': True},
            {'user': 'pro_gamer', 'game': 'Counter-Strike 2', 'playtime_hours': 800, 'current_rank': 'Global Elite', 'is_primary': False},
            {'user': 'streamer_queen', 'game': 'Valorant', 'playtime_hours': 1200, 'current_rank': 'Radiant', 'is_primary': True},
            {'user': 'esports_champ', 'game': 'League of Legends', 'playtime_hours': 2000, 'current_rank': 'Challenger', 'is_primary': True},
        ]
        
        for ug_data in user_game_data:
            user = created_users[ug_data['user']]
            game = Game.objects.get(name=ug_data['game'])
            
            user_game, created = UserGame.objects.get_or_create(
                user=user,
                game=game,
                defaults={
                    'playtime_hours': ug_data['playtime_hours'],
                    'current_rank': ug_data['current_rank'],
                    'is_primary': ug_data['is_primary']
                }
            )
            if created:
                self.stdout.write(f'Создана связь: {user.username} - {game.name}')
        
        # Создаем тестовые посты - ИСПРАВЛЕННАЯ ЧАСТЬ
        posts_data = [
            {
                'author': created_users['pro_gamer'],  # Теперь передаем объект User, а не строку
                'title': 'Мой гайд по Dota 2 для новичков',
                'content': 'В этом гайде я расскажу основы игры в Dota 2. Начнем с выбора героя и основных механик игры...',
                'access_type': 'free',
                'is_published': True
            },
            {
                'author': created_users['streamer_queen'],  # Объект User
                'title': 'Секреты Valorant которые вам не расскажут',
                'content': 'Эти стратегии помогут вам подняться в рейтинге. Поговорим о позиционировании и работе в команде...',
                'access_type': 'subscription',
                'price': 299.00,
                'is_published': True
            },
            {
                'author': created_users['esports_champ'],  # Объект User
                'title': 'Как достичь Challenger в League of Legends',
                'content': 'Мой путь от новичка до топового ранга. Советы по макро-игре и психологии...',
                'access_type': 'pay_per_view',
                'price': 499.00,
                'is_published': True
            }
        ]
        
        for post_data in posts_data:
            # Извлекаем автора из словаря created_users
            author = post_data.pop('author')  # Убираем автора из данных
            
            post, created = ContentPost.objects.get_or_create(
                title=post_data['title'],
                author=author,  # Передаем объект User
                defaults=post_data
            )
            if created:
                self.stdout.write(f'Создан пост: {post.title}')
        
        # Создаем подписки
        from partners.models import SubscriptionPlan, UserSubscription
        from datetime import datetime, timedelta
        
        subscription_plans_data = [
            {
                'author': created_users['pro_gamer'],
                'title': 'Базовый доступ',
                'description': 'Доступ к базовым гайдам и стримам',
                'price_per_month': 199.00
            },
            {
                'author': created_users['streamer_queen'],
                'title': 'Премиум подписка', 
                'description': 'Эксклюзивный контент и персональные консультации',
                'price_per_month': 499.00
            }
        ]
        
        for plan_data in subscription_plans_data:
            plan, created = SubscriptionPlan.objects.get_or_create(
                title=plan_data['title'],
                author=plan_data['author'],
                defaults=plan_data
            )
            if created:
                self.stdout.write(f'Создан план подписки: {plan.title}')
        
        # Создаем подписки пользователей
        subscription_data = [
            {
                'subscriber': created_users['streamer_queen'],
                'plan': SubscriptionPlan.objects.get(title='Базовый доступ', author=created_users['pro_gamer']),
                'status': 'active',
                'starts_at': datetime.now(),
                'ends_at': datetime.now() + timedelta(days=30)
            }
        ]
        
        for sub_data in subscription_data:
            subscription, created = UserSubscription.objects.get_or_create(
                subscriber=sub_data['subscriber'],
                plan=sub_data['plan'],
                defaults=sub_data
            )
            if created:
                self.stdout.write(f'Создана подписка: {subscription.subscriber.username} -> {subscription.plan.title}')
        
        self.stdout.write(self.style.SUCCESS('Тестовые данные успешно созданы!'))