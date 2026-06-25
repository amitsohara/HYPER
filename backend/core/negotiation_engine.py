import json
from .llm_client import generate_json

class NegotiationEngine:
    def __init__(self):
        pass

    def negotiate(self, agent_a, agent_b, issue):
        """
        Simulates a negotiation between two agents with persistent personalities.
        """
        prompt = f"""You are the Negotiation Engine simulating a debate.
Agent A: {json.dumps(agent_a)}
Agent B: {json.dumps(agent_b)}
Issue: {issue}
Simulate their arguments and determine a winner or compromise based on their personalities and reputations.
Return JSON:
{{
  "winner": "agent_id or 'compromise'",
  "resolution": "Description of the final agreement or argument that won."
}}"""
        data = generate_json(prompt)
        return {
            "issue": issue,
            "winner": data.get("winner", agent_a.get("id")),
            "resolution": data.get("resolution", "Default resolution")
        }

