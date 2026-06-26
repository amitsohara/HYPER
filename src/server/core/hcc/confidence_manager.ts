import { EvidenceStore } from "./evidence_store.js";
import { CognitiveState } from "./cognitive_state.js";

export class ConfidenceManager {
    static calculateConfidence(evidenceStore: EvidenceStore, state: Partial<CognitiveState>) {
        const evidence = evidenceStore.getAll();
        
        let score = 0;
        let uncertainty = 100;
        const limitations: string[] = [];

        if (evidence.length === 0) {
            limitations.push("No evidence gathered yet.");
            return { score, uncertainty, limitations };
        }

        const highQualityCount = evidence.filter(e => e.quality === "HIGH").length;
        const mediumQualityCount = evidence.filter(e => e.quality === "MEDIUM").length;

        // Base score on evidence quality
        score += (highQualityCount * 15) + (mediumQualityCount * 5);
        
        // Consensus bonus (if multiple modules agree, mock logic here)
        const modules = new Set(evidence.map(e => e.module));
        score += (modules.size * 5);

        score = Math.min(score, 100);
        uncertainty = 100 - score;

        if (modules.size < 2) {
            limitations.push("Relies on single module source.");
        }
        if (highQualityCount === 0) {
            limitations.push("Lacks high-quality evidence.");
        }

        return { score, uncertainty, limitations };
    }
}
