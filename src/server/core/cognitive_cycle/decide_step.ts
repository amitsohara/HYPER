import { GoogleGenAI } from "@google/genai";
import { CycleState } from "./cycle_state.js";
import { HyperMindCognitiveCore } from "../hcc/cognitive_core.js";
import { ICycleStep } from "./cycle_step.js";
import { StrategicDecisionEngine } from "../strategic_decision_engine.js";

export class DecideStep implements ICycleStep {
  name = "Decide";

  async execute(ai: GoogleGenAI | null, state: CycleState, core: HyperMindCognitiveCore): Promise<void> {
    if (!ai) throw new Error("AI required");
    
    if (process.env.MODEL_MODE === "dev_stub") {
       state.decision = {
           options: ["Stub option"],
           recommendation: { strategy: "Stub strategy", rationale: "Stub rationale" },
           trace: [],
           provider_used: "dev_stub",
           is_real_ai_output: false
       };
       core.updateState({ decision_state: state.decision }, "DecideStep");
       return;
    }
    
    const context = {
        understanding: state.understanding,
        reasoning: state.reasoning,
        prediction: state.prediction
    };
    
    const decision = await StrategicDecisionEngine.evaluate(ai, state.mission, context);
    state.decision = decision;
    
    core.updateState({ decision_state: decision }, "DecideStep");
  }
}
