from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from abyssal_conditions import retain_conditions_with_lapse

MAGE = {'character_type': 'mage', 'arcane_beats': 4, 'arcane_experience': 2}
CLOCK = {'date': '1607-01-25', 'time': '10:00'}


def test_lapsed_conditions_produce_one_permanent_taint_and_individual_beats():
    conditions = [{'name': 'Abyssal Nimbus', 'status': 'expired'},
                  {'name': 'Abyssal Imago', 'expires_at': '1607-01-25T10:00:00Z'}]
    retained, gained, reason = retain_conditions_with_lapse(conditions, CLOCK, MAGE)
    assert len(retained) == 1 and retained[0]['name'] == 'Abyssal Taint'
    assert retained[0]['duration'] == 'Permanent' and retained[0]['beat_type'] == 'none'
    assert gained == {'arcane_beats': 1, 'arcane_experience': 3}
    assert 'Abyssal Nimbus' in reason
    assert retain_conditions_with_lapse(retained, CLOCK, {**MAGE, **gained}) == (retained, {}, '')


def test_explicit_removal_or_other_character_does_not_produce_taint():
    assert retain_conditions_with_lapse([], CLOCK, MAGE) == ([], {}, '')
    expired = [{'name': 'Abyssal Nimbus', 'status': 'expired'}]
    assert retain_conditions_with_lapse(expired, CLOCK, {'character_type': 'geist'}) == ([], {}, '')
    assert retain_conditions_with_lapse([{**expired[0], 'target_type': 'familiar'}], CLOCK, MAGE) == ([], {}, '')
