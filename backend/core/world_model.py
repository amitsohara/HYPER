import json
from .llm_client import generate_json

class WorldModel:
    def __init__(self, simulator, predictor, optimizer):
        self.simulator = simulator
        self.predictor = predictor
        self.optimizer = optimizer
        self.causal_graph = []

    def update_causal_model(self, action, outcome, context):
        """
        Learns causal relationships from observed outcomes.
        """
        prompt = f"""You are the World Model Engine. Learn causal relationships from this observation:
Action taken: {action}
Observed Outcome: {outcome}
Context: {context}
Extract cause-and-effect rules.
Return JSON:
{{
  "new_causal_rules": [
    {{
      "cause": "Specific action or condition",
      "effect": "Observed result",
      "confidence": 0.8,
      "context_dependencies": ["Condition 1"]
    }}
  ]
}}"""
        data = generate_json(prompt)
        for rule in data.get("new_causal_rules", []):
            self.causal_graph.append(rule)

    def generate_future_world(self, context, start_year=2025, end_year=2050):
        domains = ["economy", "technology", "healthcare", "education", "environment", "politics"]
        world_state = {"context": context, "timeline": {}}
        
        # Inject learned causal rules into the simulator context
        enhanced_context = context + f" | Known Causal Rules: {json.dumps(self.causal_graph[-5:])}"
        
        for domain in domains:
            sim_result = self.simulator.simulate({"context": enhanced_context}, end_year - start_year, domain)
            world_state["timeline"][domain] = sim_result
            
        outcomes = self.predictor.predict_outcomes(world_state)
        strategies = self.optimizer.optimize_for_outcome("Optimistic", world_state)
        
        return {
            "world_state": world_state,
            "outcomes": outcomes,
            "recommended_strategies": strategies,
            "applied_causal_rules": len(self.causal_graph)
        }

    def run_simulation(self, domain, scenario_parameters):
        enhanced_params = {**scenario_parameters, "causal_rules": self.causal_graph[-5:]}
        return self.simulator.simulate(enhanced_params, 25, domain)

