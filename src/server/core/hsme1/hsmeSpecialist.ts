import { ISpecialist, SpecialistRegistration, SpecialistStatus, CognitiveRole } from "../hcse01/types.js";
import { CognitiveDomain, CognitiveEvent } from "../hcns01/types.js";
import { HyperMindEventMesh } from "../hcns01/eventMesh.js";
import { MotorPrimitiveLibrary, SkillCompositionEngine } from "./engines/CompositionEngines.js";
import { PolicyOptimizationEngine, ErrorCorrectionEngine, FeedbackLearningEngine, BalanceLearningEngine } from "./engines/LearningEngines.js";
import { TrajectoryPlanner, TrajectoryOptimizer, CoordinationEngine, TransferLearningEngine } from "./engines/ExecutionEngines.js";
import { ProceduralMemoryManager } from "./managers/ProceduralMemoryManager.js";
import { MotorFeedback, ValidationStatus } from "./types.js";

export class HSMESpecialist implements ISpecialist {
    private registration: SpecialistRegistration = {
        id: "HSME-1",
        name: "HyperMind Sensorimotor Learning Engine",
        version: "1.0.0",
        capabilities: [{
            name: "Sensorimotor Learning",
            description: "Learns procedural motor skills through interaction and feedback.",
            domain: CognitiveDomain.LEARNING,
            roles: [CognitiveRole.REASONING, CognitiveRole.EXECUTION],
            requiredInputs: ["ACTION_COMPLETED", "FEEDBACK_RECEIVED"],
            producedOutputs: ["MOTOR_SKILL_LEARNED", "MOTOR_POLICY_UPDATED", "TRAJECTORY_GENERATED", "PROCEDURAL_MEMORY_UPDATED"],
            confidence: 1.0
        }],
        status: SpecialistStatus.INITIALIZING,
        availability: 1.0,
        priority: 1,
        dependencies: [],
        resourceRequirements: {},
        communicationEndpoints: [],
        researchMapping: { hirqIds: [], hctIds: [] }
    };

    public primitiveLibrary = new MotorPrimitiveLibrary();
    public compositionEngine = new SkillCompositionEngine(this.primitiveLibrary);
    private policyOptimizer = new PolicyOptimizationEngine();
    private errorCorrection = new ErrorCorrectionEngine(this.policyOptimizer);
    public feedbackEngine: FeedbackLearningEngine;
    public balanceEngine = new BalanceLearningEngine();
    public trajectoryPlanner: TrajectoryPlanner;
    public trajectoryOptimizer = new TrajectoryOptimizer();
    public coordinationEngine = new CoordinationEngine();
    public transferEngine = new TransferLearningEngine();
    public memoryManager: ProceduralMemoryManager;

    constructor(private eventMesh: HyperMindEventMesh) {
        this.feedbackEngine = new FeedbackLearningEngine(this.errorCorrection, eventMesh);
        this.trajectoryPlanner = new TrajectoryPlanner(eventMesh);
        this.memoryManager = new ProceduralMemoryManager(eventMesh);
    }

    getIdentity(): SpecialistRegistration {
        return this.registration;
    }

    async initialize(): Promise<void> {
        this.registration.status = SpecialistStatus.ACTIVE;
        this.eventMesh.subscribe("FEEDBACK_RECEIVED", this.handleFeedback.bind(this));
    }

    async activate(): Promise<void> {
        this.registration.status = SpecialistStatus.ACTIVE;
    }

    async suspend(): Promise<void> {
        this.registration.status = SpecialistStatus.SUSPENDED;
    }

    async resume(): Promise<void> {
        this.registration.status = SpecialistStatus.ACTIVE;
    }

    async retire(): Promise<void> {
        this.registration.status = SpecialistStatus.RETIRING;
    }

    async recover(): Promise<void> {
        this.registration.status = SpecialistStatus.ACTIVE;
    }

    getHealth(): { status: SpecialistStatus; metrics: Record<string, any> } {
        return {
            status: this.registration.status,
            metrics: {}
        };
    }

    getConfidence(taskDescription: string): number {
        return 1.0;
    }

    async handleEvent(event: CognitiveEvent<any>): Promise<void> {
        if (event.type === "FEEDBACK_RECEIVED") {
            await this.handleFeedback(event);
        }
    }

    private async handleFeedback(event: CognitiveEvent<any>) {
        const payload = event.payload;
        if (payload.skillId && payload.feedback) {
            const skill = this.memoryManager.retrieve(payload.skillId) || payload.skill; // fallback for test
            if (skill) {
                const updatedSkill = this.feedbackEngine.processFeedback(skill, payload.feedback);
                if (updatedSkill.confidence > 0.8) {
                    updatedSkill.validationStatus = ValidationStatus.EXECUTIVE_APPROVED;
                    this.memoryManager.store(updatedSkill);
                }
            }
        }
    }
}
