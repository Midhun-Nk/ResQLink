from rest_framework import serializers
from .models import RescueChannel

class RescueChannelSerializer(serializers.ModelSerializer):
    # Explicitly include the computed properties
    total_participants = serializers.ReadOnlyField()
    participant_avatars = serializers.ReadOnlyField()

    class Meta:
        model = RescueChannel
        fields = [
            'id', 'title', 'description', 'sector', 
            'is_live', 'created_at', 
            'total_participants', 'participant_avatars'
        ]