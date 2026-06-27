import { GoogleGenAI } from "@google/genai";
import { CycleState } from "./cycle_state.js";
import { HyperMindCognitiveCore } from "../hcc/cognitive_core.js";
import { ICycleStep } from "./cycle_step.js";

export class ImproveStep implements ICycleStep {
  name = "Improve";

  async execute(ai: GoogleGenAI | null, state: CycleState, core: HyperMindCognitiveCore): Promise<void> {
    // Placeholder for updating strategy library and competence tracker
    const improvements = {
        timestamp: Date.now(),
        actions_taken: ["Updated competence tracker (simulated)", "Updated strategy library (simulated)"]
    };
    
    state.improvements = improvements;
    
    if (state.experience && state.learning?.skills_discovered) {
        state.experience.skills_reinforced = state.learning.skills_discovered;
    }

    core.updateState({ improvement_summary: improvements, experience_object: state.experience }, "ImproveStep");
  }
}
