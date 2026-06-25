import json
from .llm_client import generate_json

class SelfEvaluator:
    def __init__(self):
        pass

    def evaluate(self, mission_data):
        """
        Evaluates mission performance to track learning.
        """
        prompt = f"""You are the Self Evaluator Engine. Evaluate this mission outcome: {json.dumps(mission_data)}
Provide scores from 0-100 for various metrics.
Return JSON:
{{
  "reasoning_quality": 85,
  "novelty": 60,
  "usefulness": 90,
  "factual_confidence": 95,
  "planning_quality": 80,
  "risk_awareness": 70,
  "learning_value": 75,
  "justification": "Overall solid execution."
}}"""
        data = generate_json(prompt)
        
        return {
            "mission_id": mission_data.get("id"),
            "reasoning_quality": data.get("reasoning_quality", 70),
            "novelty": data.get("novelty", 50),
            "usefulness": data.get("usefulness", 70),
            "factual_confidence": data.get("factual_confidence", 80),
            "planning_quality": data.get("planning_quality", 75),
            "risk_awareness": data.get("risk_awareness", 60),
            "learning_value": data.get("learning_value", 70),
            "justification": data.get("justification", "Default evaluation.")
        }
