import { Evidence } from "./types.js";

export class EvidenceEngine {
    public rankEvidence(evidenceSet: Evidence[]): Evidence[] {
        return evidenceSet.sort((a, b) => b.confidence - a.confidence);
    }

    public detectConflicts(evidenceSet: Evidence[]): Evidence[][] {
        // Mock conflict detection: if content contains "not " + another content
        const conflicts: Evidence[][] = [];
        for (let i = 0; i < evidenceSet.length; i++) {
            for (let j = i + 1; j < evidenceSet.length; j++) {
                const e1 = evidenceSet[i];
                const e2 = evidenceSet[j];
                if (e1.content.includes(`not ${e2.content}`) || e2.content.includes(`not ${e1.content}`)) {
                    conflicts.push([e1, e2]);
                }
            }
        }
        return conflicts;
    }
}
