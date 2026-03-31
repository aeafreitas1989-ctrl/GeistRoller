"""Unified LLM wrapper supporting both Emergent and external OpenAI-compatible APIs."""
import os
import logging
from openai import AsyncOpenAI
from emergentintegrations.llm.chat import LlmChat, UserMessage

logger = logging.getLogger(__name__)

PROVIDER_URLS = {
    "openrouter": "https://openrouter.ai/api/v1",
    "openai": "https://api.openai.com/v1",
    "ollama": "http://localhost:11434/v1",
}

DEFAULT_MODELS = {
    "openrouter": "openai/gpt-4o",
    "openai": "gpt-4o",
    "ollama": "llama3.2",
}

# Providers that don't require an API key
NO_KEY_PROVIDERS = {"ollama", "custom"}


class ExternalLLMChat:
    """Chat wrapper for OpenAI-compatible APIs (OpenRouter, OpenAI, custom)."""

    def __init__(self, api_key: str, base_url: str, model: str, system_message: str):
        self.client = AsyncOpenAI(api_key=api_key, base_url=base_url)
        self.model = model
        self.system_message = system_message
        self.messages = []

    async def send_message(self, user_message: UserMessage) -> str:
        self.messages.append({"role": "user", "content": user_message.text})

        # Keep conversation manageable (last 20 exchanges)
        trimmed = self.messages[-40:]

        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": self.system_message},
                *trimmed,
            ],
        )
        assistant_text = response.choices[0].message.content or ""
        self.messages.append({"role": "assistant", "content": assistant_text})
        return assistant_text


def _get_external_config(settings: dict) -> dict | None:
    """Extract external LLM config from settings. Returns None if not configured."""
    provider = (settings.get("external_llm_provider") or "").strip()
    if not provider:
        return None

    api_key = (settings.get("external_llm_api_key") or "").strip()
    # Ollama and custom endpoints may not need a real key
    if not api_key and provider not in NO_KEY_PROVIDERS:
        return None
    if not api_key:
        api_key = "not-needed"

    base_url = (settings.get("external_llm_base_url") or "").strip()
    if not base_url:
        base_url = PROVIDER_URLS.get(provider, "")
    if not base_url:
        return None

    model = (settings.get("external_llm_model") or "").strip()
    if not model:
        model = DEFAULT_MODELS.get(provider, "gpt-4o")

    return {"api_key": api_key, "base_url": base_url, "model": model}


def create_chat(session_id: str, system_message: str, settings: dict | None = None):
    """Create an LLM chat instance based on current settings."""
    ext = _get_external_config(settings or {})

    if ext:
        logger.info(f"Using external LLM: {ext['base_url']} / {ext['model']}")
        return ExternalLLMChat(
            api_key=ext["api_key"],
            base_url=ext["base_url"],
            model=ext["model"],
            system_message=system_message,
        )

    return LlmChat(
        api_key=os.environ.get("EMERGENT_LLM_KEY", ""),
        session_id=session_id,
        system_message=system_message,
    )
