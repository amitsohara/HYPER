from backend.core.model_router import router
import json
import re

class SyntheticWorldEngine:
    async def generate_worlds(self, mission_text: str, num_worlds: int = 3):
        prompt = f"Given the mission: '{mission_text}', generate {num_worlds} diverse synthetic virtual world conditions or environments to test solutions. Return as JSON array of strings. Example: ['low-income rural school', 'urban private school']"
        response = await router.generate(prompt)
        
        worlds = [f"Simulated Environment {i+1}" for i in range(num_worlds)]
        try:
            match = re.search(r"\[.*\]", response, re.DOTALL)
            if match:
                worlds = json.loads(match.group(0))
        except Exception:
            pass
            
        return worlds

synthetic_world_engine = SyntheticWorldEngine()
