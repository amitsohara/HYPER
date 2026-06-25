import json
from .llm_client import generate_json

class SkillExtractor:
    def __init__(self):
        self.skills = {}

    def extract_skill(self, mission_data):
        """
        Extracts reusable skills from completed missions.
        """
        prompt = f"""You are the Skill Extractor Engine. Analyze this mission: {json.dumps(mission_data)}
Identify reasoning patterns, successful strategies, and reusable concepts to form a new skill.
Return JSON:
{{
  "skill_name": "Name of the skill",
  "skill_description": "What it does",
  "domain": "e.g., Logical Reasoning, File I/O",
  "use_case": "When to apply it",
  "procedure": ["Step 1", "Step 2"],
  "evidence": "Why it works based on this mission"
}}"""
        data = generate_json(prompt)
        
        return {
            "skill_name": data.get("skill_name", f"Extracted_Skill_{mission_data.get('id', 'unknown')}"),
            "skill_description": data.get("skill_description", ""),
            "domain": data.get("domain", "General"),
            "use_case": data.get("use_case", "Unknown"),
            "procedure": data.get("procedure", ["Step A", "Step B"]),
            "evidence": data.get("evidence", "")
        }
