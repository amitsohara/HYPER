from backend.agents.planner_agent import PlannerAgent
from backend.agents.researcher_agent import ResearcherAgent
from backend.agents.critic_agent import CriticAgent
from backend.agents.creator_agent import CreatorAgent

class AgentFactory:
    def __init__(self):
        self.registry = {
            "planner": PlannerAgent,
            "researcher": ResearcherAgent,
            "critic": CriticAgent,
            "creator": CreatorAgent
        }
        
    def provision_agent(self, role: str):
        agent_class = self.registry.get(role.lower())
        if agent_class:
            return agent_class()
        return ResearcherAgent()
        
    def create_team_for_mission(self, goals):
        return [
            {"agent_id": "a1", "role": "planner", "name": "Planner-Alpha"},
            {"agent_id": "a2", "role": "researcher", "name": "Researcher-Beta"}
        ]

agent_factory = AgentFactory()
