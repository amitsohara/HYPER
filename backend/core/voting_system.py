import json
from .llm_client import generate_json

class VotingSystem:
    def __init__(self):
        pass

    def vote(self, agents, proposal):
        """
        Holds a vote among all agents for a given proposal.
        """
        prompt = f"""You are the Voting System Engine. Simulate a vote.
Proposal: {proposal}
Agents voting: {json.dumps(agents)}
Consider each agent's personality and goals to determine if they would vote for or against.
Return JSON:
{{
  "approved": true,
  "votes_for": 5,
  "votes_against": 2,
  "reasoning_summary": "Most agents favored it because..."
}}"""
        data = generate_json(prompt)
        return {
            "proposal": proposal,
            "approved": data.get("approved", True),
            "votes_for": data.get("votes_for", 0),
            "votes_against": data.get("votes_against", 0),
            "reasoning_summary": data.get("reasoning_summary", "General consensus.")
        }

