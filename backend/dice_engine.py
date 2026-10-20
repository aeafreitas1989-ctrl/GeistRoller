import random
from collections.abc import Callable

from models import DiceRollRequest, DiceRollResult


RollDie = Callable[[int, int], int]


def resolve_dice_roll(
    request: DiceRollRequest,
    randint: RollDie = random.randint,
) -> DiceRollResult:
    # A zero pool is a chance die. Chance dice never explode.
    is_chance = bool(request.chance or request.pool <= 0)
    pool = 1 if is_chance else request.pool
    again_threshold = 11 if is_chance else request.again

    dice: list[int] = []
    original_dice: list[int] = []

    def roll_with_again() -> list[int]:
        results: list[int] = []
        die = randint(1, 10)
        results.append(die)

        while die >= again_threshold:
            die = randint(1, 10)
            results.append(die)

        return results

    for _ in range(pool):
        result = roll_with_again()
        original_dice.append(result[0])
        dice.extend(result)

    if request.rote and not is_chance:
        for original_die in original_dice:
            if original_die < 8:
                dice.extend(roll_with_again())

    if is_chance:
        first_die = dice[0]
        successes = 1 if first_die == 10 else 0
        is_dramatic = first_die == 1
        is_exceptional = False
        beat_awarded = is_dramatic
    else:
        successes = sum(1 for die in dice if die >= 8)
        is_dramatic = False
        is_exceptional = successes >= request.exceptional_target
        beat_awarded = False

    if is_dramatic:
        description = "Dramatic Failure."
    elif is_exceptional:
        description = f"Exceptional Success! ({successes} successes)"
    elif successes > 0:
        suffix = "es" if successes > 1 else ""
        description = f"{successes} success{suffix}"
    else:
        description = "Failure."

    return DiceRollResult(
        dice=dice,
        successes=successes,
        is_exceptional=is_exceptional,
        is_dramatic_failure=is_dramatic,
        beat_awarded=beat_awarded,
        description=description,
    )
