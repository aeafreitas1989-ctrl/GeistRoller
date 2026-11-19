import sys
from pathlib import Path
import pytest
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from rules_validation import validate_rule_bounded_fields

def test_existing_scalar_contract():
    validate_rule_bounded_fields({'gnosis': 3, 'mana': 10})
    with pytest.raises(ValueError): validate_rule_bounded_fields({'gnosis': 11})

def test_nested_trait_limits():
    validate_rule_bounded_fields({'skills':{'crafts':5},'haunts':{'The Boneyard':3}})
    for patch in [{'arcana':{'Death':99}}, {'haunts':{'The Rage':20}}, {'attributes':{'strength':-1}}]:
        with pytest.raises(ValueError): validate_rule_bounded_fields(patch)

def test_balanced_resistant_wounds():
    validate_rule_bounded_fields({'health_boxes':['lethal','empty'],'resistant_wounds':[True,False]})
    with pytest.raises(ValueError): validate_rule_bounded_fields({'health_boxes':['lethal'],'resistant_wounds':[True,False]})

def test_key_surplus_can_exceed_base_plasm_cap_without_creating_regular_plasm():
    previous={'character_type':'geist','synergy':10,'plasm':100,'temporary_plasm':0}
    validate_rule_bounded_fields({'plasm':104,'temporary_plasm':4},previous=previous)
    with pytest.raises(ValueError): validate_rule_bounded_fields({'plasm':104,'temporary_plasm':0},previous=previous)

def test_grimoire_capacity():
    with pytest.raises(ValueError): validate_rule_bounded_fields({'merits_list':[{'name':'Grimoire','dots':1,'grimoire_rotes':[{}, {}, {}]}]})

def test_storyteller_override():
    validate_rule_bounded_fields({'arcana':{'Death':99},'gnosis':20},allow_override=True)


def test_key_and_condition_shape_validation():
    for bad in ({'keys':['Blood', 'Blood']}, {'keys':['Blood', '']},
                {'conditions':[{'description':'No name'}]},
                {'conditions':[{'name':'Doomed','key_source_id':7}]}):
        with pytest.raises(ValueError):
            validate_rule_bounded_fields(bad, False, {'synergy':1,'plasm':10,'temporary_plasm':0})
    validate_rule_bounded_fields({'conditions':[{'name':'Doomed','key_source_id':'memento::123'}]}, False, {'synergy':1,'plasm':10,'temporary_plasm':0})
