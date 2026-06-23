from backend.core.model_router import router
import json
import re

class ScenarioSimulator:
    async def generate_scenarios(self, worlds: list[str], mission_text: str):
        scenarios = []
        for world in worlds:
            prompt = f"For the world '{world}', create a specific test scenario or challenge for the mission '{mission_text}'. Keep it short."
            response = await router.generate(prompt)
            scenarios.append({"world": world, "scenario": response.strip()})
        return scenarios

scenario_simulator = ScenarioSimulator()
