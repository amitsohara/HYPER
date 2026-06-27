import { GoogleGenAI } from "@google/genai";
import { PremiseAnalyzer } from "./premise_analyzer.js";
import { InternalWorldModel } from "./internal_world_model.js";
import { SceneGraphBuilder } from "./scene_graph_builder.js";
import { PerspectiveEngine } from "./perspective_engine.js";
import { ScenarioSimulator } from "./scenario_simulator.js";
import { CounterfactualGenerator } from "./counterfactual_generator.js";
import { PossibilitySpaceMapper } from "./possibility_space_mapper.js";
import { UnknownProblemSolver } from "./unknown_problem_solver.js";

export class ImaginationEngine {
  static async runImagination(ai: GoogleGenAI, missionId: string, missionText: string): Promise<any> {
    console.log(`[Imagination Engine] Starting imagination process for mission: ${missionId}`);
    
    // 1. Analyze Premise
    const premiseAnalysis = await PremiseAnalyzer.analyze(ai, missionText);
    
    // 2. Build Internal World
    const worldModel = await InternalWorldModel.build(ai, missionText, premiseAnalysis);
    
    // 3. Build Scene Graph
    const sceneGraph = await SceneGraphBuilder.build(ai, worldModel);
    
    // 4. Generate Perspectives
    const perspectives = await PerspectiveEngine.generatePerspectives(ai, missionText, worldModel);
    
    // 5. Simulate Scenarios
    const scenarios = await ScenarioSimulator.simulate(ai, missionText, worldModel);
    
    // 6. Generate Counterfactuals
    const counterfactuals = await CounterfactualGenerator.generate(ai, missionText, worldModel);
    
    // 7. Map Possibility Space
    const possibilitySpace = await PossibilitySpaceMapper.map(ai, scenarios, counterfactuals);
    
    // 8. Solve Unknown Problem
    const solution = await UnknownProblemSolver.solve(ai, missionText, possibilitySpace, premiseAnalysis);

    const imaginationTrace = {
      premise_analysis: premiseAnalysis,
      imagined_world: worldModel,
      scene_graph: sceneGraph,
      perspectives: perspectives,
      scenarios: scenarios,
      counterfactuals: counterfactuals,
      possibility_space: possibilitySpace,
      unknown_solution: solution
    };

    console.log(`[Imagination Engine] Imagination complete for mission: ${missionId}`);
    return imaginationTrace;
  }
}
