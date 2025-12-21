from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User

class RescueChannel(models.Model):
    SECTOR_CHOICES = [
        ('Fire', 'Fire & Rescue'),
        ('Medical', 'Medical'),
        ('Police', 'Police'),
        ('General', 'General / Public'),
    ]

    title = models.CharField(max_length=100)
    description = models.TextField()
    sector = models.CharField(max_length=20, choices=SECTOR_CHOICES, default='General')
    is_live = models.BooleanField(default=False)
    
    # Store users who are currently in the channel
    participants = models.ManyToManyField(User, related_name='joined_channels', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.sector})"

    # Helper property to get the count for the frontend
    @property
    def total_participants(self):
        return self.participants.count()

    # Helper property to generate avatar URLs for the frontend
    @property
    def participant_avatars(self):
        # In a real app, this would return 'user.profile.avatar.url'
        # Here we simulate it using pravatar.cc based on user ID
        return [f"https://i.pravatar.cc/150?u={user.id}" for user in self.participants.all()[:5]]