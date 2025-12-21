from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from rescue.models import RescueChannel # Update 'api' to your app name
import random

class Command(BaseCommand):
    help = 'Seeds the database with Rescue Channels'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding Rescue Channels...')

        # Ensure we have some users to act as participants
        if User.objects.count() < 10:
            for i in range(10):
                User.objects.create_user(username=f'rescuer_{i}', password='password')
        users = list(User.objects.all())

        channels_data = [
            { 'title': 'Kerala Flood Command', 'description': 'Rescue boat coordination channel.', 'sector': 'Fire', 'is_live': True },
            { 'title': 'Trauma Unit Alpha', 'description': 'Medical triage support and ambulance routing.', 'sector': 'Medical', 'is_live': True },
            { 'title': 'Traffic Sector 7', 'description': 'Route clearance for emergency vehicles.', 'sector': 'Police', 'is_live': False },
            { 'title': 'Public Helpline', 'description': 'General inquiries and volunteer coordination.', 'sector': 'General', 'is_live': True },
        ]

        RescueChannel.objects.all().delete()

        for data in channels_data:
            channel = RescueChannel.objects.create(**data)
            # Add 3 to 8 random users to this channel
            channel.participants.set(random.sample(users, k=random.randint(3, 8)))
            self.stdout.write(f"Created: {channel.title}")

        self.stdout.write(self.style.SUCCESS('Seeding Complete!'))