class SemanticMemory:
    def __init__(self, pg_conn, qdrant_client):
        self.pg = pg_conn
        self.qdrant = qdrant_client

    def store_fact(self, concept, fact_text, embedding):
        """
        Stores factual knowledge into PostgreSQL and its vector into Qdrant.
        """
        pass

    def search_facts(self, query_vector, limit=5):
        """
        Uses Qdrant to find semantically similar facts.
        """
        return []

    def get_facts_by_concept(self, concept_name):
        return []
