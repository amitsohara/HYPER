import json
from .llm_client import generate_json

class MemoryConsolidation:
    def __init__(self, episodic, semantic, concept, belief):
        self.episodic = episodic
        self.semantic = semantic
        self.concept = concept
        self.belief = belief

    def consolidate(self, mission_data):
        """
        After every mission, HyperMind-X must:
        - compress memories
        - merge duplicates
        - extract concepts
        - update graph
        - update beliefs
        - identify long-term lessons
        """
        self.episodic.store_episode("mission", mission_data)
        
        prompt = f"""You are the Memory Consolidation Engine. Extract facts and concepts from this mission data: {json.dumps(mission_data)}
Return JSON:
{{
  "facts": ["Fact 1", "Fact 2"],
  "concepts": [
    {{"name": "Concept A", "related_to": "Concept B"}}
  ]
}}"""
        data = generate_json(prompt)
        
        for fact in data.get("facts", []):
            self.semantic.store_fact(fact)
            
        for concept in data.get("concepts", []):
            self.concept.add_concept(concept.get("name"))
            self.concept.link_concepts(concept.get("name"), concept.get("related_to"))
        
        self.belief.update_beliefs(mission_data)

