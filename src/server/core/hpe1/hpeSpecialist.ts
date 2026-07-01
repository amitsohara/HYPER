import { ISpecialist, SpecialistRegistration, SpecialistStatus, CognitiveRole } from "../hcse01/types.js";
import { CognitiveDomain, CognitiveEvent } from "../hcns01/types.js";
import { PlanManager } from "./planManager.js";
import { GoalObject, TaskStatus } from "./types.js";

export class HPESpecialist implements ISpecialist {
    private registration: SpecialistRegistration = {
        id: "HPE_SPECIALIST_1",
        name: "HPE Executive Planner",
        version: "1.0",
        capabilities: [{
            name: "Goal Decomposition",
            description: "Decomposes goals into atomic tasks",
            domain: CognitiveDomain.PLANNING,
            roles: [CognitiveRole.PLANNING],
            requiredInputs: ["GoalObject"],
            producedOutputs: ["PlanObject[]"],
            confidence: 0.95
        }],
        status: SpecialistStatus.INITIALIZING,
        availability: 1.0,
        priority: 1,
        dependencies: [],
        resourceRequirements: {},
        communicationEndpoints: [],
        researchMapping: { hirqIds: [], hctIds: [] }
    };

    private planManager: PlanManager;
    private metrics = {
        tasksCompleted: 0,
        averageExecutionTime: 0,
        successRate: 1.0
    };

    constructor() {
        this.planManager = PlanManager.getInstance();
    }

    getIdentity(): SpecialistRegistration {
        return this.registration;
    }

    async initialize(): Promise<void> {
        this.registration.status = SpecialistStatus.ACTIVE;
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

    async handleEvent(event: CognitiveEvent): Promise<void> {
        // Handle planning events
        if (event.type === "GOAL_CREATED" && event.payload) {
            const goal: GoalObject = {
                id: event.payload.goalId || "G-1",
                name: event.payload.goalName || "Generic Goal",
                description: event.payload.goalDescription || "",
                subGoalIds: [],
                priority: 1,
                status: TaskStatus.PENDING
            };
            await this.planManager.createPlansForGoal(goal, {});
        }
    }

    getHealth(): { status: SpecialistStatus; metrics: Record<string, any> } {
        return {
            status: this.registration.status,
            metrics: this.metrics
        };
    }

    getConfidence(taskDescription: string): number {
        if (taskDescription.toLowerCase().includes("plan") || taskDescription.toLowerCase().includes("goal")) {
            return 0.9;
        }
        return 0.1;
    }
}
