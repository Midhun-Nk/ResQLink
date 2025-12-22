from django.db import models

class MapLocation(models.Model):
    TYPE_CHOICES = [
        ('danger', 'Danger Zone'),
        ('safe', 'Safe Haven'),
    ]

    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    location_type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    radius = models.FloatField(default=1000, help_text="Radius in meters (for Danger Zones)")
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.location_type})"