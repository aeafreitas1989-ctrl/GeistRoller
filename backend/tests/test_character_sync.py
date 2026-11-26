from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from character_sync import CharacterSummary, CHARACTER_SUMMARY_PROJECTION


def test_summary_contains_only_selector_fields():
    record = {"id": "a", "name": "Ashwood", "character_type": "mage", "updated_at": "2026-01-01T00:00:00Z", "xp_history": [1], "inventory_items": [2]}
    assert CharacterSummary.model_validate(record).model_dump() == {key: record[key] for key in ("id", "name", "character_type", "updated_at")}
    assert CHARACTER_SUMMARY_PROJECTION == {"_id": 0, "id": 1, "name": 1, "character_type": 1, "updated_at": 1}
