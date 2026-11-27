from time_effect_retention import retain_unexpired_effects

_NAMES = {'abyssal backlash', 'abyssal imago', 'abyssal nimbus', 'paradox taint',
          'paradox condition (pending st)', 'paradox condition (dramatic spellcasting failure)'}


def _name(entry):
    return str(entry.get('definition_key') or entry.get('name') or '').strip().lower() if isinstance(entry, dict) else ''


def is_abyssal_taint(entry):
    return (_name(entry) == 'abyssal taint' and entry.get('target_type') in (None, '', 'character'))


def is_abyssal_condition(entry):
    return (isinstance(entry, dict) and not is_abyssal_taint(entry)
            and entry.get('target_type') in (None, '', 'character')
            and (entry.get('paradox_condition') is True or _name(entry) in _NAMES
                 or str(entry.get('id') or '').startswith('paradox-')))


def retain_conditions_with_lapse(conditions, tracker, previous, updates=None):
    """Only natural expirations, not explicitly removed conditions, produce taint."""
    retained = retain_unexpired_effects(conditions, tracker)
    if not isinstance(conditions, list) or previous.get('character_type') != 'mage':
        return retained, {}, ''
    lapsed = [entry for entry in conditions if is_abyssal_condition(entry)
              and not retain_unexpired_effects([entry], tracker)]
    if not lapsed:
        return retained, {}, ''
    if not any(is_abyssal_taint(entry) for entry in retained):
        retained.append({**{"name":"Abyssal Taint","type":"condition","group":"condition","splat":"Mage — Paradox","persistent":True,"beat_type":"none","duration":"Permanent","origin":"Paradox","description":"The Abyss has entered the mage’s Pattern and is detectable in her Nimbus. Every spell she casts adds one Paradox die, even without exceeding free Reach.","effect":"The Abyss has entered the mage’s Pattern and is detectable in her Nimbus. Every spell she casts adds one Paradox die, even without exceeding free Reach.","resolution":"Scour the taint from the Pattern: suffer one resistant lethal wound, gain no Mana and no additional Arcane Beat.","source_citation":"Mage: The Awakening 2e, p. 116"}, 'status': 'active'})
    updates = updates or {}
    beats = max(0, int(updates.get('arcane_beats', previous.get('arcane_beats', 0)) or 0)) + len(lapsed)
    xp = max(0, int(updates.get('arcane_experience', previous.get('arcane_experience', 0)) or 0))
    return retained, {'arcane_beats': beats % 5, 'arcane_experience': xp + beats // 5}, 'Abyssal Condition lapsed: ' + ', '.join(str(e.get('name') or 'Paradox Condition') for e in lapsed)
