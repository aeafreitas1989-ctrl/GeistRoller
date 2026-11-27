from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from time_effect_retention import preserve_clock_checkpoint, game_timestamp, retain_unexpired_effects, stamp_new_effects
from abyssal_conditions import retain_conditions_with_lapse


def test_rewind_and_return_does_not_move_deadline_or_lapse():
    current = {'date': '1607-01-24', 'time': '10:00'}
    past = {'date': '1607-01-23', 'time': '10:00'}
    back = preserve_clock_checkpoint(current, past)
    restored = preserve_clock_checkpoint(back, current)
    assert game_timestamp(back) == game_timestamp(current) == game_timestamp(restored)
    condition = {'name': 'Abyssal Imago', 'started_at': '1607-01-24T10:00:00Z', 'expires_at': '1607-01-25T10:00:00Z'}
    mage = {'character_type': 'mage', 'arcane_beats': 4}
    assert retain_conditions_with_lapse([condition], restored, mage) == ([condition], {}, '')
    end = preserve_clock_checkpoint(restored, {'date': '1607-01-25', 'time': '10:00'})
    retained, gained, _ = retain_conditions_with_lapse([condition], end, mage)
    assert gained == {'arcane_beats': 0, 'arcane_experience': 1}
    assert retained[0]['started_at'] == '1607-01-25T10:00:00.000Z'
    assert retain_unexpired_effects([condition], end) == []


def test_new_effect_has_date_and_old_unknown_stays_unknown():
    clock = {'date': '1607-01-24', 'time': '10:00'}
    old = {'name': 'Legacy'}
    added = stamp_new_effects([old, {'name': 'New'}], [old], clock)
    assert added[0] == old
    assert added[1]['started_at'] == '1607-01-24T10:00:00.000Z'
    assert stamp_new_effects(added, added, {'date': '1607-01-25', 'time': '10:00'}) == added
