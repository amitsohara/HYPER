import json
from .llm_client import generate_json

class ExecutiveFunction:
    def __init__(self, task_manager, priority_engine, resource_manager):
        self.task_manager = task_manager
        self.priority_engine = priority_engine
        self.resource_manager = resource_manager

    def break_down_plan_to_tasks(self, plan):
        prompt = f"""You are the Executive Function. Break down this plan into actionable tasks: {json.dumps(plan)}
Return JSON:
{{
  "tasks": [
    {{
      "title": "Task 1",
      "description": "Details",
      "estimated_difficulty": 5,
      "expected_value": 80,
      "risk_level": 0.2
    }}
  ]
}}"""
        data = generate_json(prompt)
        tasks = data.get("tasks", [])
        created_tasks = []
        for t in tasks:
            t["priority"] = self.priority_engine.calculate(t)
            created = self.task_manager.add_task(t)
            created_tasks.append(created)
        return created_tasks
