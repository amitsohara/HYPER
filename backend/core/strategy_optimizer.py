import json
from .llm_client import generate_json

class StrategyOptimizer:
    def __init__(self):
        pass

    def optimize_for_outcome(self, target_outcome, simulation_results):
        """
        Recommends strategies and interventions to maximize the probability of a target outcome.
        """
        prompt = f"""You are the Strategy Optimizer. Maximize probability for: {target_outcome}
Simulation Context: {json.dumps(simulation_results)}
Generate a list of recommended strategies to achieve this outcome.
Return JSON:
{{
  "recommended_strategies": [
    "Strategy 1",
    "Strategy 2",
    "Strategy 3"
  ]
}}"""
        data = generate_json(prompt)
        return data.get("recommended_strategies", [
            "Implement universal basic safety nets prior to peak automation.",
            "Subsidize decentralized energy grids to prevent infrastructure collapse.",
            "Establish international accords on AI capability bounds."
        ])

