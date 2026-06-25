import json
from .llm_client import generate_json

class CoalitionBuilder:
    def __init__(self):
        pass

    def build_coalition(self, available_agents, task_requirements):
        """
        Forms a team of agents that best match the task requirements.
        """
        prompt = f"""You are the Coalition Builder Engine. Form a team for a task.
Task Requirements: {json.dumps(task_requirements)}
Available Agents: {json.dumps(available_agents)}
Select the best agents for this task based on their roles and reputation.
Return JSON:
{{
  "team_members": ["agent_id_1", "agent_id_2"],
  "reasoning": "Selected agents because..."
}}"""
        data = generate_json(prompt)
        return {
            "task": task_requirements.get("task_name", "Unknown Task"),
            "team_members": data.get("team_members", []),
            "reasoning": data.get("reasoning", "No reasoning provided.")
        }

