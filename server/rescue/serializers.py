from rest_framework import serializers
from .models import RescueChannel

class RescueChannelSerializer(serializers.ModelSerializer):
    # Map backend snake_case to frontend camelCase
    isLive = serializers.BooleanField(source='is_live')
    totalParticipants = serializers.IntegerField(source='total_participants', read_only=True)
    participants = serializers.ListField(source='participant_avatars', read_only=True)

    class Meta:
        model = RescueChannel
        fields = ['id', 'title', 'description', 'sector', 'isLive', 'totalParticipants', 'participants']