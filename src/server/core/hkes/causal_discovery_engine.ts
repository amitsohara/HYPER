import { GoogleGenAI } from "@google/genai";
import { PatternAbstraction, HeuristicAbstraction, CausalModelAbstraction, AbstractionType } from "./abstraction_types.js";
import { CausalLinkExtractor } from "./causal_link_extractor.js";
import { CausalGraph } from "./causal_graph.js";
import { RootCauseAnalyzer } from "./root_cause_analyzer.js";
import { InterventionSimulator } from "./intervention_simulator.js";
import { CausalValidator } from "./causal_validator.js";
import { CausalMerger } from "./causal_merger.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class CausalDiscoveryEngine {
    static async discover(
        ai: GoogleGenAI, 
        experiences: any[], 
        patterns: PatternAbstraction[], 
        heuristics: HeuristicAbstraction[]
    ): Promise<CausalModelAbstraction[]> {
        if (!patterns.length && !heuristics.length) return [];

        // 1. Extract causal links
        const { nodes, edges } = await CausalLinkExtractor.extract(ai, experiences, patterns, heuristics);
        if (nodes.length === 0 || edges.length === 0) return [];

        // 2. Build causal graph
        const graph = new CausalGraph(nodes, edges);

        // 3. Identify root causes
        const { root_causes, mediators, outcomes } = RootCauseAnalyzer.analyze(graph);

        // 4. Simulate interventions
        const interventions = InterventionSimulator.simulate(graph, root_causes, mediators);

        // Calculate support from patterns & heuristics
        const sourcePatternIds = patterns.map(p => p.abstraction_id);
        const sourceHeuristicIds = heuristics.map(h => h.abstraction_id);
        const sourceDomains = Array.from(new Set([
            ...patterns.flatMap(p => p.source_domains),
            ...heuristics.flatMap(h => h.applicable_domains)
        ]));
        const sourceExpIds = Array.from(new Set([
            ...patterns.flatMap(p => p.source_experience_ids),
            ...heuristics.flatMap(h => h.source_experience_ids)
        ]));

        // Create the candidate model
        const candidateModel: CausalModelAbstraction = {
            abstraction_id: uuidv4(),
            abstraction_type: AbstractionType.CAUSAL_MODEL,
            title: `Causal Model: ${root_causes.join(" and ")}`,
            description: `A causal model showing how ${root_causes.join(", ")} leads to ${outcomes.join(", ")}`,
            source_pattern_ids: sourcePatternIds,
            source_heuristic_ids: sourceHeuristicIds,
            source_experience_ids: sourceExpIds,
            source_domains: sourceDomains,
            applicable_domains: sourceDomains,
            mission_types: [],
            
            causal_nodes: nodes,
            causal_edges: edges,
            
            root_causes,
            mediators,
            moderators: [],
            outcomes,
            
            interventions,
            failure_modes: [],
            
            confidence: 85,
            support_count: sourceExpIds.length,
            contradiction_count: 0,
            causal_strength: 90,
            transferability: 80,
            evidence_strength: 90,
            
            created_at: Date.now(),
            updated_at: Date.now(),
            version: 1
        };

        const discovered = [];

        // 5. Validate
        if (CausalValidator.validate(candidateModel)) {
            // 6. Merge & Store
            const finalModel = CausalMerger.merge(candidateModel);
            discovered.push(finalModel);
        }

        return discovered;
    }
}
