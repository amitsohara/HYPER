class SocietyManager:
    def __init__(self, negotiation_engine, coalition_builder, voting_system):
        self.negotiation = negotiation_engine
        self.coalition = coalition_builder
        self.voting = voting_system
        self.agents = {}

    def register_agent(self, agent_id, role, personality):
        self.agents[agent_id] = {
            "id": agent_id,
            "role": role,
            "personality": personality,
            "reputation": 50
        }

    def form_team(self, task_requirements):
        return self.coalition.build_coalition(self.agents, task_requirements)

    def resolve_conflict(self, agent_a, agent_b, issue):
        return self.negotiation.negotiate(self.agents[agent_a], self.agents[agent_b], issue)

    def hold_vote(self, proposal):
        return self.voting.vote(self.agents, proposal)
