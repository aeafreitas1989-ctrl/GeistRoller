from pathlib import Path
import sys
import pytest
BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path: sys.path.insert(0, str(BACKEND_DIR))
from rules_validation import validate_rule_bounded_fields

def test_regular_valid_values():
    validate_rule_bounded_fields({'gnosis': 4, 'synergy': 1, 'geist_rank': 3})

@pytest.mark.parametrize('patch', [{'gnosis':11}, {'synergy':0}, {'geist_rank':6}, {'mana':-1}, {'beats':5}])
def test_out_of_bounds_requires_explicit_override(patch):
    with pytest.raises(ValueError): validate_rule_bounded_fields(patch)
    validate_rule_bounded_fields(patch, allow_override=True)
