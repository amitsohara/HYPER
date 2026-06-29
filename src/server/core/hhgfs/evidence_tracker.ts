import { Evidence } from "./hypothesis_model.js";

export class EvidenceTracker {
    private evidenceMap: Map<string, Evidence[]> = new Map();

    addEvidence(hypothesis_id: string, evidence: Evidence) {
        if (!this.evidenceMap.has(hypothesis_id)) {
            this.evidenceMap.set(hypothesis_id, []);
        }
        this.evidenceMap.get(hypothesis_id)!.push(evidence);
    }
    
    getEvidence(hypothesis_id: string): Evidence[] {
        return this.evidenceMap.get(hypothesis_id) || [];
    }
}
