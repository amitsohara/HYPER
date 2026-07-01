import { SaliencyMetrics } from "./types.js";

export class SaliencyEngine {
    public computeSaliency(metrics: Partial<SaliencyMetrics>): number {
        const defaultMetrics: SaliencyMetrics = {
            novelty: 0,
            unexpectedness: 0,
            importance: 0,
            urgency: 0,
            risk: 0,
            reward: 0,
            predictionError: 0,
            contradiction: 0
        };

        const finalMetrics = { ...defaultMetrics, ...metrics };
        
        let score = 0;
        score += finalMetrics.novelty * 1.5;
        score += finalMetrics.unexpectedness * 2.0;
        score += finalMetrics.importance * 3.0;
        score += finalMetrics.urgency * 2.5;
        score += finalMetrics.risk * 2.0;
        score += finalMetrics.reward * 1.5;
        score += finalMetrics.predictionError * 1.2;
        score += finalMetrics.contradiction * 2.0;

        return Math.min(100, score);
    }
}
