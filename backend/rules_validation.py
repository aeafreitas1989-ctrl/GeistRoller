"""Bound normal player-side supernatural traits without rewriting old stored characters.
An explicit ST override remains available for exceptional story mechanics."""
RULE_LIMITS = {
    'synergy': (1, 10), 'geist_rank': (1, 5), 'gnosis': (1, 10),
    'wisdom': (0, 10), 'plasm': (0, 100), 'mana': (0, 100),
    'scene_paradox_rolls': (0, 100000), 'beats': (0, 4),
    'arcane_beats': (0, 4), 'experience': (0, 100000),
    'arcane_experience': (0, 100000),
}

def validate_rule_bounded_fields(updates, allow_override=False):
    if allow_override: return
    for key, (minimum, maximum) in RULE_LIMITS.items():
        if key not in updates or updates[key] is None: continue
        value = updates[key]
        if type(value) is not int or not (minimum <= value <= maximum):
            raise ValueError(f'{key} must be a whole number between {minimum} and {maximum}; use an explicit ST override for exceptions')
