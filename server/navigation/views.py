from rest_framework import viewsets
from .models import MapLocation
from .serializers import MapLocationSerializer

class MapLocationViewSet(viewsets.ModelViewSet):
    queryset = MapLocation.objects.all()
    serializer_class = MapLocationSerializer