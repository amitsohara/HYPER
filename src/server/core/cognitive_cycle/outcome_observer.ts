import { GoogleGenAI } from "@google/genai";
import { CycleState } from "./cycle_state.js";
import { HyperMindCognitiveCore } from "../hcc/cognitive_core.js";
import { ICycleStep } from "./cycle_step.js";

export class ObserveOutcomeStep implements ICycleStep {
  name = "ObserveOutcome";

  async execute(ai: GoogleGenAI | null, state: CycleState, core: HyperMindCognitiveCore): Promise<void> {
    // If real outcome is available, capture it. Otherwise, mark pending.
    state.outcome = "pending"; 
  }
}
