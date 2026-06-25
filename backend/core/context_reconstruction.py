class ContextReconstruction:
    def __init__(self, episodic, semantic, concept, belief):
        self.episodic = episodic
        self.semantic = semantic
        self.concept = concept
        self.belief = belief

    def reconstruct(self, mission_query):
        """
        Before any mission, HyperMind-X reconstructs context.
        Searches:
        - episodic memory
        - semantic memory
        - knowledge graph (concept memory)
        - belief system
        - research reports
        - discoveries
        Only injects relevant memories into reasoning.
        """
        context = {
            "relevant_history": self.episodic.search_episodes(mission_query),
            "facts": self.semantic.search_facts(mission_query),
            "beliefs": self.belief.get_active_beliefs(mission_query),
            "concept_graph": self.concept.get_concept_cluster(mission_query)
        }
        return context
