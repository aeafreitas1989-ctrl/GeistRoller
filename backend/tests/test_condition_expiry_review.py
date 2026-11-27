from pathlib import Path
import sys
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from condition_expiry_review import review_scene_conditions
from time_effect_retention import preserve_clock_checkpoint

MAGE={'character_type':'mage','arcane_beats':4,'arcane_experience':1}
TODAY={'date':'1607-01-24','time':'10:00'}
TOMORROW={'date':'1607-01-25','time':'10:00'}
CONDITION={'id':'i','name':'Abyssal Imago','started_at':'1607-01-24T10:00:00Z','expires_at':'1607-01-25T10:00:00Z'}


def test_rewind_restores_condition_and_does_not_award_beat():
    future=preserve_clock_checkpoint(TODAY,TOMORROW)
    reviewed,gained,_=review_scene_conditions([CONDITION],future,MAGE)
    assert reviewed[0]['status']=='expired' and gained=={}
    back=preserve_clock_checkpoint(future,TODAY)
    reviewed,gained,_=review_scene_conditions(reviewed,back,MAGE)
    assert reviewed[0]['status']=='active' and gained=={}
    assert reviewed[0]['expires_at']==CONDITION['expires_at']
    assert review_scene_conditions(reviewed,back,MAGE,finalize_scene=True)==(reviewed,{},'')


def test_finalization_only_once_and_turn_lapse_stays_visible():
    reviewed,gained,_=review_scene_conditions([CONDITION],TOMORROW,MAGE)
    assert gained=={} and len(reviewed)==1
    kept,gained,_=review_scene_conditions(reviewed,TOMORROW,MAGE,finalize_scene=True)
    assert [e['name'] for e in kept]==['Abyssal Taint'] and gained=={'arcane_beats':0,'arcane_experience':2}
    turn={'name':'Abyssal Backlash','tracking_mode':'turn','turns_remaining':0,'status':'expired'}
    kept,gained,_=review_scene_conditions([turn],TODAY,MAGE)
    assert kept[0]['lapse_finalized'] and kept[1]['name']=='Abyssal Taint'
    final,again,_=review_scene_conditions(kept,TODAY,{**MAGE,**gained},finalize_scene=True)
    assert len(final)==1 and again=={}
