def without_xp_history(character):
    return {key: value for key, value in character.items() if key != "xp_history"}


def xp_history_snapshot(character):
    return {"id": character["id"], "updated_at": character.get("updated_at"),
            "xp_history": character.get("xp_history") or [],
            **{key: character.get(key, 0) for key in
               ("experience", "arcane_experience", "beats", "arcane_beats")}}
