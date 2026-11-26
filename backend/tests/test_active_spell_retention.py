from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from time_effect_retention import retain_unexpired_effects as retain_active_spells


def test_retention_only_removes_expired_effects():
    active = {"id": 1, "duration": "Indefinite"}
    future = {"id": 2, "expires_at": "1607-01-24T13:00:00Z"}
    expired = {"id": 3, "status": "expired"}
    elapsed = {"id": 4, "expires_at": "1607-01-24T12:00:00Z"}
    depleted = {"id": 5, "tracking_mode": "turn", "turns_remaining": 0}
    assert retain_active_spells([active, future, expired, elapsed, depleted], {"date": "1607-01-24", "time": "12:00"}) == [active, future]
    assert retain_active_spells([active, future, expired, elapsed], {}) == [active, future, elapsed]
