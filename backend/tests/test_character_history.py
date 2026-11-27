from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from character_history import without_xp_history, xp_history_snapshot


def test_compact_snapshot_preserves_mechanical_ledgers():
    character = {"id": "one", "updated_at": "revision", "xp_history": [{"id": 1}],
                 "advancement_ledger": [{"id": 2}], "remembrance_history": [{"id": 3}], "experience": 5}
    compact = without_xp_history(character)
    assert "xp_history" not in compact
    assert compact["advancement_ledger"] == character["advancement_ledger"]
    assert compact["remembrance_history"] == character["remembrance_history"]
    assert xp_history_snapshot(character)["xp_history"] == [{"id": 1}]
    assert xp_history_snapshot(character)["experience"] == 5
    assert xp_history_snapshot(character)["updated_at"] == "revision"
    assert "xp_history" in character
