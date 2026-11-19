"""Server-side bounds for updates, including nested 2e trait/resource invariants.

The Storyteller may explicitly set ``allow_rules_override``. No migration or
retroactive rewriting of legacy records occurs when merely reading a character.
"""
RULE_LIMITS = {
    'synergy': (1, 10), 'geist_rank': (1, 5), 'gnosis': (1, 10),
    'wisdom': (0, 10), 'mana': (0, 100), 'plasm': (0, 10000),
    'temporary_plasm': (0, 10000), 'willpower': (0, 100),
    'scene_paradox_rolls': (0, 100000), 'beats': (0, 4),
    'arcane_beats': (0, 4), 'experience': (0, 100000),
    'arcane_experience': (0, 100000),
}
_PLASM_CAPACITY = {1:10,2:11,3:12,4:13,5:15,6:20,7:30,8:40,9:50,10:100}
_WOUNDS = {'empty','bashing','lethal','aggravated'}


def _whole(value, low, high, label):
    if type(value) is not int or not low <= value <= high:
        raise ValueError(f'{label} must be a whole number between {low} and {high}; Storyteller override required')


def validate_rule_bounded_fields(updates, allow_override=False, previous=None):
    if allow_override: return
    previous = previous or {}
    merged = {**previous, **updates}
    for key, (minimum, maximum) in RULE_LIMITS.items():
        if key in updates and updates[key] is not None:
            _whole(updates[key], minimum, maximum, key)
    trait_max = 5
    power = merged.get('gnosis', 1) if merged.get('character_type') == 'mage' else merged.get('synergy', 1)
    if isinstance(power, int) and power >= 6: trait_max = min(10, power)
    for name, maximum in [('attributes',trait_max),('skills',trait_max),('arcana',5),('haunts',5)]:
        if name not in updates or updates[name] is None: continue
        traits = updates[name]
        if not isinstance(traits, dict): raise ValueError(f'{name} must be a trait map')
        for key, value in traits.items():
            if not isinstance(key, str) or not key or len(key) > 70:
                raise ValueError(f'{name} has an invalid trait name')
            _whole(value, 0, maximum, name + '.' + key)
    if 'health_boxes' in updates and updates['health_boxes'] is not None:
        boxes = updates['health_boxes']
        if not isinstance(boxes, list) or len(boxes) > 30 or any(type(x) is not str or x not in _WOUNDS for x in boxes):
            raise ValueError('health_boxes must be a list of valid wound states')
    if 'resistant_wounds' in updates and updates['resistant_wounds'] is not None:
        marks = updates['resistant_wounds']
        if not isinstance(marks, list) or any(type(x) is not bool for x in marks):
            raise ValueError('resistant_wounds must contain boolean markers')
        boxes = merged.get('health_boxes', [])
        if len(marks) != len(boxes):
            raise ValueError('resistant_wounds must align with health_boxes')
    if 'keys' in updates and updates['keys'] is not None:
        keys = updates['keys']
        if not isinstance(keys, list) or any(type(key) is not str or not key.strip() or len(key) > 100 for key in keys):
            raise ValueError('Keys must be a list of named Keys')
        if len(keys) != len(set(keys)):
            raise ValueError('Duplicate manual Keys are not allowed')
    if 'conditions' in updates and updates['conditions'] is not None:
        conditions = updates['conditions']
        if not isinstance(conditions, list) or len(conditions) > 1000:
            raise ValueError('Conditions must be a list of records')
        for item in conditions:
            if not isinstance(item, dict) or not isinstance(item.get('name'), str) or not item['name'].strip() or len(item['name']) > 250:
                raise ValueError('Every Condition needs a valid name')
            if 'key_source_id' in item and item['key_source_id'] is not None and not isinstance(item['key_source_id'], str):
                raise ValueError('Doomed Key source id must be a string')
    if 'mementos' in updates and updates['mementos'] is not None:
        ids = [str(x['id']) for x in updates['mementos'] if isinstance(x,dict) and x.get('id') is not None]
        if len(ids) != len(set(ids)): raise ValueError('Memento ids must be unique')
    if 'merits_list' in updates and updates['merits_list'] is not None:
        for merit in updates['merits_list']:
            if not isinstance(merit,dict): raise ValueError('Merit must be a record')
            if merit.get('name') == 'Grimoire':
                rotes = merit.get('grimoire_rotes',[])
                dots = merit.get('dots',0)
                _whole(dots, 1, 5, 'Grimoire dots')
                if not isinstance(rotes,list) or len(rotes) > dots*2:
                    raise ValueError('Grimoire rote capacity exceeded')
    if any(key in updates for key in ('plasm','temporary_plasm','synergy')):
        total = merged.get('plasm', 0)
        extra = merged.get('temporary_plasm', 0)
        synergy = merged.get('synergy', 1)
        if type(total) is not int or type(extra) is not int or extra < 0 or extra > total:
            raise ValueError('Temporary Plasm must be within the current Plasm pool')
        if type(synergy) is int and synergy in _PLASM_CAPACITY and total-extra > _PLASM_CAPACITY[synergy]:
            raise ValueError('Ordinary Plasm exceeds the Synergy capacity; temporary Key surplus must be recorded separately')
    if 'pending_activation' in updates and updates['pending_activation'] is not None:
        state = updates['pending_activation']
        if not isinstance(state, dict) or state.get('kind') not in ('haunt','spell') or not isinstance(state.get('signature'),str):
            raise ValueError('Invalid pending activation')
        for key in ('total','paid','turns','requiredTurns'):
            _whole(state.get(key), 0, 10000, 'pending_activation.' + key)
        if state['paid'] > state['total']: raise ValueError('Cannot pay more than the preparation total')
    if 'remembrance_activation' in updates and updates['remembrance_activation'] is not None:
        state = updates['remembrance_activation']
        if not isinstance(state,dict) or state.get('trait_type') not in ('skill','merit') or not isinstance(state.get('trait'),str):
            raise ValueError('Invalid Remembrance activation')
        _whole(state.get('dots'), 1, 5, 'Remembrance dots')
