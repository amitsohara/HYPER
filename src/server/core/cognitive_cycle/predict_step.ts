import { GoogleGenAI } from "@google/genai";
import { CycleState } from "./cycle_state.js";
import { HyperMindCognitiveCore } from "../hcc/cognitive_core.js";
import { ICycleStep } from "./cycle_step.js";
import { generateWithRetry, cleanJSON } from "../../engines.js";

export class PredictStep implements ICycleStep {
  name = "Predict";

  async execute(ai: GoogleGenAI | null, state: CycleState, core: HyperMindCognitiveCore): Promise<void> {
    if (!ai) throw new Error("AI required");
    
    if (process.env.MODEL_MODE === "dev_stub") {
       state.prediction = {
           best_case: "Stub best case",
           worst_case: "Stub worst case",
           most_likely: "Stub most likely",
           risks: ["Stub risk 1"],
           uncertainty: "Stub uncertainty",
           success_probability: 85,
           provider_used: "dev_stub",
           is_real_ai_output: false
       };
       core.updateState({ prediction_state: state.prediction }, "PredictStep");
       return;
    }
    
    const prompt = `Predict possible outcomes for the mission based on reasoning.
Mission: "${state.mission}"
Reasoning: ${JSON.stringify(state.reasoning)}

Return a JSON object:
{
  "best_case": "Best case outcome",
  "worst_case": "Worst case outcome",
  "most_likely": "Most likely outcome",
  "risks": ["Predicted risks"],
  "uncertainty": "Description of uncertainty",
  "success_probability": number (0-100)
}`;
    
    try {
        const res = await generateWithRetry(ai, {
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                temperature: 0.4
            }
        });
        const prediction = await cleanJSON(res.text, ai);
        state.prediction = prediction;
        core.updateState({ prediction_state: prediction }, "PredictStep");
    } catch (e) {
        console.error("PredictStep Error:", e);
        state.prediction = { error: "Failed to predict" };
    }
  }
}
