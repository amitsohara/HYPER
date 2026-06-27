import { GoogleGenAI } from "@google/genai";
import { CycleState, ExperienceObject } from "./cycle_state.js";
import { HyperMindCognitiveCore } from "../hcc/cognitive_core.js";
import { ICycleStep } from "./cycle_step.js";

export class ExperienceStep implements ICycleStep {
  name = "Experience";

  async execute(ai: GoogleGenAI | null, state: CycleState, core: HyperMindCognitiveCore): Promise<void> {
    const experience: ExperienceObject = {
      experience_id: `exp_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      mission_id: state.mission_id,
      mission: state.mission,
      context: state.user_context,
      action_taken: state.action,
      predicted_outcome: state.prediction,
      actual_outcome: state.outcome || "pending",
      prediction_error: null,
      success_score: 0, // Will be updated during reflection/learning
      novelty_score: 0,
      importance_score: 0,
      emotional_or_social_context: null,
      lessons_learned: [],
      beliefs_changed: [],
      skills_reinforced: [],
      timestamp: Date.now()
    };
    
    state.experience = experience;
    core.updateState({ experience_object: experience }, "ExperienceStep");
  }
}
