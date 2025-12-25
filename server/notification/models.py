from django.db import models
from django.conf import settings

class Notification(models.Model):
    TYPE_CHOICES = [
        ('info', 'Information'),
        ('warning', 'Warning'),
        ('alert', 'Critical Alert'),
        ('success', 'Success'),
    ]

    # ✅ recipient is OPTIONAL (NULL = broadcast)
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='notifications',
        on_delete=models.CASCADE,
        null=True,
        blank=True)


    # ✅ identifies broadcast notifications
    is_broadcast = models.BooleanField(default=False)

    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        default='info'
    )

    # ⚠️ only valid for PERSONAL notifications
    is_read = models.BooleanField(default=False)

    is_banner = models.BooleanField(default=False)
    location = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)



    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        if self.is_broadcast:
            return f"[Broadcast] {self.title}"
        return f"{self.title} → {self.recipient}"
