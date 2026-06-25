import json
from .llm_client import generate_json

class FutureSimulator:
    def __init__(self, memory_engine, knowledge_graph):
        self.memory = memory_engine
        self.graph = knowledge_graph

    def simulate(self, base_state, timeframe_years, domain):
        """
        Simulates progression from a base state across a given timeframe.
        Domains: economy, technology, healthcare, education, environment, politics
        Generates probability ranges instead of certainties.
        """
        prompt = f"""You are the Future Simulator. Simulate events in the {domain} domain over {timeframe_years} years.
Base State: {json.dumps(base_state)}
Generate a timeline of key events and probabilities.
Return JSON:
{{
  "events": [
    {{
      "year_offset": 5,
      "event": "Description of the event",
      "probability": 0.8
    }}
  ]
}}"""
        data = generate_json(prompt)
        return data.get("events", [])
