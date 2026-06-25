import json
from .llm_client import generate_json

class WorldModelUpdater:
    def __init__(self, pg_conn, neo4j_conn):
        self.pg = pg_conn
        self.neo4j = neo4j_conn

    def fetch_recent_missions(self, limit=10):
        if not self.pg:
            return []
        try:
            cursor = self.pg.cursor()
            query = "SELECT id, objective, context, success, outcome, reasoning_chain, lessons_learned FROM missions ORDER BY created_at DESC LIMIT %s"
            cursor.execute(query, (limit,))
            columns = [desc[0] for desc in cursor.description]
            missions = [dict(zip(columns, row)) for row in cursor.fetchall()]
            return missions
        except Exception as e:
            print(f"Postgres Error in WorldModelUpdater: {e}")
            if hasattr(self.pg, 'rollback'):
                self.pg.rollback()
            return []

    def get_current_causal_graph(self):
        if not self.neo4j:
            return []
        
        query = """
        MATCH (c:Concept)-[r:CAUSES]->(e:Concept)
        RETURN c.name AS cause, e.name AS effect, r.confidence AS confidence, r.context AS context_dependencies
        """
        try:
            if hasattr(self.neo4j, 'session'):
                with self.neo4j.session() as session:
                    result = session.run(query)
                    return [{"cause": record["cause"], "effect": record["effect"], "confidence": record["confidence"], "context_dependencies": record["context_dependencies"]} for record in result]
            return []
        except Exception:
            return []

    def update_causal_graph_in_neo4j(self, updated_graph):
        if not self.neo4j:
            return
        
        try:
            if hasattr(self.neo4j, 'session'):
                with self.neo4j.session() as session:
                    session.run("MATCH ()-[r:CAUSES]->() DELETE r")
                    for rule in updated_graph:
                        session.run("""
                        MERGE (c:Concept {name: $cause})
                        MERGE (e:Concept {name: $effect})
                        MERGE (c)-[r:CAUSES]->(e)
                        SET r.confidence = $confidence, r.context = $context
                        """, cause=rule['cause'], effect=rule['effect'], confidence=rule.get('confidence', 0.5), context=json.dumps(rule.get('context_dependencies', [])))
        except Exception as e:
            print(f"Neo4j Error: {e}")

    def update_from_recent_missions(self):
        """
        Analyzes recent mission outcomes to evolve the world model's causal graph.
        """
        recent_missions = self.fetch_recent_missions()
        current_graph = self.get_current_causal_graph()

        prompt = f"""You are the World Model Evolutionary Engine.
Current Causal Graph: {json.dumps(current_graph)}
Recent Mission Outcomes: {json.dumps(recent_missions)}

Your task is to evolve the World Model. Review the new evidence from recent mission outcomes against the current causal graph.
Extract dynamic causal relationships from the mission data.
Ensure the world model reflects dynamic outcomes rather than static simulations.
If the evidence contradicts a rule, reduce its confidence or remove it.
If the evidence supports a rule, increase its confidence.
If the evidence implies a new rule, add it.

Return the completely updated causal graph in this JSON format:
{{
  "updated_causal_graph": [
    {{
      "cause": "Specific action or condition",
      "effect": "Observed result",
      "confidence": 0.85,
      "context_dependencies": ["Condition 1"]
    }}
  ],
  "evolution_summary": "Summary of what changed based on the new evidence."
}}"""
        
        data = generate_json(prompt)
        
        if "updated_causal_graph" in data:
            self.update_causal_graph_in_neo4j(data["updated_causal_graph"])
            
        return {
            "causal_graph": data.get("updated_causal_graph", current_graph),
            "evolution_summary": data.get("evolution_summary", "World model evolved from recent missions.")
        }
