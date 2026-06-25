import os
from .episodic_memory import EpisodicMemory
from .semantic_memory import SemanticMemory
from .procedural_memory import ProceduralMemory
from .concept_memory import ConceptMemory
from .belief_engine import BeliefEngine
from .memory_consolidation import MemoryConsolidation
from .forgetting_engine import ForgettingEngine
from .context_reconstruction import ContextReconstruction

class PersistentBrain:
    def __init__(self, pg_conn, neo4j_conn, qdrant_client):
        self.episodic = EpisodicMemory(pg_conn)
        self.semantic = SemanticMemory(pg_conn, qdrant_client)
        self.procedural = ProceduralMemory(pg_conn)
        self.concept = ConceptMemory(neo4j_conn)
        self.belief = BeliefEngine(pg_conn, qdrant_client)
        
        self.consolidation = MemoryConsolidation(
            self.episodic, self.semantic, self.concept, self.belief
        )
        self.forgetting = ForgettingEngine(
            self.episodic, self.semantic, self.belief
        )
        self.context = ContextReconstruction(
            self.episodic, self.semantic, self.concept, self.belief
        )

    def process_mission_complete(self, mission_data):
        self.consolidation.consolidate(mission_data)
        self.forgetting.apply_decay()

    def reconstruct_context(self, current_mission_query):
        return self.context.reconstruct(current_mission_query)
