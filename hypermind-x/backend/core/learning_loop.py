from backend.core.model_router import router
from backend.core.synthetic_world import synthetic_world_engine
from backend.core.scenario_simulator import scenario_simulator
from backend.agents.researcher_agent import ResearcherAgent
from backend.core.evaluator import evaluator
from backend.core.reflection_engine import reflection_engine
import json
import re

class LearningLoop:
    async def run_loop(self, mission_text: str):
        # 1. Generate Worlds
        worlds = await synthetic_world_engine.generate_worlds(mission_text, num_worlds=3)
        
        # 2. Generate Scenarios
        scenarios = await scenario_simulator.generate_scenarios(worlds, mission_text)
        
        # 3. Agents Solve Scenarios
        agent = ResearcherAgent()
        results = []
        for s in scenarios:
            solution = await agent.run(f"Solve this scenario: {s['scenario']} for mission: {mission_text}")
            results.append({
                "world": s["world"],
                "scenario": s["scenario"],
                "solution": solution
            })
            
        # 4. Evaluate & Score Best
        best_solution = None
        best_score = -1
        
        for r in results:
            eval_res = await evaluator.evaluate(mission_text, r["solution"])
            score = eval_res.get("quality_score", 0)
            r["score"] = score
            if score > best_score:
                best_score = score
                best_solution = r
                
        # 5. Reflection
        combined_outputs = json.dumps(results)
        reflection = await reflection_engine.reflect(mission_text, combined_outputs, "Compared multiple scenarios.")
        
        return {
            "worlds": worlds,
            "scenario_results": results,
            "best_solution": best_solution,
            "reflection": reflection
        }

learning_loop = LearningLoop()
