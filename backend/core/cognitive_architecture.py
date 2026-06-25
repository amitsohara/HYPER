import json
from .llm_client import generate_json

class CognitiveArchitecture:
    def __init__(self, context_builder, belief_engine, goal_generator, planner, meta_reasoning):
        self.context_builder = context_builder
        self.belief = belief_engine
        self.goal = goal_generator
        self.planner = planner
        self.meta = meta_reasoning
        self.state = {
            "current_mission": None,
            "uncertainty_level": 0.5,
            "confidence_level": 0.5,
            "knowledge_gaps": [],
            "reasoning_summary": "Initialized."
        }

    def process_mission(self, mission_data):
        self.state["current_mission"] = mission_data.get("id")
        
        prompt = f"""You are the Cognitive Architecture. Assess the uncertainty and knowledge gaps for this mission: {json.dumps(mission_data)}
Return JSON:
{{
  "uncertainty_level": 0.3,
  "knowledge_gaps": ["Missing data source", "Unknown agent dependencies"],
  "reasoning_summary": "The mission objectives are mostly clear, but we lack specifics on data retrieval."
}}"""
        data = generate_json(prompt)
        
        self.state["uncertainty_level"] = data.get("uncertainty_level", 0.5)
        self.state["confidence_level"] = 1.0 - self.state["uncertainty_level"]
        self.state["knowledge_gaps"] = data.get("knowledge_gaps", [])
        self.state["reasoning_summary"] = data.get("reasoning_summary", "Assessed mission.")

        goals = self.goal.generate_goals_from_gaps(self.state["knowledge_gaps"])
        plans = []
        for g in goals:
            plans.append(self.planner.plan_multi_step_task(g["description"]))

        reflection = self.meta.reflect_on_mission(mission_data)
        self.belief.update_beliefs(mission_data)

        return {
            "state": self.state,
            "goals": goals,
            "plans": plans,
            "reflection": reflection
        }
