import { GoogleGenAI } from "@google/genai";
import { CycleState } from "./cycle_state.js";
import { HyperMindCognitiveCore } from "../hcc/cognitive_core.js";
import { ICycleStep } from "./cycle_step.js";
import { AutonomousLearningEngine } from "../../learning/autonomous_learning.js";

export class LearnStep implements ICycleStep {
  name = "Learn";

  async execute(ai: GoogleGenAI | null, state: CycleState, core: HyperMindCognitiveCore): Promise<void> {
    if (!ai) throw new Error("AI required");
    
    if (process.env.MODEL_MODE === "dev_stub") {
       state.learning = {
           skills_discovered: ["Stub skill"],
           key_takeaways: ["Stub takeaway"],
           provider_used: "dev_stub",
           is_real_ai_output: false
       };
       if (state.experience) state.experience.lessons_learned = ["Stub takeaway"];
       core.updateState({ learning_summary: state.learning, experience_object: state.experience }, "LearnStep");
       return;
    }
    
    const missionData = {
        mission: state.mission,
        reflection: state.reflection,
        experience: state.experience,
        report: state.report || state.action?.plan || state.decision,
        mission_text: typeof state.report === 'string' ? state.report : JSON.stringify(state.report || state.action?.plan || state.decision || "No output generated")
    };
    
    const learning = await AutonomousLearningEngine.evaluateMission(ai, missionData);
    state.learning = learning;
    
    // Also update experience object with learned lessons
    if (state.experience && learning?.key_takeaways) {
        state.experience.lessons_learned = learning.key_takeaways;
    }
    
    core.updateState({ learning_summary: learning, experience_object: state.experience }, "LearnStep");
  }
}
