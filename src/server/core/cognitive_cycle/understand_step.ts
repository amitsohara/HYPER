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
           mission_type: "dev_stub_test",
           intent: "Stub intent",
           domain: "Stub domain",
           constraints: ["Stub constraint"],
           stakeholders: ["Stub stakeholder"],
           unknowns: ["Stub unknown"],
           mission_graph: { nodes: [], edges: [] },
           provider_used: "dev_stub",
           is_real_ai_output: false
       };
       core.updateState({ 
           mission_type: "general",
           mission_understanding: state.understanding 
       } as any, "UnderstandStep");
       return;
    }
    
    const mceOutput = await MetaCognitionEngine.analyze(ai, state.mission, state.mode || "standard");
    
    // HECS Part 4 & 5: Retrieve skills, strategies, and cross-domain transfers
    let retrieved_skills = [];
    let retrieved_strategies = [];
    let cross_domain_transfers = [];
    let retrieved_abstractions = [];
    try {
        const { StrategySelector } = await import("../hecs/strategy_selector.js");
        const { ExperienceTransferEngine } = await import("../hecs/experience_transfer_engine.js");
        const { AbstractionRetriever } = await import("../hkes/abstraction_retriever.js");
        const domain = mceOutput.understanding?.domain || mceOutput.understanding?.mission_type || "general";
        
        const selected = StrategySelector.select(state.mission, domain);
        retrieved_skills = selected.skills;
        retrieved_strategies = selected.strategies;

        const transfers = await ExperienceTransferEngine.transferExperience(ai, "mission_id_placeholder", state.mission, domain);
        cross_domain_transfers = transfers;

        retrieved_abstractions = AbstractionRetriever.retrieve(state.mission, domain);
    } catch (e) {
        console.error("[UnderstandStep] Failed to retrieve HECS/HKES data", e);
    }
    
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
      acquired_evidence: rankedEvidence,
      retrieved_skills,
      retrieved_strategies,
      cross_domain_transfers,
      retrieved_abstractions
    };
    
    core.updateState({ 
        mission_type: state.understanding.mission_type,
        mission_understanding: state.understanding,
        evidence: rankedEvidence,
        retrieved_skills,
        retrieved_strategies,
        cross_domain_transfers,
        retrieved_abstractions
    } as any, "UnderstandStep");
  }
}
