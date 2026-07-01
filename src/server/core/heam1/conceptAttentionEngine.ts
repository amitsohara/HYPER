import { AttentionScore } from "./types.js";

export class ConceptAttentionEngine {
    public calculateScore(conceptId: string, relevance: number, novelty: number, frequency: number): AttentionScore {
        const score = (relevance * 0.6) + (novelty * 0.3) + (frequency * 0.1);
        
        return {
            totalScore: score,
            components: {
                relevance,
                novelty,
                urgency: 0,
                importance: relevance,
                uncertainty: 0,
                expectedUtility: score,
                confidence: 1.0
            }
        };
    }
}
