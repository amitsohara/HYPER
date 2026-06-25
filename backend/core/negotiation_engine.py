class NegotiationEngine:
    def __init__(self):
        pass

    def negotiate(self, agent_a, agent_b, issue):
        """
        Simulates a negotiation between two agents with persistent personalities.
        """
        # Simplistic negotiation logic based on reputation and personality
        winner = agent_a if agent_a['reputation'] > agent_b['reputation'] else agent_b
        return {
            "issue": issue,
            "winner": winner['id'],
            "resolution": f"Resolved in favor of {winner['id']} based on reputation."
        }
