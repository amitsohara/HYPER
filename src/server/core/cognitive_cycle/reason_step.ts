import { GoogleGenAI } from "@google/genai";
import { CycleState } from "./cycle_state.js";
import { HyperMindCognitiveCore } from "../hcc/cognitive_core.js";
import { ICycleStep } from "./cycle_step.js";
import { generateWithRetry, cleanJSON } from "../../engines.js";

export class ReasonStep implements ICycleStep {
  name = "Reason";

  async execute(ai: GoogleGenAI | null, state: CycleState, core: HyperMindCognitiveCore): Promise<void> {
    if (!ai) throw new Error("AI required");
    
    if (process.env.MODEL_MODE === "dev_stub") {
       state.reasoning = {
           deductive: "Stub deductive reasoning",
           inductive: "Stub inductive reasoning",
           abductive: "Stub abductive reasoning",
           causal: "Stub causal reasoning",
           consistency_checks: ["Stub consistency check"],
           constraint_checks: ["Stub constraint check"],
           synthesis: "Stub synthesis",
           provider_used: "dev_stub",
           is_real_ai_output: false
       };
       core.updateState({ reasoning_state: state.reasoning }, "ReasonStep");
       return;
    }
    
    const acquiredEvidence = state.understanding?.acquired_evidence || [];
    const evidenceSummary = acquiredEvidence.length > 0 
        ? JSON.stringify(acquiredEvidence) 
        : "WARNING: No evidence was acquired. Reasoning will be based solely on internal assumptions.";

    const prompt = `Perform reasoning on the following mission and context.
Mission: "${state.mission}"
Understanding: ${JSON.stringify(state.understanding)}
Imagination: ${JSON.stringify(state.imagination)}
Acquired Evidence: ${evidenceSummary}

Perform deductive, inductive, abductive, and causal reasoning based on the Acquired Evidence. Check for consistency and constraints.

Return a JSON object:
{
  "deductive": "Deductive reasoning summary (cite evidence)",
  "inductive": "Inductive reasoning summary (cite evidence)",
  "abductive": "Abductive reasoning summary (cite evidence)",
  "causal": "Causal reasoning summary (cite evidence)",
  "consistency_checks": ["List of consistency checks"],
  "constraint_checks": ["List of constraint checks"],
  "synthesis": "Overall reasoning synthesis",
  "evidence_utilization_warning": "${acquiredEvidence.length === 0 ? 'No evidence available' : 'None'}"
}`;
    
    try {
        const res = await generateWithRetry(ai, {
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                temperature: 0.3
            }
        });
        const reasoning = await cleanJSON(res.text, ai);
        state.reasoning = reasoning;
        core.updateState({ reasoning_state: reasoning }, "ReasonStep");
    } catch (e) {
        console.error("ReasonStep Error:", e);
        state.reasoning = { error: "Failed to reason" };
    }
  }
}
