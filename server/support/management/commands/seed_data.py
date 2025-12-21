from django.core.management.base import BaseCommand
from support.models import Disaster, SafetyProtocol, FirstAidGuide  # Change 'api' to your actual app name

class Command(BaseCommand):
    help = 'Seeds the database with initial Safety and First Aid data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')

        # --- 1. SEED DISASTERS & PROTOCOLS ---
        safety_data = {
            "flood": {
                "title": "Flood & Flash Floods",
                "icon_name": "Droplets",
                "color_theme": "blue",
                "phases": {
                    "before": [
                        "Know the elevation of your property in relation to flood plains.",
                        "Install check valves in sewer traps to prevent floodwater backing up.",
                        "Seal walls in basements with waterproofing compounds.",
                        "Elevate the furnace, water heater, and electric panel."
                    ],
                    "during": [
                        "Turn off utilities at the main switches or valves.",
                        "Disconnect electrical appliances (do not touch if you are wet).",
                        "Do not walk through moving water. Six inches is enough to knock you down.",
                        "If trapped in a building, move to the highest level (roof) and signal for help."
                    ],
                    "after": [
                        "Listen for news reports to learn whether the community's water supply is safe.",
                        "Avoid floodwaters; water may be contaminated by oil, gasoline, or raw sewage.",
                        "Clean and disinfect everything that got wet.",
                        "Watch out for snakes and animals that may have entered your home."
                    ]
                }
            },
            "fire": {
                "title": "Structural Fire",
                "icon_name": "Flame",
                "color_theme": "orange",
                "phases": {
                    "before": [
                        "Install smoke alarms on every level of your home.",
                        "Plan two ways out of every room.",
                        "Check electrical wiring and replace frayed cords immediately.",
                        "Keep a fire extinguisher in the kitchen and garage."
                    ],
                    "during": [
                        "Crawl low under smoke. The cleanest air is 12 to 24 inches off the floor.",
                        "Test doors with the back of your hand before opening. If hot, use another exit.",
                        "If your clothes catch fire: Stop, Drop, and Roll.",
                        "Never use an elevator during a fire."
                    ],
                    "after": [
                        "Do not enter the building until authorities say it is safe.",
                        "Check for structural damage to roofs and walls.",
                        "Discard food, beverages, and medicines exposed to heat or smoke."
                    ]
                }
            },
            "earthquake": {
                "title": "Earthquake",
                "icon_name": "Zap",
                "color_theme": "amber",
                "phases": {
                    "before": [
                        "Secure heavy furniture (bookshelves, water heaters) to wall studs.",
                        "Practice 'Drop, Cover, and Hold On'.",
                        "Locate safe spots in each room (under sturdy tables).",
                        "Store breakable items in low, closed cabinets with latches."
                    ],
                    "during": [
                        "If indoors: Drop to the ground, Cover your head, Hold on to shelter.",
                        "Stay away from glass, windows, outside doors, and walls.",
                        "If outdoors: Move to a clear area away from trees, signs, and buildings.",
                        "If driving: Pull over to a clear location and stop."
                    ],
                    "after": [
                        "Expect aftershocks. Each time you feel one, drop, cover, and hold on.",
                        "Check for gas leaks. If you smell gas, turn off the main valve and leave.",
                        "Open cabinets cautiously. Beware of objects that can fall off shelves."
                    ]
                }
            },
            "cyclone": {
                "title": "Cyclone & Storms",
                "icon_name": "Wind",
                "color_theme": "teal",
                "phases": {
                    "before": [
                        "Trim trees and shrubs around your home to make them more wind resistant.",
                        "Clear loose and clogged rain gutters and downspouts.",
                        "Bring in outdoor furniture, decorations, and garbage cans.",
                        "Board up windows or use storm shutters."
                    ],
                    "during": [
                        "Stay indoors and away from windows and glass doors.",
                        "Close all interior doors—secure and brace external doors.",
                        "Lie on the floor under a table or another sturdy object.",
                        "Do not be fooled if the eye of the storm passes (winds will return)."
                    ],
                    "after": [
                        "Stay out of damaged buildings.",
                        "Watch out for fallen power lines and report them.",
                        "Use battery-powered flashlights. Do not use candles (gas leak risk)."
                    ]
                }
            },
            "tsunami": {
                "title": "Tsunami",
                "icon_name": "Waves",
                "color_theme": "cyan",
                "phases": {
                    "before": ["Map out evacuation routes to high ground (100ft above sea level).", "Listen for warning sirens."],
                    "during": ["If you feel an earthquake near the coast, move to high ground immediately.", "Do not wait for an official warning.", "Never go to the beach to watch the waves."],
                    "after": ["Stay away from coastal areas until officials say it is safe.", "Be aware of secondary waves which can be larger."]
                }
            },
            "landslide": {
                "title": "Landslide",
                "icon_name": "MountainSnow",
                "color_theme": "stone",
                "phases": {
                    "before": ["Monitor drainage patterns on land.", "Plant ground cover on slopes."],
                    "during": ["Listen for unusual sounds like trees cracking or boulders knocking.", "Move away from the path of the slide.", "Curl into a tight ball and protect your head."],
                    "after": ["Stay away from the slide area (flooding may follow).", "Check for injured trapped persons without entering the slide area."]
                }
            },
            "chemical": {
                "title": "Chemical Leak",
                "icon_name": "Skull",
                "color_theme": "purple",
                "phases": {
                    "before": ["Make an internal shelter kit (duct tape, plastic sheeting)."],
                    "during": ["Close all windows, vents, and fireplace dampers.", "Turn off air conditioning.", "Go into an interior room and seal it (Shelter-in-place)."],
                    "after": ["Open windows to ventilate once 'All Clear' is given.", "Shower and change clothes immediately."]
                }
            },
            "heatwave": {
                "title": "Extreme Heat",
                "icon_name": "ThermometerSun",
                "color_theme": "rose",
                "phases": {
                    "before": ["Install window reflectors.", "Insulate water pipes."],
                    "during": ["Stay indoors during the hottest part of the day.", "Drink plenty of water even if not thirsty.", "Wear light, loose-fitting clothing."],
                    "after": ["Continue to hydrate.", "Check on elderly neighbors."]
                }
            }
        }

        for slug, data in safety_data.items():
            disaster, created = Disaster.objects.get_or_create(
                slug=slug,
                defaults={
                    'title': data['title'],
                    'icon_name': data['icon_name'],
                    'color_theme': data['color_theme']
                }
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created Disaster: {data['title']}"))
            else:
                self.stdout.write(f"Disaster {data['title']} already exists.")

            # Create Protocols
            for phase, steps in data['phases'].items():
                for index, step_content in enumerate(steps):
                    SafetyProtocol.objects.get_or_create(
                        disaster=disaster,
                        phase=phase,
                        content=step_content,
                        defaults={'order': index}
                    )

        # --- 2. SEED FIRST AID DATA ---
        first_aid_data = [
            {
                "title": "CPR (Adult)",
                "type": "critical",
                "steps": ["Check response.", "Call 108.", "Push hard & fast in center of chest.", "30 compressions, 2 breaths."]
            },
            {
                "title": "Severe Bleeding",
                "type": "critical",
                "steps": ["Apply direct pressure.", "Do not remove cloth if soaked.", "Elevate injury above heart.", "Keep warm."]
            },
            {
                "title": "Burns",
                "type": "standard",
                "steps": ["Cool with water (10 mins).", "Remove jewelry.", "Cover with clean bag.", "No ice/creams."]
            }
        ]

        for item in first_aid_data:
            # Join list into a single string for the TextField
            steps_text = "\n".join(item['steps'])
            
            FirstAidGuide.objects.get_or_create(
                title=item['title'],
                defaults={
                    'guide_type': item['type'],
                    'steps_text': steps_text
                }
            )
            self.stdout.write(self.style.SUCCESS(f"Processed First Aid: {item['title']}"))

        self.stdout.write(self.style.SUCCESS('Database seeding completed successfully.'))