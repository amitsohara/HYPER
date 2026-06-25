import json
from .llm_client import generate_json

class AutonomousLearning:
    def __init__(self, skill_extractor, experience_replay, self_evaluator):
        self.skill_extractor = skill_extractor
        self.experience_replay = experience_replay
        self.self_evaluator = self_evaluator

    def process_mission_learning(self, mission_data):
        evaluation = self.self_evaluator.evaluate(mission_data)
        extracted_skill = self.skill_extractor.extract_skill(mission_data)
        # Randomly replay an old mission to learn from contrast
        replay = self.experience_replay.replay_mission(mission_data.get("id"))
        
        return {
            "evaluation": evaluation,
            "skill": extracted_skill,
            "replay": replay
        }
