import { HyperMindEventMesh, CognitiveDomain, EventPriority } from "../../hcns01/index.js";

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

// Register these schemas so the Mesh allows them
const mesh = HyperMindEventMesh.getInstance();
Object.values(ResearchEvents).forEach(type => {
    if (!mesh.registry.isRegistered(type)) {
        mesh.registerEventType({
            type,
            domain: CognitiveDomain.REASONING, // Research falls under Reasoning/Learning
            description: `Research Event: ${type}`
        });
    }
});

/**
 * Backward compatible facade pointing to HyperMindEventMesh (HCNS-01)
 */
export class ResearchEventBus {
    private static instance: ResearchEventBus;
    private mesh = HyperMindEventMesh.getInstance();

    private constructor() {}

    public static getInstance(): ResearchEventBus {
        if (!ResearchEventBus.instance) {
            ResearchEventBus.instance = new ResearchEventBus();
        }
        return ResearchEventBus.instance;
    }

    public subscribe(event: ResearchEvents, callback: EventCallback) {
        this.mesh.subscribe(event, (meshEvent) => {
            callback(meshEvent.payload);
        });
    }

    public publish(event: ResearchEvents, payload: any) {
        console.log(`[HCNS-01] [HCRI] Publishing: ${event}`);
        this.mesh.publish({
            type: event,
            domain: CognitiveDomain.REASONING,
            priority: EventPriority.NORMAL,
            source: "HCRI",
            payload: payload
        });
    }
}

