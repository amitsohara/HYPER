from backend.core.model_router import router

class GoalEngine:
    async def decompose_mission(self, mission_text: str):
        prompt = f"Break this mission into 3 actionable goals: {mission_text}"
        response = await router.generate(prompt)
        return [
            {"id": "g1", "title": "Analyze Task", "description": "Understand the main objective."},
            {"id": "g2", "title": "Gather Data", "description": "Search memory and LLM knowledge."},
            {"id": "g3", "title": "Synthesize", "description": "Create final output."}
        ]

goal_engine = GoalEngine()
