from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from character_delta import character_delta, history_projection, next_revision


def test_delta_has_only_changed_fields_and_revision():
    before = {"id":"a", "updated_at":"v1", "name":"Mage", "character_type":"mage", "mana":8, "conditions":[], "advancement_ledger":[1]}
    after = {**before, "updated_at":"v2", "mana":7, "conditions":[{"name":"Inspired"}]}
    delta = character_delta(before, after)
    assert delta["base_revision"] == "v1" and delta["revision"] == "v2"
    assert delta["changes"] == {"updated_at":"v2", "mana":7, "conditions":[{"name":"Inspired"}]}
    assert {**before, **delta["changes"]} == after
    assert delta["summary"]["name"] == "Mage"


def test_full_snapshot_fallback_and_projection():
    assert character_delta({"id":"a"}, {"id":"a", "updated_at":"v2"}) is None
    assert character_delta({"id":"a", "updated_at":"v1", "old":1}, {"id":"a", "updated_at":"v2"}) is None
    assert history_projection(False) == {"_id":0,"xp_history":0}
    assert history_projection(True) == {"_id":0}


def test_revision_moves_forward_even_if_system_clock_is_behind():
    assert next_revision("2099-01-01T00:00:00.000001+00:00") == "2099-01-01T00:00:00.000002+00:00"
