from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from calendar_effect_history import retain_spell_history, not_started
from condition_expiry_review import review_scene_conditions


def clock(time):
    return {'date': '1607-01-17', 'time': time, 'processed_at': '1607-01-17T13:08:00Z'}


def test_rewind_restores_calendar_spells():
    effects = [{'id':'g', 'started_at':'1607-01-17T12:18:00Z', 'expires_at':'1607-01-17T13:18:00Z'},
               {'id':'e', 'started_at':'1607-01-17T11:55:00Z', 'expires_at':'1607-01-17T12:55:00Z'}]
    now = retain_spell_history(effects, clock('13:08'))
    assert [e['status'] for e in now] == ['active','expired']
    back = retain_spell_history(now, clock('12:50'))
    assert [e['status'] for e in back] == ['active','active']
    assert not_started(back[0], clock('12:00'))
    assert retain_spell_history(back, clock('12:00'))[0]['status'] == 'expired'


def test_keep_five_latest():
    entries = [{'id':i,'expires_at':f'1607-01-17T12:0{i}:00Z'} for i in range(8)]
    entries.append({'id':'active','expires_at':'1607-01-17T14:00:00Z'})
    assert [e['id'] for e in retain_spell_history(entries, clock('13:08'))] == [3,4,5,6,7,'active']


def test_finalized_lapse_can_reactivate_but_cannot_award_again():
    mage={'character_type':'mage','arcane_beats':4,'arcane_experience':1}
    entry={'name':'Abyssal Imago','started_at':'1607-01-17T11:55:00Z','expires_at':'1607-01-17T12:55:00Z'}
    saved,gained,_=review_scene_conditions([entry],clock('13:08'),mage,finalize_scene=True)
    assert gained=={'arcane_beats':0,'arcane_experience':2}
    assert saved[0]['lapse_finalized'] and saved[0]['clock_archived']
    back,gained,_=review_scene_conditions(saved,clock('12:50'),mage)
    assert back[0]['status']=='active' and not gained
    again,gained,_=review_scene_conditions(back,clock('13:08'),mage,finalize_scene=True)
    assert not gained and again[0]['status']=='expired'
