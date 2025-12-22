from django.core.management.base import BaseCommand
from navigation.models import MapLocation  # Adjust 'api' to your app name

class Command(BaseCommand):
    help = 'Seeds the database with Disaster Map Locations for Kozhikode'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding Map Locations for Kozhikode...')

        locations_data = [
            # --- DANGER ZONES ---
            {
                "title": "Kozhikode Beach Sector",
                "description": "High risk of coastal erosion and tidal surge during monsoon.",
                "latitude": 11.2626,
                "longitude": 75.7673,
                "location_type": "danger",
                "radius": 800  # meters
            },
            {
                "title": "Beypore Port Area",
                "description": "Potential flood zone due to river estuary overflow.",
                "latitude": 11.1646,
                "longitude": 75.8039,
                "location_type": "danger",
                "radius": 1200
            },
            {
                "title": "Sarovaram Bio Park (Canoli Canal)",
                "description": "Low-lying wetland area prone to rapid flash floods.",
                "latitude": 11.2655,
                "longitude": 75.7985,
                "location_type": "danger",
                "radius": 600
            },
            {
                "title": "Kappad Coastal Line",
                "description": "Tsunami vulnerable zone. Immediate evacuation required if siren sounds.",
                "latitude": 11.3891,
                "longitude": 75.7208,
                "location_type": "danger",
                "radius": 1500
            },
            {
                "title": "Mavoor Road Junction",
                "description": "High urban waterlogging zone during heavy rains.",
                "latitude": 11.2588,
                "longitude": 75.7804,
                "location_type": "danger",
                "radius": 400
            },

            # --- SAFE HAVENS ---
            {
                "title": "Govt Medical College",
                "description": "Primary trauma center and emergency medical shelter.",
                "latitude": 11.2723,
                "longitude": 75.8375,
                "location_type": "safe",
                "radius": 0 # Radius ignored for safe havens
            },
            {
                "title": "Civil Station (Collectorate)",
                "description": "Central Command Center & Heli-pad access.",
                "latitude": 11.2842,
                "longitude": 75.7963,
                "location_type": "safe",
                "radius": 0
            },
            {
                "title": "Mananchira Square High Ground",
                "description": "Assembly point for city center evacuation.",
                "latitude": 11.2543,
                "longitude": 75.7760,
                "location_type": "safe",
                "radius": 0
            },
            {
                "title": "Feroke Higher Secondary School",
                "description": "Designated flood relief camp for southern sector.",
                "latitude": 11.1963,
                "longitude": 75.8364,
                "location_type": "safe",
                "radius": 0
            },
            {
                "title": "IIM Kozhikode Campus",
                "description": "Strategic highland shelter for Kunnamangalam area.",
                "latitude": 11.2877,
                "longitude": 75.8679,
                "location_type": "safe",
                "radius": 0
            }
        ]

        # Optional: Clear existing data to prevent duplicates
        MapLocation.objects.all().delete()

        for loc in locations_data:
            MapLocation.objects.create(**loc)
            self.stdout.write(f"Created: {loc['title']}")

        self.stdout.write(self.style.SUCCESS('Successfully seeded Kozhikode locations!'))