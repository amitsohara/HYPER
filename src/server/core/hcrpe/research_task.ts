import { ResearchStatus, QuestionType } from "./research_types.js";
import { ResearchMetricsData } from "./research_types.js";

export interface ResearchQuestion {
    question_id: string;
    text: string;
    type: QuestionType;
    context: any; // Related gaps or contradictions
}

export interface ResearchPlan {
    plan_id: string;
    title: string;
    objectives: string[];
    questions: ResearchQuestion[];
    required_data: string[];
    required_tools: string[];
    required_simulations: string[];
    experiments: any[];
    success_criteria: string[];
    stopping_criteria: string[];
    expected_outcomes: string[];
    status: ResearchStatus;
    metrics: ResearchMetricsData;
    created_at: number;
    updated_at: number;
}
