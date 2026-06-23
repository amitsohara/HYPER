from backend.agents.base_agent import BaseAgent
from backend.core.model_router import router

class CriticAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="Critic-Gamma", role="Critic", model="llama3")

    async def run(self, task: str) -> str:
        prompt = f"As a Critic, evaluate the following output. Identify flaws, suggest improvements, and provide a final score out of 100. Output format should include an explicit 'Score: X/100'. Task: {task}"
        return await router.generate(prompt, self.model)
