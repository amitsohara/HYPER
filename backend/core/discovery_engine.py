import json
from .llm_client import generate_json

class DiscoveryEngine:
    def __init__(self):
        self.disciplines = ["physics", "biology", "computer_science", "sociology", "economics"]

    def generate_hypotheses(self, topic, discipline):
        prompt = f"Generate hypotheses for {topic} in {discipline}. Return JSON: {{\"hypotheses\": [\"H1\", \"H2\"]}}"
        data = generate_json(prompt)
        return data.get("hypotheses", [f"Hypothesis 1 for {topic} in {discipline}"])

    def generate_competing_explanations(self, hypothesis):
        prompt = f"Generate competing explanations for: {hypothesis}. Return JSON: {{\"explanations\": [\"E1\", \"E2\"]}}"
        data = generate_json(prompt)
        return data.get("explanations", [f"Alternative explanation for {hypothesis}"])

    def create_experiment_roadmap(self, hypothesis):
        prompt = f"Create an experiment roadmap for: {hypothesis}. Return JSON: {{\"phase_1\": \"setup\", \"phase_2\": \"data collection\"}}"
        data = generate_json(prompt)
        return data

    def assess_evidence_confidence(self, evidence):
        return 0.85

    def generate_discovery_report(self, hypotheses, roadmap, confidence):
        prompt = f"""Generate a discovery report summarizing these hypotheses and roadmap.
Hypotheses: {json.dumps(hypotheses)}
Roadmap: {json.dumps(roadmap)}
Confidence: {confidence}
Return JSON: {{"report": "Detailed scientific discovery report..."}}"""
        data = generate_json(prompt)
        return data

