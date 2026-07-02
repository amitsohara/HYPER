import { ISpecialist, SpecialistRegistration, SpecialistStatus, CognitiveRole } from "../hcse01/types.js";
import { CognitiveDomain, CognitiveEvent } from "../hcns01/types.js";
import { HyperMindEventMesh } from "../hcns01/eventMesh.js";
import { PerceptionManager } from "./perception/PerceptionManager.js";
import { ActionManager } from "./action/ActionManager.js";
import { IEnvironmentAdapter } from "./eaf/IEnvironmentAdapter.js";
import { SimulationAdapter } from "./eaf/SimulationAdapter.js";
import { Action, ActionStatus } from "./types.js";
import { v4 as uuidv4 } from "uuid";

export class HPAESpecialist implements ISpecialist {
    private registration: SpecialistRegistration = {
        id: "HPAE_SPECIALIST_1",
        name: "HPAE Sensorimotor Interface",
        version: "1.0",
        capabilities: [{
            name: "Perception & Action",
            description: "Executes actions and observes environment",
            domain: CognitiveDomain.EXECUTION,
            roles: [CognitiveRole.EXECUTION],
            requiredInputs: ["Action"],
            producedOutputs: ["ExecutionTrace", "Observation"],
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

    public perceptionManager: PerceptionManager;
    public actionManager: ActionManager;
    private adapter: IEnvironmentAdapter;

    constructor(private eventMesh: HyperMindEventMesh) {
        this.adapter = new SimulationAdapter();
        this.perceptionManager = new PerceptionManager(this.eventMesh, this.adapter);
        this.actionManager = new ActionManager(this.eventMesh, this.adapter);
    }
    
    getIdentity(): SpecialistRegistration {
        return this.registration;
    }

    async initialize(): Promise<void> {
        this.registration.status = SpecialistStatus.ACTIVE;
        
        this.actionManager.skillRegistry.registerSkill({
            id: "S-1",
            name: "Click",
            description: "Click an element",
            parameters: ["x", "y"],
            preconditions: [],
            postconditions: [],
            confidence: 0.99,
            executionCost: 10,
            version: 1
        });
    }

    async activate(): Promise<void> { this.registration.status = SpecialistStatus.ACTIVE; }
    async suspend(): Promise<void> { this.registration.status = SpecialistStatus.SUSPENDED; }
    async resume(): Promise<void> { this.registration.status = SpecialistStatus.ACTIVE; }
    async retire(): Promise<void> { this.registration.status = SpecialistStatus.RETIRING; }
    async recover(): Promise<void> { this.registration.status = SpecialistStatus.ACTIVE; }

    async handleEvent(event: CognitiveEvent): Promise<void> {
        if (event.type === "PLAN_EXECUTE" && event.payload) {
            const action: Action = {
                id: uuidv4(),
                planId: event.payload.planId || "P-1",
                skillId: event.payload.skillId || "S-1",
                parameters: event.payload.parameters || {},
                status: ActionStatus.PENDING,
                timestamp: Date.now()
            };
            
            await this.actionManager.executeAction(action);
            await this.perceptionManager.processEnvironment();
        }
    }

    getHealth(): { status: SpecialistStatus; metrics: Record<string, any> } {
        return { status: this.registration.status, metrics: {} };
    }

    getConfidence(taskDescription: string): number {
        return taskDescription.toLowerCase().includes("execute") ? 0.9 : 0.1;
    }
}
