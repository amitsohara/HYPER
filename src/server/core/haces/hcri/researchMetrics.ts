import { ResearchQuestionManager } from "./researchQuestionManager.ts";
import { HypothesisManager } from "./hypothesisManager.ts";
import { ExperimentPortfolio } from "./experimentPortfolio.ts";
import { CognitiveTheoryEngine } from "./cognitiveTheoryEngine.ts";

export class ResearchMetricsCollector {
    public static collectMetrics(
        questions: ResearchQuestionManager,
        hypotheses: HypothesisManager,
        portfolio: ExperimentPortfolio,
        theories: CognitiveTheoryEngine
    ) {
        return {
            total_questions: questions.getAllQuestions().length,
            total_hypotheses: hypotheses.getAllHypotheses().length,
            experiments_run: portfolio.getAllExperiments().length,
            theories_formulated: theories.getTheories().length
        };
    }
}
