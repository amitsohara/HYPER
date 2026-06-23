from backend.core.model_router import router

class SynthMindEngine:
    async def generate_scenario(self, topic: str):
        prompt = f"Generate a synthetic scenario based on this topic: {topic}"
        output = await router.generate(prompt)
        return {
            "scenario_id": "s1",
            "topic": topic,
            "content": f"Synthetic Scenario Response -> {output[:150]}..."
        }

synthmind_engine = SynthMindEngine()
