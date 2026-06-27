import { GoogleGenAI } from "@google/genai";
import { CycleState } from "./cycle_state.js";
import { HyperMindCognitiveCore } from "../hcc/cognitive_core.js";
import { ICycleStep } from "./cycle_step.js";
import { generateWithRetry, cleanJSON } from "../../engines.js";

export class ImagineStep implements ICycleStep {
  name = "Imagine";

  async execute(ai: GoogleGenAI | null, state: CycleState, core: HyperMindCognitiveCore): Promise<void> {
    if (!ai) throw new Error("AI required");
    
    if (process.env.MODEL_MODE === "dev_stub") {
       state.imagination = {
           imagined_world: { description: "Stub imagined world" },
           scene_graph: { nodes: [], edges: [] },
           perspectives: ["Stub perspective"],
           possible_futures: ["Stub future"],
           counterfactuals: ["Stub counterfactual"],
           provider_used: "dev_stub",
           is_real_ai_output: false
       };
       core.updateState({ imagined_world: state.imagination.imagined_world, imagination_trace: state.imagination }, "ImagineStep");
       return;
    }
    
    // Check if the mission is engineering, scientific, or business-focused
    const domainPrompt = `Determine the domain of the following mission.
Mission: "${state.mission}"
Choose exactly one domain from: "Engineering", "Science", "Business", "Government/Social", "General".
Reply with just the domain word.`;

    let domain = "General";
    try {
        const domainRes = await generateWithRetry(ai, {
            model: "gemini-1.5-flash",
            contents: domainPrompt,
            config: { temperature: 0.1 }
        });
        domain = domainRes.text.trim();
    } catch (e) {
        console.warn("Domain detection failed, using General.", e);
    }

    let domainInstructions = "";
    if (domain.includes("Engineering") || domain.includes("Science")) {
        domainInstructions = `Use specialized engineering, physics, and scientific terminology. Focus on structural integrity, material science, thermodynamics, physical constraints, safety margins, and orbital mechanics (if applicable). DO NOT use startup or business jargon (no MVP, GTM, pricing, venture capital, seed investors, CAC, LTV).`;
    } else if (domain.includes("Business")) {
        domainInstructions = `Use specialized startup and business terminology. Focus on Ideal Customer Profile (ICP), Go-to-Market (GTM) strategy, Minimum Viable Product (MVP), product-market fit, unit economics, CAC/LTV, and fundraising.`;
    } else if (domain.includes("Government")) {
        domainInstructions = `Use specialized geopolitical and public policy terminology. Focus on diplomacy, regulation, public infrastructure, social cohesion, and resource allocation.`;
    } else {
        domainInstructions = `Use clear, descriptive language appropriate for the scenario.`;
    }
    
    const imaginationPrompt = `You are the Imagination Engine simulating an internal world model and mapping the possibility space.
Mission: "${state.mission}"
Understanding Context: ${JSON.stringify(state.understanding || {})}

Domain Instructions: ${domainInstructions}

Generate a rich, simulated imagination trace. Return a JSON object with the following structure:
{
  "imagined_world": {
    "world_name": "Name of the scenario world",
    "environment": "Physical or conceptual setting",
    "entities": ["Key elements/objects"],
    "rules": ["Governing rules (physics, economics, etc.)"],
    "constraints": ["Hard limitations"]
  },
  "scene_graph": {
    "nodes": [{"id": "id1", "label": "label1"}],
    "edges": [{"source": "id1", "target": "id2", "relationship": "rel"}]
  },
  "perspectives": ["Viewpoint from different key actors or forces"],
  "possible_futures": ["Best case", "Worst case", "Most likely"],
  "counterfactuals": ["What if X didn't happen?"],
  "unknown_solutions": "How to resolve the biggest unknown in this scenario."
}`;

    try {
        const res = await generateWithRetry(ai, {
            model: "gemini-1.5-flash",
            contents: imaginationPrompt,
            config: {
                responseMimeType: "application/json",
                temperature: 0.7
            }
        });
        const trace = await cleanJSON(res.text, ai);
        
        state.imagination = trace;
        core.updateState({ imagined_world: trace.imagined_world, imagination_trace: trace }, "ImagineStep");
    } catch (e) {
        console.error("ImagineStep Error:", e);
        state.imagination = { error: "Failed to generate imagination" };
    }
  }
}

