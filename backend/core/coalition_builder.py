class CoalitionBuilder:
    def __init__(self):
        pass

    def build_coalition(self, available_agents, task_requirements):
        """
        Forms a team of agents that best match the task requirements.
        """
        team = []
        required_roles = task_requirements.get('roles', [])
        
        for role in required_roles:
            best_agent = None
            for agent_id, agent in available_agents.items():
                if agent['role'] == role and (best_agent is None or agent['reputation'] > best_agent['reputation']):
                    if agent_id not in [a['id'] for a in team]:
                        best_agent = agent
            if best_agent:
                team.append(best_agent)
                
        return {
            "task": task_requirements.get("task_name"),
            "team_members": [a['id'] for a in team]
        }
