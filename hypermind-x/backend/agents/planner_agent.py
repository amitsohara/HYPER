from backend.agents.base_agent import BaseAgent
from backend.core.model_router import router

class PlannerAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="Planner-Alpha", role="Planner", model="llama3")

    async def run(self, task: str) -> str:
        prompt = f"As a Master Planner, create clear goals and break this mission down into actionable steps: {task}"
        return await router.generate(prompt, self.model)
