import { ResearchPlan, ResearchQuestion } from "./research_task.js";
import { ImpactEstimator } from "./impact_estimator.js";
import { ResearchStatus } from "./research_types.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class ResearchPlanner {
    static createPlan(questions: ResearchQuestion[], context: string): ResearchPlan {
        const plan: ResearchPlan = {
            plan_id: uuidv4(),
            title: `Investigation: ${context}`,
            objectives: [`Resolve ${questions.length} questions regarding ${context}`],
            questions,
            required_data: ["Historical data", "Simulation output"],
            required_tools: ["Dynamic World State Engine", "Hypothesis Generation"],
            required_simulations: ["Standard stress test"],
            experiments: [],
            success_criteria: ["Uncertainty reduced by 50%"],
            stopping_criteria: ["Budget exhausted", "Confidence > 90%"],
            expected_outcomes: ["New validated principle or mechanism"],
            status: ResearchStatus.PROPOSED,
            metrics: ImpactEstimator.estimate({}),
            created_at: Date.now(),
            updated_at: Date.now()
        };
        return plan;
    }
}
