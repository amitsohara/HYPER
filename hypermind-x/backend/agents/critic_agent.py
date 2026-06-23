from backend.agents.base_agent import BaseAgent
from backend.core.model_router import router

class CriticAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="Critic-Gamma", role="Critic", model="llama3")

    async def run(self, task: str) -> str:
        prompt = f"As a Critic, evaluate the flaws in this: {task}"
        return await router.generate(prompt, self.model)
