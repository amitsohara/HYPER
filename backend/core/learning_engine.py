class LearningEngine:
    def __init__(self, skill_extractor, self_evaluator):
        self.extractor = skill_extractor
        self.evaluator = self_evaluator
        self.skill_library = []

    def process_mission(self, mission_data):
        skill = self.extractor.extract_skill(mission_data)
        self.skill_library.append(skill)
        evaluation = self.evaluator.evaluate(skill, mission_data)
        return {"skill": skill, "evaluation": evaluation}
