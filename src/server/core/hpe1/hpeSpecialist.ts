import { HyperMindWorldModelEngine } from "../hwme1/worldModelManager.js";
import * as fs from "fs";
import { ISpecialist, SpecialistRegistration, SpecialistStatus, CognitiveRole } from "../hcse01/types.js";
import { CognitiveDomain, CognitiveEvent } from "../hcns01/types.js";
import { HyperMindEventMesh } from "../hcns01/eventMesh.js";
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
        HyperMindEventMesh.getInstance().subscribe("GOAL_CREATED", async (event: CognitiveEvent) => {
            await this.handleEvent(event);
        });
        
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
        if (event.type === "GOAL_CREATED") {
            const goal: GoalObject = {
                id: event.payload?.goalId || event.payload?.conclusionId || "G-1",
                name: event.payload?.goalName || event.payload?.content || "Generic Goal",
                description: typeof (event.payload?.goalDescription || event.payload?.explanation) === "string" ? (event.payload?.goalDescription || event.payload?.explanation) : JSON.stringify(event.payload?.goalDescription || event.payload?.explanation || ""),
                subGoalIds: [],
                priority: 1,
                status: TaskStatus.PENDING
            };
            
            console.log("[EVENT: HPE_DEBUG] Starting createPlansForGoal");
            let plans = [];
            try {
                plans = await this.planManager.createPlansForGoal(goal, {});
                console.log("[EVENT: HPE_DEBUG] Plans created: " + plans.length);
            } catch (e) {
                console.log("[EVENT: HPE_ERROR] " + (e.stack || e.message));
            }

            if (plans && plans.length > 0) {
                HyperMindEventMesh.getInstance().publish({
                    type: "PLAN_CREATED",
                    domain: CognitiveDomain.PLANNING,
                    priority: 1,
                    source: "HPE",
                    payload: { 
                        plan: plans[0], 
                        worldState: {
                            entities: Array.from(HyperMindWorldModelEngine.getInstance().stateManager.getCanonicalWorld().entities.values()),
                            relationships: Array.from(HyperMindWorldModelEngine.getInstance().stateManager.getCanonicalWorld().relationships.values()),
                            context: HyperMindWorldModelEngine.getInstance().stateManager.getCanonicalWorld().context
                        } 
                    }
                });
            }
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
