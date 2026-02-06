import random
import string
from django.utils import timezone
from datetime import timedelta

def generate_thematic_nickname():
    """Generate a system-controlled Telugu snack username with a random number."""
    snacks = [
        "Punugulu", "Bobbatlu", "MirchiBajji", "Garelu", "Majjiga", "Sakinala", "Chekkalu", "Laddu", 
        "Pulihora", "Bondalu", "Ariselu", "Sunnundalu", "KobbariLauzu", "Avakai", "MysoreBondam",
        "Jilebi", "Murukku", "Boorelu", "KaramPusa", "Paalakova", "Pootharekulu", "Gongura",
        "PappuChekka", "AtukulaUpma", "SamosaGadu", "ChaiBisket", "VadaPavGadu", "PeruguVada",
        "Chikki", "MangoPachadi", "GoliSoda", "Panakam", "Payasam", "Badusha"
    ]
    suffixes = [
        "Mama", "Anna", "Thammudu", "Dosthu", "Vibes", "Gadu", "Soul", "Rider", "Boss",
        "Power", "Icon", "Magic", "King", "Ace", "Star", "Ninja", "Dude", "Fan", "Dada"
    ]
    
    snack = random.choice(snacks)
    suffix = random.choice(suffixes)
    number = random.randint(10, 9999) # 2-4 digits
    
    return f"{snack}{suffix}{number}"
