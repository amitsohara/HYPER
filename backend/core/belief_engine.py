import json
from .llm_client import generate_json

class BeliefEngine:
    def __init__(self, pg_conn=None, qdrant_client=None):
        self.pg = pg_conn
        self.qdrant = qdrant_client
        self.beliefs = []

    def update_beliefs(self, mission_data):
        prompt = f"""You are the Belief Engine. Extract new beliefs from this mission data: {json.dumps(mission_data)}
Return JSON:
{{
  "new_beliefs": [
    {{
      "belief": "State the belief",
      "confidence": 0.8,
      "evidence": ["Evidence 1"]
    }}
  ]
}}"""
        data = generate_json(prompt)
        for b in data.get("new_beliefs", []):
            b["source_missions"] = [mission_data.get("id")]
            self.beliefs.append(b)

    def update_beliefs_with_evidence(self, evidence):
        """
        Update beliefs directly based on new evidence.
        """
        prompt = f"""You are the Belief Engine. Update existing beliefs based on this evidence: {json.dumps(evidence)}
Return JSON:
{{
  "updated_beliefs": [
    {{
      "belief": "State the belief",
      "confidence": 0.9,
      "evidence": ["Old Evidence", "New Evidence"]
    }}
  ]
}}"""
        data = generate_json(prompt)
        for b in data.get("updated_beliefs", []):
            self.beliefs.append(b)

    def get_active_beliefs(self, query=None):
        return self.beliefs

    def get_beliefs_by_concept(self, concept_name):
        return [b for b in self.beliefs if concept_name.lower() in b.get("belief", "").lower()]
