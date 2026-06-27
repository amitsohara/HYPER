import { GoogleGenAI } from "@google/genai";
import { CycleState } from "./cycle_state.js";
import { HyperMindCognitiveCore } from "../hcc/cognitive_core.js";
import { ICycleStep } from "./cycle_step.js";
import { generateWithRetry, cleanJSON } from "../../engines.js";

export class ReflectStep implements ICycleStep {
  name = "Reflect";

  async execute(ai: GoogleGenAI | null, state: CycleState, core: HyperMindCognitiveCore): Promise<void> {
    if (!ai) throw new Error("AI required");
    
    if (process.env.MODEL_MODE === "dev_stub") {
       state.reflection = {
           mission_answered: true,
           weak_assumptions: ["Stub weak assumption"],
           missed_items: ["Stub missed item"],
           failures: ["Stub failure"],
           improvements_needed: ["Stub improvement"],
           reflection_summary: "Stub reflection summary",
           provider_used: "dev_stub",
           is_real_ai_output: false
       };
       core.updateState({ reflection_summary: state.reflection }, "ReflectStep");
       return;
    }
    
    const prompt = `Reflect on the cognitive cycle for the following mission.
Mission: "${state.mission}"
Experience: ${JSON.stringify(state.experience)}

Reflect on:
- Did we answer the mission?
- What assumptions were weak?
- What did we miss?
- What failed?
- What should be improved?

Return a JSON object:
{
  "mission_answered": boolean,
  "weak_assumptions": ["List of weak assumptions"],
  "missed_items": ["What was missed"],
  "failures": ["What failed"],
  "improvements_needed": ["What should be improved"],
  "reflection_summary": "Overall summary"
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
        const reflection = await cleanJSON(res.text, ai);
        state.reflection = reflection;
        core.updateState({ reflection_summary: reflection }, "ReflectStep");
    } catch (e) {
        console.error("ReflectStep Error:", e);
        state.reflection = { error: "Failed to reflect" };
    }
  }
}
