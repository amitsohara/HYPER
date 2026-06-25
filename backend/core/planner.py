import json
from .llm_client import generate_json

class Planner:
    def __init__(self, memory_engine=None):
        self.memory = memory_engine

    def plan_multi_step_task(self, goal):
        """
        Plan multi-step tasks based on current goals.
        """
        prompt = f"""You are the Long-Term Planner. Given the goal: "{goal}", generate a multi-step plan.
Return JSON:
{{
  "short_term_steps": [{{"action": "Action 1", "expected_output": "Output 1"}}],
  "medium_term_steps": [{{"action": "Action 2", "expected_output": "Output 2"}}],
  "long_term_steps": [{{"action": "Action 3", "expected_output": "Output 3"}}],
  "required_agents": ["Agent 1"],
  "required_tools": ["Tool 1"],
  "dependencies": ["Dep 1"],
  "failure_points": ["Failure 1"]
}}"""
        data = generate_json(prompt)
        
        return {
            "goal": goal,
            "short_term_steps": data.get("short_term_steps", []),
            "medium_term_steps": data.get("medium_term_steps", []),
            "long_term_steps": data.get("long_term_steps", []),
            "required_agents": data.get("required_agents", []),
            "required_tools": data.get("required_tools", []),
            "dependencies": data.get("dependencies", []),
            "failure_points": data.get("failure_points", []),
            "status": "active"
        }
