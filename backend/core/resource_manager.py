class ResourceManager:
    def __init__(self):
        self.agents = [
            {"id": "agent_1", "role": "researcher", "status": "idle"},
            {"id": "agent_2", "role": "analyst", "status": "idle"},
            {"id": "agent_3", "role": "planner", "status": "idle"}
        ]

    def allocate_agent(self, required_role):
        """
        Dynamically allocates an idle agent with the required role.
        """
        for agent in self.agents:
            if agent['role'] == required_role and agent['status'] == 'idle':
                agent['status'] = 'busy'
                return agent
        return None

    def release_agent(self, agent_id):
        for agent in self.agents:
            if agent['id'] == agent_id:
                agent['status'] = 'idle'
                break
