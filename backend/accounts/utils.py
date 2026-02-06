import random
import string
from django.utils import timezone
from datetime import timedelta

def generate_thematic_nickname():
    """Generate a system-controlled Telugu snack username with a random number."""
    snacks = [
        "Punugu", "Mirchi", "Garelu", "Majjiga", "Bobbatlu", "Sakinala", "Chekkalu", "Laddu", 
        "Jonna", "Pappu", "Pulihora", "Dosa", "Idli", "Vada", "Chai", "Biryani", "Rasam", 
        "Jilebi", "Mysore", "Karam", "Pakodi", "Murukku", "Boorelu", "Ariselu", "Sunnundalu", 
        "Kobbari", "Panasa", "Bellam", "Gongura", "Avakai", "Sambar", "Upma", "Pongal", 
        "Payasam", "Badusha", "Halwa", "Lassi", "Buttermilk", "Falooda", "Bonda", "Cutlet", 
        "Chikki", "Mango", "Coconut", "Sugarcane", "GoliSoda", "Kulfi", "Milkshake", "Coffee", 
        "TeaTime", "Biscuit", "Rusk", "Butter", "Cheese", "Popcorn", "Nacho", "Roll", 
        "Sandwich", "Burger", "Pizza", "Noodle", "Pasta", "Momos", "SpringRoll", "Dumpling", 
        "Choco", "Candy", "Toffee", "Caramel", "Vanilla", "Strawberry", "Blueberry", 
        "Pineapple", "Orange", "Apple", "Grape"
    ]
    suffixes = [
        "Prince", "Macha", "Gamer", "Mood", "Boss", "Soul", "Champ", "Legend", "Joy", 
        "Power", "Pal", "Dynamo", "Icon", "Vibes", "Charger", "Buddy", "Rider", "Joker", 
        "Magic", "King", "Pro", "Ace", "Star", "Guy", "Ultra", "Hero", "Fan", "Ninja", 
        "Dude", "Orbit"
    ]
    
    snack = random.choice(snacks)
    suffix = random.choice(suffixes)
    number = random.randint(10, 9999) # 2-4 digits
    
    return f"{snack}{suffix}{number}"
