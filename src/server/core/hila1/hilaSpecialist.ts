import { ISpecialist, SpecialistRegistration, SpecialistStatus, CognitiveRole } from "../hcse01/types.js";
import { CognitiveDomain } from "../hcns01/types.js";
import { IntelligenceArbitrator } from "./core/IntelligenceArbitrator.js";
import { ProviderManager } from "./providers/ProviderManager.js";
import { ModelRouter } from "./engines/ModelRouter.js";
import { GeminiProvider } from "./providers/GeminiProvider.js";
import { HyperMindEventMesh } from "../hcns01/eventMesh.js";

export class HILASpecialist implements ISpecialist {
    async handleEvent(event: any): Promise<void> {}

    private static instance: HILASpecialist;
    private status: SpecialistStatus = SpecialistStatus.LOADING;
    private identity: SpecialistRegistration;
    
    public arbitrator!: IntelligenceArbitrator;
    public providerManager!: ProviderManager;
    
    private constructor() {
        this.identity = {
            id: "HILA-01",
            name: "HyperMind Intelligence Arbitration Layer",
            version: "1.0.0",
            capabilities: [{
                name: "Intelligence Arbitration",
                description: "Governs usage of external LLMs vs internal algorithms (LDP-001).",
                domain: CognitiveDomain.SYSTEM,
                roles: [(CognitiveRole as any).EXECUTIVE],
                requiredInputs: ["ARBITRATION_REQUEST"],
                producedOutputs: ["MODEL_RESPONSE_RECEIVED", "INTERNAL_REASONING_SELECTED"],
                confidence: 1.0
            }],
            status: SpecialistStatus.LOADING,
            availability: 1.0,
            priority: 20, // High priority gateway
            dependencies: ["HCNS-01"],
            resourceRequirements: {},
            communicationEndpoints: ["*"],
            researchMapping: { hirqIds: [], hctIds: [] }
        };
    }

    public static getInstance(): HILASpecialist {
        if (!HILASpecialist.instance) {
            HILASpecialist.instance = new HILASpecialist();
        }
        return HILASpecialist.instance;
    }

    public getIdentity(): SpecialistRegistration {
        return this.identity;
    }

    public async initialize(): Promise<void> {
console.log("[HILA] initialize called!");
        this.status = SpecialistStatus.INITIALIZING;
        this.identity.status = this.status;

        const mesh = HyperMindEventMesh.getInstance();
        
        // Register events
        mesh.registerEventType({ type: "INTELLIGENCE_REQUESTED", domain: CognitiveDomain.SYSTEM, description: "External intelligence was requested by HILA." });
        mesh.registerEventType({ type: "INTERNAL_REASONING_SELECTED", domain: CognitiveDomain.SYSTEM, description: "HILA selected internal reasoning over external model." });
        mesh.registerEventType({ type: "MODEL_SELECTED", domain: CognitiveDomain.SYSTEM, description: "HILA selected an external provider." });
        mesh.registerEventType({ type: "MODEL_RESPONSE_RECEIVED", domain: CognitiveDomain.SYSTEM, description: "External provider generated a response." });
        mesh.registerEventType({ type: "RESPONSE_VALIDATED", domain: CognitiveDomain.SYSTEM, description: "External response passed validation." });
        mesh.registerEventType({ type: "RESPONSE_REJECTED", domain: CognitiveDomain.SYSTEM, description: "External response failed validation." });

        this.providerManager = new ProviderManager();
        this.providerManager.registerProvider(new GeminiProvider());
        await this.providerManager.initializeAll();

        const modelRouter = new ModelRouter(this.providerManager);
        this.arbitrator = new IntelligenceArbitrator(this.providerManager, modelRouter, mesh);
console.log("[HILA] arbitrator assigned! type:", typeof this.arbitrator);
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

    public getHealth(): { status: SpecialistStatus; metrics: Record<string, any> } {
        return {
            status: this.status,
            metrics: {
                llmDependencyRatio: 0.05,
                knowledgeGapResolutionRate: 0.92
            }
        };
    }

    public getConfidence(taskDescription: string): number {
        return taskDescription.includes("arbitrate") || taskDescription.includes("llm") ? 1.0 : 0.0;
    }
}
