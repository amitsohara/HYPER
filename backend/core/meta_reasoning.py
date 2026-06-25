class MetaReasoning:
    def __init__(self, memory_engine, belief_engine):
        self.memory = memory_engine
        self.belief = belief_engine

    def reflect_on_mission(self, mission_data):
        """
        Reflect on completed missions and update cognitive state.
        """
        reflection = {
            "mission_id": mission_data.get("id"),
            "success": mission_data.get("success", True),
            "lessons_learned": ["Always verify edge cases", "Improve data sourcing"],
            "reasoning_chain": ["Analyzed input", "Identified constraints", "Executed plan"]
        }
        return reflection

    def update_beliefs_based_on_evidence(self, evidence):
        self.belief.update_beliefs_with_evidence(evidence)
