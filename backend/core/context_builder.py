class ContextBuilder:
    def __init__(self, episodic, semantic, concept, belief):
        self.episodic = episodic
        self.semantic = semantic
        self.concept = concept
        self.belief = belief

    def build_context(self, current_goal):
        """
        Constructs context from memory systems and belief engine to inform planner.
        """
        return {
            "beliefs": self.belief.get_active_beliefs(current_goal),
            "relevant_history": self.episodic.search_episodes(current_goal),
            "concepts": self.concept.get_concept_cluster(current_goal)
        }
