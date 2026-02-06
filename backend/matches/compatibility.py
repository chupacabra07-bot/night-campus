"""
Compatibility calculation engine for match meters.
Each meter returns a dict with: {value: 0-100, label: str, tooltip: str}
"""
import random
from datetime import datetime
from typing import Dict, List, Any


def calculate_all_meters(user1_profile: Dict, user2_profile: Dict) -> Dict[str, Dict]:
    """Calculate all 12 compatibility meters between two users."""
    
    meters = {
        'vibe_collision': calculate_vibe_collision(user1_profile, user2_profile),
        'shared_brain_cell': calculate_shared_brain_cell(user1_profile, user2_profile),
        'awkward_silence': calculate_awkward_silence(user1_profile, user2_profile),
        'chaos_escalation': calculate_chaos_escalation(user1_profile, user2_profile),
        'texting_energy': calculate_texting_energy(user1_profile, user2_profile),
        'social_battery': calculate_social_battery(user1_profile, user2_profile),
        'inside_joke_speed': calculate_inside_joke_speed(user1_profile, user2_profile),
        'emotional_damage': calculate_emotional_damage(user1_profile, user2_profile),
        'personality_sync': calculate_personality_sync(user1_profile, user2_profile),
        'argument_survival': calculate_argument_survival(user1_profile, user2_profile),
        'event_attendance': calculate_event_attendance(user1_profile, user2_profile),
        'unhinged_combo': calculate_unhinged_combo(user1_profile, user2_profile),
    }
    
    return meters


def add_randomness(value: float) -> float:
    """Add ±10% randomness for deniability."""
    return max(0, min(100, value + random.uniform(-10, 10)))


def get_label(value: float, labels: Dict[str, str]) -> str:
    """Convert numeric value to sarcastic label."""
    if value < 33:
        return labels['low']
    elif value < 67:
        return labels['medium']
    else:
        return labels['high']


def calculate_vibe_collision(u1: Dict, u2: Dict) -> Dict:
    """When your personalities meet, do they bounce or explode?"""
    
    # Brain type compatibility matrix
    brain_compat = {
        ('overthinker', 'overthinker'): 80,
        ('flow', 'flow'): 75,
        ('chaos', 'chaos'): 90,
        ('delulu', 'delulu'): 85,
    }
    
    brain_score = brain_compat.get((u1.get('brain_type'), u2.get('brain_type')), 50)
    
    # Social energy overlap
    social1 = set(u1.get('social_energy', []))
    social2 = set(u2.get('social_energy', []))
    social_overlap = len(social1 & social2) / max(len(social1 | social2), 1) * 30
    
    value = add_randomness(brain_score * 0.6 + social_overlap)
    
    labels = {
        'low': 'Polite strangers',
        'medium': 'Noticeable tension',
        'high': 'Immediate lore'
    }
    
    return {
        'value': round(value),
        'label': get_label(value, labels),
        'tooltip': 'Brain type + social energy overlap + cosmic alignment'
    }


def calculate_shared_brain_cell(u1: Dict, u2: Dict) -> Dict:
    """How often you think the same thought."""
    
    interests1 = set(u1.get('interests', []))
    interests2 = set(u2.get('interests', []))
    
    if not interests1 or not interests2:
        shared_score = 30
    else:
        shared_score = len(interests1 & interests2) / len(interests1 | interests2) * 100
    
    value = add_randomness(shared_score)
    
    labels = {
        'low': 'Separate operating systems',
        'medium': 'Occasional overlap',
        'high': 'One brain, two bodies'
    }
    
    return {
        'value': round(value),
        'label': get_label(value, labels),
        'tooltip': 'Shared interests + questionable life choices'
    }


def calculate_awkward_silence(u1: Dict, u2: Dict) -> Dict:
    """Minutes before someone checks their phone."""
    
    # Introverts handle silence better
    social1 = u1.get('social_energy', [])
    social2 = u2.get('social_energy', [])
    
    introvert_score = 0
    if 'recharge_alone' in social1 and 'recharge_alone' in social2:
        introvert_score = 70
    elif 'recharge_alone' in social1 or 'recharge_alone' in social2:
        introvert_score = 40
    else:
        introvert_score = 20
    
    # Connection intent compatibility
    intent1 = u1.get('connection_intent', [])
    intent2 = u2.get('connection_intent', [])
    intent_overlap = len(set(intent1) & set(intent2)) / max(len(set(intent1) | set(intent2)), 1) * 30
    
    value = add_randomness(introvert_score * 0.7 + intent_overlap)
    
    labels = {
        'low': 'Painfully long',
        'medium': 'Manageable discomfort',
        'high': 'Comfortably quiet'
    }
    
    return {
        'value': round(value),
        'label': get_label(value, labels),
        'tooltip': 'Social energy + comfort with awkwardness'
    }


def calculate_chaos_escalation(u1: Dict, u2: Dict) -> Dict:
    """How fast this turns into a bad idea."""
    
    chaos_brains = ['chaos', 'delulu', 'wifi']
    
    chaos_score = 0
    if u1.get('brain_type') in chaos_brains:
        chaos_score += 40
    if u2.get('brain_type') in chaos_brains:
        chaos_score += 40
    
    # Random people are more chaotic
    if 'random' in u1.get('connection_intent', []):
        chaos_score += 10
    if 'random' in u2.get('connection_intent', []):
        chaos_score += 10
    
    value = add_randomness(chaos_score)
    
    labels = {
        'low': 'Risk-averse',
        'medium': 'Minor crimes (emotional)',
        'high': 'Stories with consequences'
    }
    
    return {
        'value': round(value),
        'label': get_label(value, labels),
        'tooltip': 'Brain types + questionable decision-making history'
    }


def calculate_texting_energy(u1: Dict, u2: Dict) -> Dict:
    """Reply speed vs emotional effort."""
    
    # Overthinkers take longer to reply
    brain1 = u1.get('brain_type')
    brain2 = u2.get('brain_type')
    
    if brain1 == brain2:
        sync_score = 70
    elif (brain1 == 'overthinker' and brain2 == 'flow') or (brain1 == 'flow' and brain2 == 'overthinker'):
        sync_score = 30  # Mismatch
    else:
        sync_score = 50
    
    value = add_randomness(sync_score)
    
    labels = {
        'low': 'Seen at 3 AM',
        'medium': 'Overthinking replies',
        'high': 'Typing simultaneously'
    }
    
    return {
        'value': round(value),
        'label': get_label(value, labels),
        'tooltip': 'Communication styles + anxiety levels'
    }


def calculate_social_battery(u1: Dict, u2: Dict) -> Dict:
    """Who leaves first."""
    
    social1 = set(u1.get('social_energy', []))
    social2 = set(u2.get('social_energy', []))
    
    overlap = len(social1 & social2) / max(len(social1 | social2), 1) * 100
    
    value = add_randomness(overlap)
    
    labels = {
        'low': 'One vanishes',
        'medium': 'Negotiated exit',
        'high': 'Irish goodbye together'
    }
    
    return {
        'value': round(value),
        'label': get_label(value, labels),
        'tooltip': 'Energy levels + social stamina'
    }


def calculate_inside_joke_speed(u1: Dict, u2: Dict) -> Dict:
    """How fast nonsense becomes tradition."""
    
    # Shared humor indicators
    interests1 = set(u1.get('interests', []))
    interests2 = set(u2.get('interests', []))
    
    humor_interests = {'memes', 'chaos', 'random'}
    humor_score = len((interests1 | interests2) & humor_interests) * 20
    
    # Chaos brains form jokes faster
    if u1.get('brain_type') in ['chaos', 'delulu'] and u2.get('brain_type') in ['chaos', 'delulu']:
        humor_score += 40
    
    value = add_randomness(humor_score)
    
    labels = {
        'low': 'Still using names',
        'medium': 'Running bits forming',
        'high': 'No context required'
    }
    
    return {
        'value': round(value),
        'label': get_label(value, labels),
        'tooltip': 'Shared humor + chaos compatibility'
    }


def calculate_emotional_damage(u1: Dict, u2: Dict) -> Dict:
    """Likelihood of accidental attachment."""
    
    # Deep connection seekers = higher risk
    intent1 = u1.get('connection_intent', [])
    intent2 = u2.get('connection_intent', [])
    
    deep_score = 0
    if 'deep' in intent1 or 'deep' in intent2:
        deep_score = 60
    if 'random' in intent1 and 'random' in intent2:
        deep_score = 20  # Low attachment risk
    else:
        deep_score = 40
    
    value = add_randomness(deep_score)
    
    labels = {
        'low': 'Emotionally insured',
        'medium': 'Suspicious closeness',
        'high': 'Already invested'
    }
    
    return {
        'value': round(value),
        'label': get_label(value, labels),
        'tooltip': 'Connection intent + emotional availability'
    }


def calculate_personality_sync(u1: Dict, u2: Dict) -> Dict:
    """Same person in both rooms?"""
    
    # NPC and chaos brains are consistent
    consistent_brains = ['npc', 'chaos', 'flow']
    
    sync_score = 50
    if u1.get('brain_type') in consistent_brains:
        sync_score += 20
    if u2.get('brain_type') in consistent_brains:
        sync_score += 20
    
    value = add_randomness(sync_score)
    
    labels = {
        'low': 'Two personalities',
        'medium': 'Mostly consistent',
        'high': 'No filter ever'
    }
    
    return {
        'value': round(value),
        'label': get_label(value, labels),
        'tooltip': 'Authenticity + social masks'
    }


def calculate_argument_survival(u1: Dict, u2: Dict) -> Dict:
    """Can disagreements end without blocking."""
    
    # Spreadsheet humans and overthinkers argue logically
    logical_brains = ['spreadsheet', 'overthinker']
    
    survival_score = 50
    if u1.get('brain_type') in logical_brains and u2.get('brain_type') in logical_brains:
        survival_score = 70
    elif u1.get('brain_type') == 'chaos' or u2.get('brain_type') == 'chaos':
        survival_score = 40  # Chaos = unpredictable
    
    value = add_randomness(survival_score)
    
    labels = {
        'low': 'Passive aggression',
        'medium': 'Heated but alive',
        'high': 'Fights turn into jokes'
    }
    
    return {
        'value': round(value),
        'label': get_label(value, labels),
        'tooltip': 'Conflict resolution + ego management'
    }


def calculate_event_attendance(u1: Dict, u2: Dict) -> Dict:
    """Will you actually show up together?"""
    
    # Spreadsheet humans are reliable
    reliable_brains = ['spreadsheet', 'flow']
    
    reliability = 40
    if u1.get('brain_type') in reliable_brains:
        reliability += 25
    if u2.get('brain_type') in reliable_brains:
        reliability += 25
    
    value = add_randomness(reliability)
    
    labels = {
        'low': 'Plans dissolve',
        'medium': 'One cancels late',
        'high': 'Arrive together, leave together'
    }
    
    return {
        'value': round(value),
        'label': get_label(value, labels),
        'tooltip': 'Reliability + commitment issues'
    }


def calculate_unhinged_combo(u1: Dict, u2: Dict) -> Dict:
    """Should this pairing be supervised?"""
    
    # Chaos + Delulu = maximum unhinged
    unhinged_brains = ['chaos', 'delulu', 'wifi']
    
    unhinged_score = 30
    if u1.get('brain_type') in unhinged_brains:
        unhinged_score += 30
    if u2.get('brain_type') in unhinged_brains:
        unhinged_score += 30
    
    value = add_randomness(unhinged_score)
    
    labels = {
        'low': 'Emotionally stable',
        'medium': 'Mild chaos',
        'high': 'Do not encourage'
    }
    
    return {
        'value': round(value),
        'label': get_label(value, labels),
        'tooltip': 'Combined chaos potential + adult supervision required'
    }


def select_random_meters(user_id: str, date: datetime) -> List[str]:
    """
    Select 1 random meter for a user, seeded by date for daily consistency.
    
    Args:
        user_id: User ID to seed randomization
        date: Current date for daily reshuffle
    
    Returns:
        List with 1 meter key
    """
    # Seed random with user_id + date for consistency
    seed = hash(f"{user_id}_{date.strftime('%Y-%m-%d')}")
    random.seed(seed)
    
    all_meters = [
        'vibe_collision', 'shared_brain_cell', 'awkward_silence', 'chaos_escalation',
        'texting_energy', 'social_battery', 'inside_joke_speed', 'emotional_damage',
        'personality_sync', 'argument_survival', 'event_attendance', 'unhinged_combo'
    ]
    
    # Select only 1 meter
    selected = random.sample(all_meters, 1)
    
    # Reset random seed
    random.seed()
    
    return selected
