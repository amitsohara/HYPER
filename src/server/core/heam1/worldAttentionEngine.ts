import { AttentionScore } from "./types.js";

export class WorldAttentionEngine {
    public calculateScore(regionId: string, uncertainty: number, rateOfChange: number, criticality: number): AttentionScore {
        const score = (uncertainty * 0.4) + (rateOfChange * 0.3) + (criticality * 0.3);
        
        return {
            totalScore: score,
            components: {
                relevance: criticality,
                novelty: rateOfChange,
                urgency: rateOfChange,
                importance: criticality,
                uncertainty,
                expectedUtility: score,
                confidence: 1.0
            }
        };
    }
}
