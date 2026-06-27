import { GoogleGenAI } from "@google/genai";
import { CycleState } from "./cycle_state.js";
import { HyperMindCognitiveCore } from "../hcc/cognitive_core.js";
import { ICycleStep } from "./cycle_step.js";

export class ObserveStep implements ICycleStep {
  name = "Observe";

  async execute(ai: GoogleGenAI | null, state: CycleState, core: HyperMindCognitiveCore): Promise<void> {
    state.observation = {
      mission: state.mission,
      user_context: state.user_context,
      hcc_state: core.getState(),
      timestamp: Date.now()
    };
    state.hcc_state_before = { ...state.observation.hcc_state };
  }
}
