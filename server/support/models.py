from django.db import models

class Disaster(models.Model):
    # e.g., "flood", "fire" (used for API lookups)
    slug = models.SlugField(primary_key=True, max_length=50)
    
    # e.g., "Flood & Flash Floods"
    title = models.CharField(max_length=200)
    
    # Store the Lucide icon name as a string (e.g., "Droplets")
    # Frontend will map this string to the actual Component
    icon_name = models.CharField(max_length=50)
    
    # e.g., "blue", "orange"
    color_theme = models.CharField(max_length=50)

    def __str__(self):
        return self.title

class SafetyProtocol(models.Model):
    PHASE_CHOICES = [
        ('before', 'Before Event'),
        ('during', 'During Event'),
        ('after', 'After Event'),
    ]

    disaster = models.ForeignKey(Disaster, related_name='protocols', on_delete=models.CASCADE)
    phase = models.CharField(max_length=20, choices=PHASE_CHOICES)
    
    # The actual instruction text
    content = models.TextField()
    
    # To ensure steps appear in the correct order (1, 2, 3...)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.disaster.title} - {self.phase} - {self.order}"

# Bonus: Model for the First Aid sidebar
class FirstAidGuide(models.Model):
    TYPE_CHOICES = [('critical', 'Critical'), ('standard', 'Standard')]
    
    title = models.CharField(max_length=100)
    guide_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    
    # Store steps as a newline-separated string or use JSONField if using MySQL 5.7+
    # Here we use TextField for broad compatibility; split by newline in serializer.
    steps_text = models.TextField(help_text="Enter each step on a new line")

    def __str__(self):
        return self.title
    



class ContactCategory(models.Model):
    title = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0, help_text="Order to display on the page")

    class Meta:
        ordering = ['order']
        verbose_name_plural = "Contact Categories"

    def __str__(self):
        return self.title

class EmergencyContact(models.Model):
    category = models.ForeignKey(ContactCategory, related_name='contacts', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    number = models.CharField(max_length=50) # CharField to allow "+91" or "011-"
    
    # Store the Lucide React icon name string (e.g., "ShieldAlert", "Flame")
    icon_name = models.CharField(max_length=50) 
    
    # Store the color key (e.g., "blue", "rose", "cyan")
    color_theme = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.name} ({self.number})"