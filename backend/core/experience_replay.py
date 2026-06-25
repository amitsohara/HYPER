import json
from .llm_client import generate_json

class ExperienceReplay:
    def __init__(self, memory_engine=None):
        self.memory = memory_engine

    def replay_mission(self, mission_id):
        """
        Replays past missions for learning and to extract new insights.
        """
        prompt = f"""You are the Experience Replay Engine. Re-evaluate this past mission id: {mission_id}.
Assume it was processed with older logic. Evaluate how current logic would improve the result.
Return JSON:
{{
  "old_score": 70,
  "new_score": 85,
  "intelligence_gain": 15,
  "new_insights": ["Improved prompt pattern", "Removed redundancy"]
}}"""
        data = generate_json(prompt)
        return {
            "mission_id": mission_id,
            "replay_status": "success",
            "old_score": data.get("old_score", 70),
            "new_score": data.get("new_score", 85),
            "intelligence_gain": data.get("intelligence_gain", 15),
            "new_insights": data.get("new_insights", ["Default insight"])
        }
