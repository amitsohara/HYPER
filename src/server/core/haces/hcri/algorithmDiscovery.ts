import { AlgorithmCandidate, ExperimentResult } from "./researchTypes.ts";
import { ResearchEventBus, ResearchEvents } from "./researchEvents.ts";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class AlgorithmDiscoveryEngine {
    private candidates: AlgorithmCandidate[] = [];
    private eventBus = ResearchEventBus.getInstance();

    public evaluateResult(result: ExperimentResult): AlgorithmCandidate | null {
        if (result.confidence > 85 && result.conclusion.includes("outperforms")) {
            const algo: AlgorithmCandidate = {
                algorithm_id: uuidv4(),
                name: "Discovered Optimized Algorithm",
                category: "REASONING",
                description: "Algorithm extracted from successful experiment.",
                evidence_id: result.evidence_collected[0]?.evidence_id || "",
                performance_metrics: result.outcomes,
                timestamp: Date.now()
            };
            this.candidates.push(algo);
            this.eventBus.publish(ResearchEvents.ALGORITHM_DISCOVERED, { algorithm: algo });
            return algo;
        }
        return null;
    }
    
    public getCandidates(): AlgorithmCandidate[] {
        return this.candidates;
    }
}
