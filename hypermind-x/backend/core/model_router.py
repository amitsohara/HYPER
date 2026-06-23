import httpx
from backend.config import settings

class ModelRouter:
    def __init__(self):
        self.ollama_url = f"{settings.OLLAMA_URL}/api/generate"

    async def generate(self, prompt: str, model: str = "llama3") -> str:
        payload = {"model": model, "prompt": prompt, "stream": False}
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(self.ollama_url, json=payload, timeout=30.0)
                if response.status_code == 200:
                    return response.json().get("response", "")
                return f"[{model} Mock]: {prompt[:50]}..."
        except Exception:
            return f"[Simulated Output for {model}]: Fallback -> {prompt[:50]}..."

router = ModelRouter()
