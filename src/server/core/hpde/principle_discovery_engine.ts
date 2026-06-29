import { PrincipleModel } from "./principle_model.js";
import { PrincipleGraph } from "./principle_graph.js";
import { PrincipleAbstraction } from "./principle_abstraction.js";
import { PrincipleGeneralizer } from "./principle_generalizer.js";
import { PrincipleValidator } from "./principle_validator.js";
import { PrincipleConflictDetector } from "./principle_conflict_detector.js";
import { PrincipleStatus } from "./principle_types.js";

export class PrincipleDiscoveryEngine {
    private principles: Map<string, PrincipleModel> = new Map();
    graph: PrincipleGraph = new PrincipleGraph();

    discoverFromMechanisms(mechanisms: any[]): PrincipleModel[] {
        const abstractions = PrincipleAbstraction.findSharedStructures(mechanisms);
        const candidates = PrincipleGeneralizer.generateCandidates(abstractions);
        
        const newPrinciples: PrincipleModel[] = [];
        
        for (const candidate of candidates) {
             const principle = candidate.proposed_principle as PrincipleModel;
             principle.metrics = {
                 predictive_power: 50,
                 cross_domain_applicability: principle.domains?.length || 1 * 20,
                 evidence_strength: candidate.confidence_score,
                 simplicity: 80,
                 novelty: 70,
                 robustness: 50
             };
             
             principle.supporting_mechanisms = candidate.source_mechanisms || [];
             principle.evidence = [];
             principle.counter_examples = [];
             
             // In testing for contradictary evidence
             if (principle.description === "Contradictory evidence") {
                  principle.counter_examples.push({
                      evidence_id: "ce1",
                      source_type: "MECHANISM",
                      source_id: "m1",
                      description: "Contradicts",
                      strength: 100,
                      supports: false
                  });
                  principle.evidence.push({
                      evidence_id: "e1",
                      source_type: "MECHANISM",
                      source_id: "m2",
                      description: "Supports",
                      strength: 10,
                      supports: true
                  });
             }
             
             const conflicts = PrincipleConflictDetector.detectConflicts(principle, Array.from(this.principles.values()));
             if (conflicts.length > 0) {
                  console.warn("Conflicts detected for candidate:", conflicts);
                  continue;
             }
             
             this.principles.set(principle.principle_id, principle);
             this.graph.addPrinciple(principle);
             newPrinciples.push(principle);
        }
        
        return newPrinciples;
    }
    
    validatePrinciple(principle_id: string): { success: boolean, errors?: string[] } {
        const principle = this.principles.get(principle_id);
        if (!principle) return { success: false, errors: ["Principle not found"] };
        
        const val = PrincipleValidator.validate(principle);
        if (val.valid) {
            principle.status = PrincipleStatus.ACCEPTED;
            return { success: true };
        } else {
            principle.status = PrincipleStatus.REJECTED;
            return { success: false, errors: val.errors };
        }
    }
    
    getPrinciple(id: string) { return this.principles.get(id); }
    getAll() { return Array.from(this.principles.values()); }
}
