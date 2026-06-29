export enum ResearchEvents {
    RESEARCH_QUESTION_CREATED = "ResearchQuestionCreated",
    HYPOTHESIS_CREATED = "HypothesisCreated",
    EXPERIMENT_DESIGNED = "ExperimentDesigned",
    EXPERIMENT_EXECUTED = "ExperimentExecuted",
    EXPERIMENT_COMPLETED = "ExperimentCompleted",
    THEORY_UPDATED = "TheoryUpdated",
    ALGORITHM_DISCOVERED = "AlgorithmDiscovered",
    TECHNOLOGY_EVALUATED = "TechnologyEvaluated",
    RECOMMENDATION_GENERATED = "RecommendationGenerated",
    RESEARCH_ARCHIVED = "ResearchArchived",
    PEER_REVIEW_COMPLETED = "PeerReviewCompleted",
    PIPELINE_STAGE_CHANGED = "PipelineStageChanged"
}

export type EventCallback = (payload: any) => void;

export class ResearchEventBus {
    private static instance: ResearchEventBus;
    private listeners: Map<ResearchEvents, EventCallback[]> = new Map();

    private constructor() {}

    public static getInstance(): ResearchEventBus {
        if (!ResearchEventBus.instance) {
            ResearchEventBus.instance = new ResearchEventBus();
        }
        return ResearchEventBus.instance;
    }

    public subscribe(event: ResearchEvents, callback: EventCallback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)?.push(callback);
    }

    public publish(event: ResearchEvents, payload: any) {
        const callbacks = this.listeners.get(event) || [];
        callbacks.forEach(cb => cb(payload));
    }
}
