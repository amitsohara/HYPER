import { GoogleGenAI } from "@google/genai";
import { CycleState } from "./cycle_state.js";
import { HyperMindCognitiveCore } from "../hcc/cognitive_core.js";

export interface ICycleStep {
  name: string;
  execute(ai: GoogleGenAI | null, state: CycleState, core: HyperMindCognitiveCore): Promise<void>;
}
