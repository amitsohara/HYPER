import { AttentionScore } from "./types.js";

export class GoalAttentionEngine {
    public calculateScore(goalId: string, importance: number, urgency: number, progress: number): AttentionScore {
        const score = (importance * 0.5) + (urgency * 0.4) + ((1 - progress) * 0.1);
        
        return {
            totalScore: score,
            components: {
                relevance: importance,
                novelty: 0,
                urgency,
                importance,
                uncertainty: 1 - progress,
                expectedUtility: score,
                confidence: 1.0
            }
        };
    }
}
