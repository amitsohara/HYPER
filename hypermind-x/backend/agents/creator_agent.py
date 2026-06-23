from backend.agents.base_agent import BaseAgent
from backend.core.model_router import router

class CreatorAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="Creator-Delta", role="Creator", model="llama3")

    async def run(self, task: str) -> str:
        prompt = f"As a Creator, synthesize this into a final output: {task}"
        return await router.generate(prompt, self.model)
