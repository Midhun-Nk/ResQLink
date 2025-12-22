from rest_framework import serializers
from .models import MapLocation

class MapLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = MapLocation
        fields = '__all__'