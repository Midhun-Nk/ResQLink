from django.db import models
from django.conf import settings # <--- IMPORT SETTINGS

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
    
    # FIX: Use settings.AUTH_USER_MODEL instead of direct User import
    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL, 
        related_name='joined_channels', 
        blank=True
    )
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.sector})"

    @property
    def total_participants(self):
        return self.participants.count()

    @property
    def participant_avatars(self):
        # Using a dummy avatar service based on user ID for now
        return [f"https://i.pravatar.cc/150?u={user.id}" for user in self.participants.all()[:5]]