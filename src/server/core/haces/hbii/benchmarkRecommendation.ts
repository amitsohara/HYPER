import { v4 as uuidv4 } from "uuid";
import { BenchmarkRecommendation, BenchmarkGenome } from "./benchmarkTypes.js";

export class BenchmarkRecommendationEngine {
    
    public recommendActions(genome: BenchmarkGenome): BenchmarkRecommendation[] {
        const recommendations: BenchmarkRecommendation[] = [];

        // Simple heuristic: if difficulty trend is flat and high, recommend retiring or increasing difficulty
        if (genome.difficulty_trend.length > 5 && genome.difficulty_trend.every(d => d > 95)) {
            recommendations.push({
                recommendation_id: uuidv4(),
                action: 'INCREASE_DIFFICULTY',
                target_benchmark_id: genome.benchmark_id,
                reasoning: "Benchmark is consistently being passed with high scores; needs increased difficulty to measure true capability."
            });
        }

        return recommendations;
    }
}
