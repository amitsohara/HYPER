export interface Evidence {
    id: string;
    description: string;
    source: string;
    confidence: number;
    timestamp: number;
    quality: "LOW" | "MEDIUM" | "HIGH";
    module: string;
}

export class EvidenceStore {
    private evidence: Evidence[] = [];

    addEvidence(ev: Omit<Evidence, "id" | "timestamp">) {
        this.evidence.push({
            ...ev,
            id: Math.random().toString(36).substring(7),
            timestamp: Date.now()
        });
    }

    getAll() {
        return this.evidence;
    }
}
