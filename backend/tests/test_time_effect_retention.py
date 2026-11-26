from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from time_effect_retention import retain_unexpired_effects


def test_retention_preserves_unresolved_and_future_effects():
    active = {'name': 'Unresolved', 'persistent': True}
    future = {'name': 'Future', 'expires_at': '1607-01-24T13:00:00Z'}
    expired = {'name': 'Past', 'expires_at': '1607-01-24T12:00:00Z'}
    marked = {'name': 'Scene', 'status': 'expired'}
    turn = {'name': 'Combat', 'tracking_mode': 'turn', 'turns_remaining': 0}
    assert retain_unexpired_effects([active, future, expired, marked, turn], {'date': '1607-01-24', 'time': '12:00'}) == [active, future]
    assert retain_unexpired_effects([active, expired], {}) == [active, expired]
