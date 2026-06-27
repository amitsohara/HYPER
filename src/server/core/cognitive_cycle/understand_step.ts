import { GoogleGenAI } from "@google/genai";
import { CycleState } from "./cycle_state.js";
import { HyperMindCognitiveCore } from "../hcc/cognitive_core.js";
import { ICycleStep } from "./cycle_step.js";
import { MetaCognitionEngine } from "../meta_cognition_engine.js";

export class UnderstandStep implements ICycleStep {
  name = "Understand";

  async execute(ai: GoogleGenAI | null, state: CycleState, core: HyperMindCognitiveCore): Promise<void> {
    if (!ai) throw new Error("AI required");
    
    if (process.env.MODEL_MODE === "dev_stub") {
       state.understanding = {
           intent: "Stub intent",
           domain: "Stub domain",
           constraints: ["Stub constraint"],
           stakeholders: ["Stub stakeholder"],
           unknowns: ["Stub unknown"],
           mission_graph: { nodes: [], edges: [] },
           provider_used: "dev_stub",
           is_real_ai_output: false
       };
       core.updateState({ mission_understanding: state.understanding }, "UnderstandStep");
       return;
    }
    
    const mceOutput = await MetaCognitionEngine.analyze(ai, state.mission, state.mode || "standard");
    
    const { planKnowledgeAcquisition } = await import("../knowledge/knowledge_planner.js");
    const { routeAndAcquire } = await import("../knowledge/source_router.js");
    const { scoreCredibility } = await import("../knowledge/source_credibility_scorer.js");
    const { generateCitation } = await import("../knowledge/citation_manager.js");
    const { rankEvidence } = await import("../knowledge/evidence_ranker.js");
    
    const needs = await planKnowledgeAcquisition(ai, state.mission);
    let allEvidence: any[] = [];
    for (const need of needs) {
        const rawEvidence = await routeAndAcquire(ai, need);
        const scoredEvidence = rawEvidence.map((e: any) => generateCitation(scoreCredibility(e)));
        allEvidence.push(...scoredEvidence);
    }
    const rankedEvidence = await rankEvidence(ai, allEvidence, state.mission);
    
    state.understanding = {
      ...mceOutput.understanding,
      mission_graph: mceOutput.mission_graph,
      capabilities: mceOutput.capabilities,
      resources: mceOutput.resources,
      execution_plan: mceOutput.execution_plan,
      acquired_evidence: rankedEvidence
    };
    
    core.updateState({ mission_understanding: state.understanding }, "UnderstandStep");
  }
}
