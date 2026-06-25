class WorldModel:
    def __init__(self, simulator, predictor, optimizer):
        self.simulator = simulator
        self.predictor = predictor
        self.optimizer = optimizer

    def generate_future_world(self, context, start_year=2025, end_year=2050):
        domains = ["economy", "technology", "healthcare", "education", "environment", "politics"]
        world_state = {"context": context, "timeline": {}}
        for domain in domains:
            sim_result = self.simulator.simulate(world_state, end_year - start_year, domain)
            world_state["timeline"][domain] = sim_result
            
        outcomes = self.predictor.predict_outcomes(world_state)
        strategies = self.optimizer.optimize_for_outcome("Optimistic", world_state)
        
        return {
            "world_state": world_state,
            "outcomes": outcomes,
            "recommended_strategies": strategies
        }

    def run_simulation(self, domain, scenario_parameters):
        return self.simulator.simulate(scenario_parameters, 25, domain)
