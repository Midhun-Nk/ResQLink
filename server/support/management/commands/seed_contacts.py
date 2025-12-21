from django.core.management.base import BaseCommand
from support.models import ContactCategory, EmergencyContact # Replace 'api' with your app name

class Command(BaseCommand):
    help = 'Seeds the database with Emergency Contact data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding Emergency Contacts...')

        # Data structure matching your React component
        seed_data = [
            {
                "category": "Immediate Response",
                "items": [
                    { "name": "Police Control", "number": "100", "icon": "ShieldAlert", "color": "blue" },
                    { "name": "Fire & Rescue", "number": "101", "icon": "Flame", "color": "orange" },
                    { "name": "Ambulance", "number": "108", "icon": "Stethoscope", "color": "rose" },
                    { "name": "Disaster Management", "number": "1077", "icon": "Siren", "color": "amber" },
                ]
            },
            {
                "category": "Specialized Forces",
                "items": [
                    { "name": "NDRF HQ", "number": "011-24363260", "icon": "LifeBuoy", "color": "cyan" },
                    { "name": "Coast Guard Search", "number": "1554", "icon": "ShieldAlert", "color": "sky" },
                    { "name": "Women Helpline", "number": "1091", "icon": "ShieldAlert", "color": "purple" },
                ]
            },
            {
                "category": "Utilities & Support",
                "items": [
                    { "name": "Electricity Board", "number": "1912", "icon": "Zap", "color": "yellow" },
                    { "name": "Gas Leakage", "number": "1906", "icon": "Flame", "color": "red" },
                ]
            }
        ]

        # Clear existing data to avoid duplicates
        ContactCategory.objects.all().delete()
        EmergencyContact.objects.all().delete()

        category_order = 0
        for section in seed_data:
            cat_obj = ContactCategory.objects.create(
                title=section['category'],
                order=category_order
            )
            category_order += 1
            
            self.stdout.write(f"Created Category: {cat_obj.title}")

            for item in section['items']:
                EmergencyContact.objects.create(
                    category=cat_obj,
                    name=item['name'],
                    number=item['number'],
                    icon_name=item['icon'],
                    color_theme=item['color']
                )

        self.stdout.write(self.style.SUCCESS('Successfully seeded Emergency Contacts!'))