from pathlib import Path
import sys

import pytest
from pydantic import ValidationError

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from dice_engine import resolve_dice_roll
from models import DiceRollRequest


class SequenceRoller:
    def __init__(self, values):
        self.values = iter(values)

    def __call__(self, low, high):
        value = next(self.values)
        assert low <= value <= high
        return value


def test_standard_ten_again_explodes():
    request = DiceRollRequest(pool=1, again=10)
    result = resolve_dice_roll(request, SequenceRoller([10, 8]))

    assert result.dice == [10, 8]
    assert result.successes == 2
    assert result.is_exceptional is False


def test_zero_pool_is_a_non_exploding_chance_die():
    request = DiceRollRequest(pool=0, again=10, chance=False)
    result = resolve_dice_roll(request, SequenceRoller([10]))

    assert result.dice == [10]
    assert result.successes == 1
    assert result.is_dramatic_failure is False
    assert result.is_exceptional is False


def test_explicit_chance_die_one_is_dramatic_failure_and_awards_beat():
    request = DiceRollRequest(pool=5, chance=True)
    result = resolve_dice_roll(request, SequenceRoller([1]))

    assert result.dice == [1]
    assert result.successes == 0
    assert result.is_dramatic_failure is True
    assert result.beat_awarded is True


def test_rote_rerolls_failed_original_die_once_and_reroll_can_explode():
    request = DiceRollRequest(pool=1, again=10, rote=True)
    result = resolve_dice_roll(request, SequenceRoller([3, 10, 8]))

    assert result.dice == [3, 10, 8]
    assert result.successes == 2


def test_custom_exceptional_success_target():
    request = DiceRollRequest(pool=3, exceptional_target=3)
    result = resolve_dice_roll(request, SequenceRoller([8, 8, 8]))

    assert result.successes == 3
    assert result.is_exceptional is True


@pytest.mark.parametrize("again", [0, 1, 7, 11, 99])
def test_invalid_again_threshold_is_rejected(again):
    with pytest.raises(ValidationError):
        DiceRollRequest(pool=1, again=again)


@pytest.mark.parametrize("pool", [-1, 101, 1000])
def test_invalid_pool_is_rejected(pool):
    with pytest.raises(ValidationError):
        DiceRollRequest(pool=pool)


@pytest.mark.parametrize("target", [0, -1, 101])
def test_invalid_exceptional_target_is_rejected(target):
    with pytest.raises(ValidationError):
        DiceRollRequest(pool=1, exceptional_target=target)
