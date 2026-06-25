import json
from .llm_client import generate_json

class GoalGenerator:
    def __init__(self, belief_engine=None, memory_engine=None):
        self.belief = belief_engine
        self.memory = memory_engine

    def generate_goals_from_gaps(self, knowledge_gaps):
        """
        Generates goals without user prompting when knowledge gaps are found.
        """
        prompt = f"""You are the Goal Generator Engine. Based on these knowledge gaps: {json.dumps(knowledge_gaps)}, generate a primary goal and subgoals.
Return JSON:
{{
  "primary_goal": "The main objective to resolve these gaps",
  "subgoals": ["Subgoal 1", "Subgoal 2"],
  "hidden_assumptions": ["Assumption 1"],
  "missing_knowledge": ["Knowledge 1"],
  "risk_factors": ["Risk 1"],
  "success_criteria": ["Criteria 1"]
}}"""
        data = generate_json(prompt)
        
        goal = {
            "type": "autonomous_exploration",
            "description": data.get("primary_goal", f"Resolve knowledge gap: {knowledge_gaps[0] if knowledge_gaps else 'unknown'}"),
            "subgoals": data.get("subgoals", []),
            "assumptions": data.get("hidden_assumptions", []),
            "missing_knowledge": data.get("missing_knowledge", []),
            "risk_factors": data.get("risk_factors", []),
            "success_criteria": data.get("success_criteria", []),
            "priority": "high",
            "status": "pending"
        }
        return [goal]
