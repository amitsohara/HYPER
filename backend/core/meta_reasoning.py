import json
from .llm_client import generate_json

class MetaReasoning:
    def __init__(self, memory_engine=None, belief_engine=None, pg_conn=None):
        self.memory = memory_engine
        self.belief = belief_engine
        self.pg = pg_conn

    def reflect_on_mission(self, mission_data):
        """
        Reflect on completed missions and update cognitive state.
        """
        prompt = f"""You are the Meta-Reasoning Engine. Reflect on this mission data: {json.dumps(mission_data)}
Generate a reasoning chain and lessons learned.
Return JSON:
{{
  "reasoning_chain": ["Step 1 thought", "Step 2 thought"],
  "lessons_learned": ["Lesson 1"],
  "evidence_for_beliefs": ["Evidence 1"]
}}"""
        data = generate_json(prompt)
        reflection = {
            "mission_id": mission_data.get("id"),
            "success": mission_data.get("success", True),
            "lessons_learned": data.get("lessons_learned", []),
            "reasoning_chain": data.get("reasoning_chain", [])
        }
        
        if self.belief and data.get("evidence_for_beliefs"):
            self.update_beliefs_based_on_evidence(data["evidence_for_beliefs"])
            
        if self.pg:
            try:
                cursor = self.pg.cursor()
                query = """
                    INSERT INTO meta_reasoning_logs (mission_id, success, lessons_learned, reasoning_chain)
                    VALUES (%s, %s, %s, %s)
                """
                cursor.execute(query, (
                    reflection["mission_id"],
                    reflection["success"],
                    json.dumps(reflection["lessons_learned"]),
                    json.dumps(reflection["reasoning_chain"])
                ))
                self.pg.commit()
            except Exception as e:
                print(f"DB Error: {e}")
                if hasattr(self.pg, 'rollback'):
                    self.pg.rollback()
            
        return reflection

    def update_beliefs_based_on_evidence(self, evidence):
        if self.belief:
            self.belief.update_beliefs_with_evidence(evidence)
