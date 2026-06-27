import { GoogleGenAI } from "@google/genai";
import { CycleState } from "./cycle_state.js";
import { HyperMindCognitiveCore } from "../hcc/cognitive_core.js";
import { ICycleStep } from "./cycle_step.js";
import { ActionPlanGenerator } from "../action_plan_generator.js";

export class ActStep implements ICycleStep {
  name = "Act";

  async execute(ai: GoogleGenAI | null, state: CycleState, core: HyperMindCognitiveCore): Promise<void> {
    if (!ai) throw new Error("AI required");
    
    if (process.env.MODEL_MODE === "dev_stub") {
       state.action = { plan: ["Stub step 1", "Stub step 2"] };
       core.updateState({ action_plan: state.action.plan }, "ActStep");
       return;
    }
    
    const plan = await ActionPlanGenerator.generateFromState(ai, state);
    state.action = { plan };
    
    // In the future, this is where actual execution (tools, APIs) would happen
    core.updateState({ action_plan: plan }, "ActStep");
  }
}
