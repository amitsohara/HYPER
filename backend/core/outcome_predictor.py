import random

class OutcomePredictor:
    def __init__(self):
        pass

    def predict_outcomes(self, simulation_states):
        """
        Takes simulation timelines and generates predicted outcomes with probability ranges.
        """
        return [
            {
                "scenario": "Optimistic",
                "description": "Rapid technological integration leads to abundance and reduced inequality.",
                "probability": round(random.uniform(0.2, 0.4), 2)
            },
            {
                "scenario": "Pessimistic",
                "description": "Economic disruption causes severe stratification and resource contention.",
                "probability": round(random.uniform(0.1, 0.3), 2)
            },
            {
                "scenario": "Most Likely",
                "description": "Gradual adaptation with intermittent crises, ultimately stabilizing.",
                "probability": round(random.uniform(0.4, 0.6), 2)
            }
        ]

    def compare_scenarios(self, scenario_a, scenario_b):
        """
        Compares two distinct simulated futures and outputs comparative analytics.
        """
        return {
            "divergence_points": ["Year 5 economic policy", "Year 15 tech breakthrough"],
            "risk_delta": round(random.uniform(-0.2, 0.2), 2)
        }
