import httpx
import os
from backend.config import settings

class ModelRouter:
    def __init__(self):
        # Connect to Ollama API. Defaulting to localhost port 11434
        self.ollama_url = f"{settings.OLLAMA_URL}/api/generate"

    async def generate(self, prompt: str, model: str = None) -> str:
        # Use model from .env or default to llama3
        selected_model = model or os.getenv("OLLAMA_MODEL", "llama3")
        payload = {"model": selected_model, "prompt": prompt, "stream": False}
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(self.ollama_url, json=payload)
                response.raise_for_status()
                return response.json().get("response", "")
        except httpx.TimeoutException:
            return f"[{selected_model} Fallback - Timeout]: The model took too long to respond. Prompt: {prompt[:50]}..."
        except Exception as e:
            return f"[{selected_model} Fallback - Offline]: Error communicating with Ollama ({str(e)}). Prompt: {prompt[:50]}..."

router = ModelRouter()
