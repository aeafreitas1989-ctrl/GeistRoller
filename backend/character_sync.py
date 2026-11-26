from pydantic import BaseModel


class CharacterSummary(BaseModel):
    id: str
    name: str = "New Sin-Eater"
    character_type: str = "geist"
    updated_at: str = ""


CHARACTER_SUMMARY_PROJECTION = {"_id": 0, **{key: 1 for key in CharacterSummary.model_fields}}
