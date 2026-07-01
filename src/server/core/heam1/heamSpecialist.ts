import { ISpecialist, SpecialistRegistration, SpecialistStatus, CognitiveRole } from "../hcse01/types.js";
import { CognitiveEvent, CognitiveDomain } from "../hcns01/types.js";
import { ExecutiveAttentionManager } from "./executiveAttentionManager.js";
import { HyperMindCognitiveSociety } from "../hcse01/societyManager.js";
import { HyperMindEventMesh } from "../hcns01/eventMesh.js";
import { v4 as uuidv4 } from "uuid";

export class HyperMindExecutiveAttentionEngine implements ISpecialist {
    private static instance: HyperMindExecutiveAttentionEngine;
    private status: SpecialistStatus = SpecialistStatus.LOADING;
    private identity: SpecialistRegistration;
    
    public manager: ExecutiveAttentionManager;

    private constructor() {
        this.manager = new ExecutiveAttentionManager(HyperMindCognitiveSociety.getInstance());
        
        this.identity = {
            id: "HEAM-01",
            name: "HyperMind Executive Attention Manager",
            version: "1.0.0",
            capabilities: [{
                name: "Attention Management",
                description: "Allocates cognitive resources and controls working memory",
                domain: CognitiveDomain.SYSTEM,
                roles: [CognitiveRole.MONITORING],
                requiredInputs: ["WORLD_MODEL_UPDATED", "CONCEPT_DISCOVERED", "GOAL_CREATED"],
                producedOutputs: ["ATTENTION_SHIFTED", "ATTENTION_INTERRUPTED"],
                confidence: 1.0
            }],
            status: SpecialistStatus.LOADING,
            availability: 1.0,
            priority: 1, // Highest priority
            dependencies: ["HCNS-01", "HCSE-01", "HWME-01", "HCCE-01"],
            resourceRequirements: {},
            communicationEndpoints: ["*"],
            researchMapping: {
                hirqIds: ["HIRQ-03"],
                hctIds: ["ACP-001"]
            }
        };
    }

    public static getInstance(): HyperMindExecutiveAttentionEngine {
        if (!HyperMindExecutiveAttentionEngine.instance) {
            HyperMindExecutiveAttentionEngine.instance = new HyperMindExecutiveAttentionEngine();
        }
        return HyperMindExecutiveAttentionEngine.instance;
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
        
        const mesh = HyperMindEventMesh.getInstance();
        if (!mesh.registry.isRegistered("ATTENTION_SHIFTED")) {
            mesh.registerEventType({
                type: "ATTENTION_SHIFTED",
                domain: CognitiveDomain.SYSTEM,
                description: "Attention Shifted to new candidates"
            });
        }
        if (!mesh.registry.isRegistered("ATTENTION_INTERRUPTED")) {
            mesh.registerEventType({
                type: "ATTENTION_INTERRUPTED",
                domain: CognitiveDomain.SYSTEM,
                description: "Attention was interrupted"
            });
        }

        mesh.subscribe("WORLD_MODEL_UPDATED", async (event: CognitiveEvent) => {
            await this.handleEvent(event);
        });
        mesh.subscribe("CONCEPT_DISCOVERED", async (event: CognitiveEvent) => {
            await this.handleEvent(event);
        });
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

    public async handleEvent(event: CognitiveEvent): Promise<void> {
        if (event.type === "WORLD_MODEL_UPDATED") {
            const score = this.manager.worldAttentionEngine.calculateScore("world_region_1", 0.8, 0.5, 0.9);
            this.manager.registerCandidate({
                id: uuidv4(),
                type: "WORLD_REGION",
                referenceId: "world_region_1",
                score,
                timestamp: Date.now()
            });
            this.manager.shiftAttention();
        } else if (event.type === "CONCEPT_DISCOVERED") {
            const score = this.manager.conceptAttentionEngine.calculateScore("concept_1", 0.9, 0.9, 1);
            this.manager.registerCandidate({
                id: uuidv4(),
                type: "CONCEPT",
                referenceId: "concept_1",
                score,
                timestamp: Date.now()
            });
            this.manager.shiftAttention();
        }
    }

    public getHealth(): { status: SpecialistStatus; metrics: Record<string, any> } {
        return { 
            status: this.status, 
            metrics: {
                load: this.manager.cognitiveLoadManager.getMetrics()
            }
        };
    }

    public getConfidence(taskDescription: string): number {
        return 1.0; // Executive always has high confidence for allocation
    }
}
