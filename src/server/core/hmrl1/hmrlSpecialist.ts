import { MetaReasoningPersistence } from "./persistence.js";
import { StrategySelectionEngine } from "./strategySelectionEngine.js";
import { ConfidenceCalibrationEngine } from "./confidenceCalibrationEngine.js";
import { BiasDetectionEngine } from "./biasDetectionEngine.js";
import { ReflectionEngine } from "./reflectionEngine.js";
import { HypothesisCompetitionEngine } from "./hypothesisCompetitionEngine.js";
import { ContradictionResolutionEngine } from "./contradictionResolutionEngine.js";
import { CognitiveCostEngine } from "./cognitiveCostEngine.js";
import { SelfEvaluationEngine } from "./selfEvaluationEngine.js";
import { ReasoningTraceEngine } from "./reasoningTraceEngine.js";
import { MetaReasoningManager } from "./metaReasoningManager.js";
import { ISpecialist, SpecialistRegistration, SpecialistStatus, CognitiveRole } from "../hcse01/types.js";
import { CognitiveDomain } from "../hcns01/types.js";

export class HyperMindMetaReasoningLayer implements ISpecialist {
    private static instance: HyperMindMetaReasoningLayer;
    private status: SpecialistStatus = SpecialistStatus.LOADING;
    private identity: SpecialistRegistration;

    public persistence: MetaReasoningPersistence;
    public manager: MetaReasoningManager;
    public hypothesisEngine: HypothesisCompetitionEngine;
    public contradictionEngine: ContradictionResolutionEngine;
    public costEngine: CognitiveCostEngine;
    public evalEngine: SelfEvaluationEngine;

    private constructor() {
        this.persistence = new MetaReasoningPersistence();
        const trace = new ReasoningTraceEngine();
        this.manager = new MetaReasoningManager(
            this.persistence,
            new StrategySelectionEngine(),
            new ConfidenceCalibrationEngine(),
            new BiasDetectionEngine(),
            new ReflectionEngine(),
            trace
        );
        this.hypothesisEngine = new HypothesisCompetitionEngine();
        this.contradictionEngine = new ContradictionResolutionEngine();
        this.costEngine = new CognitiveCostEngine();
        this.evalEngine = new SelfEvaluationEngine();

        this.identity = {
            id: "HMRL-01",
            name: "HyperMind Meta-Reasoning Layer",
            version: "1.0.0",
            capabilities: [{
                name: "Meta Reasoning Governance",
                description: "Supervises and optimizes the reasoning process.",
                domain: CognitiveDomain.SYSTEM,
                roles: [CognitiveRole.META_REASONING, CognitiveRole.EXECUTIVE],
                requiredInputs: ["THOUGHT_GENERATED", "GOAL_CREATED"],
                producedOutputs: ["REASONING_STRATEGY_UPDATED"],
                confidence: 1.0
            }],
            status: SpecialistStatus.LOADING,
            availability: 1.0,
            priority: 10,
            dependencies: ["HCNS-01", "HCSE-01", "HTGE-01"],
            resourceRequirements: {},
            communicationEndpoints: ["*"],
            researchMapping: {
                hirqIds: [],
                hctIds: ["MRP-001"]
            }
        };
    }

    public static getInstance(): HyperMindMetaReasoningLayer {
        if (!HyperMindMetaReasoningLayer.instance) {
            HyperMindMetaReasoningLayer.instance = new HyperMindMetaReasoningLayer();
        }
        return HyperMindMetaReasoningLayer.instance;
    }

    public getIdentity(): SpecialistRegistration {
        return this.identity;
    }

    public async initialize(): Promise<void> {
        this.status = SpecialistStatus.INITIALIZING;
        this.identity.status = this.status;
    }

    public async activate(): Promise<void> {
        this.status = SpecialistStatus.ACTIVE;
        this.identity.status = this.status;
    }

    public async suspend(): Promise<void> {
        this.status = SpecialistStatus.SUSPENDED;
        this.identity.status = this.status;
    }

    public async resume(): Promise<void> {
        this.status = SpecialistStatus.ACTIVE;
        this.identity.status = this.status;
    }

    public async retire(): Promise<void> {
        this.status = SpecialistStatus.RETIRING;
        this.identity.status = this.status;
    }

    public async recover(): Promise<void> {
        this.status = SpecialistStatus.ACTIVE;
        this.identity.status = this.status;
    }

    public async handleEvent(event: any): Promise<void> {
        // Implementation for HCNS events
    }

    public getHealth(): { status: SpecialistStatus; metrics: Record<string, any> } {
        return { 
            status: this.status, 
            metrics: {
                totalSessions: this.persistence.getAll().length
            }
        };
    }

    public getConfidence(taskDescription: string): number {
        return taskDescription.includes("reasoning strategy") || taskDescription.includes("meta") ? 1.0 : 0.0;
    }
}
