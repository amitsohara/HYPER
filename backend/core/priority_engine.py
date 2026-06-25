import json
from .llm_client import generate_json

class PriorityEngine:
    def __init__(self):
        pass

    def calculate(self, task):
        """
        Dynamically calculates priority based on task type, urgency, 
        and strategic value.
        """
        prompt = f"""You are the Priority Engine. Analyze this task: {json.dumps(task)}
Calculate a priority score (0-100) based on urgency, importance, dependency impact, and mission relevance.
Return JSON:
{{
  "priority": 85,
  "reasoning": "High urgency due to blocked dependencies."
}}"""
        data = generate_json(prompt)
        return data.get("priority", 50)
