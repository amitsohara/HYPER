import { ThoughtObject } from "./types.js";

export class ThoughtPrioritizationEngine {
    public calculatePriority(thought: ThoughtObject, goalRelevance: number, urgency: number, novelty: number): number {
        const score = 
            (thought.attentionScore * 0.4) + 
            (goalRelevance * 0.3) + 
            (thought.confidence * 0.1) +
            (novelty * 0.1) +
            (urgency * 0.1);
        
        thought.priority = score;
        return score;
    }

    public rankThoughts(thoughts: ThoughtObject[]): ThoughtObject[] {
        return thoughts.sort((a, b) => b.priority - a.priority);
    }
}
