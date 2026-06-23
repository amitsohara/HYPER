from backend.agents.base_agent import BaseAgent
from backend.core.model_router import router

class ResearcherAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="Researcher-Beta", role="Researcher", model="llama3")

    async def run(self, task: str) -> str:
        prompt = f"As a Researcher, deeply analyze this mission to provide significant insights and context: {task}"
        return await router.generate(prompt, self.model)
