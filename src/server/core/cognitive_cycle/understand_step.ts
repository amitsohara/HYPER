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
    let relevant_heuristics: any[] = [];
    let heuristic_conflicts: any[] = [];
    let relevant_causal_models: any[] = [];
    let causal_conflicts: any[] = [];
    try {
        const { StrategySelector } = await import("../hecs/strategy_selector.js");
        const { ExperienceTransferEngine } = await import("../hecs/experience_transfer_engine.js");
        const { AbstractionRetriever } = await import("../hkes/abstraction_retriever.js");
        const { HeuristicApplicabilityScorer } = await import("../hkes/heuristic_applicability_scorer.js");
        const { HeuristicConflictDetector } = await import("../hkes/heuristic_conflict_detector.js");
        const { CausalConflictDetector } = await import("../hkes/causal_conflict_detector.js");
        const { AbstractionStore } = await import("../hkes/abstraction_store.js");
        const { AbstractionType } = await import("../hkes/abstraction_types.js");
        
        const domain = mceOutput.understanding?.domain || mceOutput.understanding?.mission_type || "general";
        
        const selected = StrategySelector.select(state.mission, domain);
        retrieved_skills = selected.skills;
        retrieved_strategies = selected.strategies;

        const transfers = await ExperienceTransferEngine.transferExperience(ai, "mission_id_placeholder", state.mission, domain);
        cross_domain_transfers = transfers;

        retrieved_abstractions = AbstractionRetriever.retrieve(state.mission, domain);
        
        // HKES Part 3: Heuristics
        const allHeuristics = AbstractionStore.searchByType(AbstractionType.HEURISTIC) as any[];
        relevant_heuristics = HeuristicApplicabilityScorer.score(state.mission, domain, allHeuristics);
        
        const recommendedHeuristics = relevant_heuristics.filter(h => h.use_recommendation !== 'do_not_use').map(h => h.heuristic);
        heuristic_conflicts = HeuristicConflictDetector.detect(recommendedHeuristics);
        
        // HKES Part 4: Causal Models
        const allCausalModels = AbstractionStore.searchByType(AbstractionType.CAUSAL_MODEL) as any[];
        relevant_causal_models = allCausalModels.filter(m => m.applicable_domains.includes(domain));
        causal_conflicts = CausalConflictDetector.detect(relevant_causal_models);
        
        // Write to Workspace
        if (state.current_workspace_id) {
            const { CognitiveWorkspace } = await import("../hcw/cognitive_workspace.js");
            const { NodeType, EdgeType } = await import("../hcw/workspace_types.js");
            
            CognitiveWorkspace.updateWorkspace(state.current_workspace_id, {
                module_name: "UnderstandStep",
                step_name: "Understand",
                reason: "Mission parsed, domain identified, and constraints extracted.",
                nodes_added: [
                    { id: `domain_${Date.now()}`, type: NodeType.CONCEPT, label: domain, properties: {}, confidence: 90, provenance: ["UnderstandStep"], created_at: Date.now(), updated_at: Date.now() }
                ]
            });
        }
        
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
      retrieved_abstractions,
      relevant_heuristics,
      heuristic_conflicts,
      relevant_causal_models,
      causal_conflicts
    };
    
    core.updateState({ 
        mission_type: state.understanding.mission_type,
        mission_understanding: state.understanding,
        evidence: rankedEvidence,
        retrieved_skills,
        retrieved_strategies,
        cross_domain_transfers,
        retrieved_abstractions,
        relevant_heuristics,
        heuristic_conflicts,
        relevant_causal_models,
        causal_conflicts
    } as any, "UnderstandStep");
  }
}
