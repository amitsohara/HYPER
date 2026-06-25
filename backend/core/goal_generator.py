class GoalGenerator:
    def __init__(self, belief_engine, memory_engine):
        self.belief = belief_engine
        self.memory = memory_engine

    def generate_goals_from_gaps(self, knowledge_gaps):
        """
        Generates goals without user prompting when knowledge gaps are found.
        """
        goals = []
        for gap in knowledge_gaps:
            goals.append({
                "type": "autonomous_exploration",
                "description": f"Resolve knowledge gap: {gap}",
                "priority": "high"
            })
        return goals
