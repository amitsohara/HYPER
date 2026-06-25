import json
from .llm_client import generate_json

class OutcomePredictor:
    def __init__(self):
        pass

    def predict_outcomes(self, simulation_states):
        """
        Takes simulation timelines and generates predicted outcomes with probability ranges.
        """
        prompt = f"""You are the Outcome Predictor Engine. Analyze these simulation states: {json.dumps(simulation_states)}
Generate distinct future scenarios based on this timeline.
Return JSON:
{{
  "scenarios": [
    {{
      "scenario": "Optimistic",
      "description": "Description of the outcome.",
      "probability": 0.4
    }},
    {{
      "scenario": "Pessimistic",
      "description": "Description of the outcome.",
      "probability": 0.2
    }},
    {{
      "scenario": "Most Likely",
      "description": "Description of the outcome.",
      "probability": 0.4
    }}
  ]
}}"""
        data = generate_json(prompt)
        return data.get("scenarios", [])

    def compare_scenarios(self, scenario_a, scenario_b):
        """
        Compares two distinct simulated futures and outputs comparative analytics.
        """
        prompt = f"""You are the Outcome Predictor. Compare these two scenarios:
Scenario A: {json.dumps(scenario_a)}
Scenario B: {json.dumps(scenario_b)}
Identify divergence points and risk deltas.
Return JSON:
{{
  "divergence_points": ["Point 1", "Point 2"],
  "risk_delta": 0.15
}}"""
        data = generate_json(prompt)
        return {
            "divergence_points": data.get("divergence_points", []),
            "risk_delta": data.get("risk_delta", 0.0)
        }
