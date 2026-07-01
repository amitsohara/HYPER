import { ISpecialist, SpecialistRegistration, SpecialistStatus, CognitiveRole } from "../hcse01/types.js";
import { CognitiveEvent, CognitiveDomain } from "../hcns01/types.js";
import { ConceptManager } from "./conceptManager.js";
import { ConceptMemory } from "./conceptMemory.js";
import { ConceptValidationEngine } from "./conceptValidationEngine.js";
import { ConceptConfidenceEngine } from "./conceptConfidenceEngine.js";
import { ConceptDiscoveryEngine } from "./conceptDiscoveryEngine.js";
import { AbstractionEngine } from "./abstractionEngine.js";
import { GeneralizationEngine } from "./generalizationEngine.js";
import { SpecializationEngine } from "./specializationEngine.js";
import { ConceptSimilarityEngine } from "./conceptSimilarityEngine.js";
import { ConceptRelationshipEngine } from "./conceptRelationshipEngine.js";
import { ConceptEvolutionEngine } from "./conceptEvolutionEngine.js";
import { ConceptHierarchyEngine } from "./conceptHierarchyEngine.js";
import { AnalogyEngine } from "./analogyEngine.js";
import { PatternMiningEngine } from "./patternMiningEngine.js";
import { HyperMindWorldModelEngine } from "../hwme1/worldModelManager.js";
import { HyperMindEventMesh } from "../hcns01/eventMesh.js";

export class HyperMindConceptAndAbstractionEngine implements ISpecialist {
    private static instance: HyperMindConceptAndAbstractionEngine;

    private status: SpecialistStatus = SpecialistStatus.LOADING;
    
    public memory: ConceptMemory;
    public manager: ConceptManager;
    public validationEngine: ConceptValidationEngine;
    public confidenceEngine: ConceptConfidenceEngine;
    public discoveryEngine: ConceptDiscoveryEngine;
    public abstractionEngine: AbstractionEngine;
    public generalizationEngine: GeneralizationEngine;
    public specializationEngine: SpecializationEngine;
    public similarityEngine: ConceptSimilarityEngine;
    public relationshipEngine: ConceptRelationshipEngine;
    public evolutionEngine: ConceptEvolutionEngine;
    public hierarchyEngine: ConceptHierarchyEngine;
    public analogyEngine: AnalogyEngine;
    public patternMiningEngine: PatternMiningEngine;
    
    private identity: SpecialistRegistration;

    private constructor() {
        this.memory = new ConceptMemory();
        this.validationEngine = new ConceptValidationEngine();
        this.confidenceEngine = new ConceptConfidenceEngine();
        this.manager = new ConceptManager(this.memory, this.validationEngine, this.confidenceEngine);
        
        const hwme = HyperMindWorldModelEngine.getInstance();
        this.discoveryEngine = new ConceptDiscoveryEngine(this.manager, hwme);
        this.abstractionEngine = new AbstractionEngine(this.memory, this.manager);
        this.generalizationEngine = new GeneralizationEngine(this.memory, this.manager);
        this.specializationEngine = new SpecializationEngine(this.memory, this.manager);
        this.similarityEngine = new ConceptSimilarityEngine(this.memory);
        this.relationshipEngine = new ConceptRelationshipEngine(this.memory);
        this.evolutionEngine = new ConceptEvolutionEngine(this.memory);
        this.hierarchyEngine = new ConceptHierarchyEngine(this.memory);
        this.analogyEngine = new AnalogyEngine(this.memory);
        this.patternMiningEngine = new PatternMiningEngine(hwme, this.manager);

        this.identity = {
            id: "HCCE-01",
            name: "HyperMind Concept & Abstraction Engine",
            version: "1.0.0",
            capabilities: [{
                name: "Concept Emergence",
                description: "Discovers and evolves cognitive concepts from HWME",
                domain: CognitiveDomain.SYSTEM,
                roles: [CognitiveRole.REASONING, CognitiveRole.LEARNING, CognitiveRole.CREATIVITY],
                requiredInputs: ["WORLD_MODEL_UPDATED"],
                producedOutputs: ["CONCEPT_DISCOVERED", "CONCEPT_EVOLVED"],
                confidence: 1.0
            }],
            status: SpecialistStatus.LOADING,
            availability: 1.0,
            priority: 10,
            dependencies: ["HWME-01", "HCNS-01", "HCSE-01"],
            resourceRequirements: {},
            communicationEndpoints: ["*"],
            researchMapping: {
                hirqIds: ["HIRQ-02"],
                hctIds: ["CEP-001", "WCP-001"]
            }
        };
    }

    public static getInstance(): HyperMindConceptAndAbstractionEngine {
        if (!HyperMindConceptAndAbstractionEngine.instance) {
            HyperMindConceptAndAbstractionEngine.instance = new HyperMindConceptAndAbstractionEngine();
        }
        return HyperMindConceptAndAbstractionEngine.instance;
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
        if (!mesh.registry.isRegistered("CONCEPT_DISCOVERED")) {
            mesh.registerEventType({
                type: "CONCEPT_DISCOVERED",
                domain: CognitiveDomain.SYSTEM,
                description: "Concept Discovered"
            });
        }

        mesh.subscribe("WORLD_MODEL_UPDATED", async (event: CognitiveEvent) => {
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
            this.discoveryEngine.mineWorldModelForConcepts();
            this.patternMiningEngine.minePatterns();
            
            HyperMindEventMesh.getInstance().publish({
                type: "CONCEPT_DISCOVERED",
                domain: CognitiveDomain.SYSTEM,
                priority: 1,
                source: "HCCE-01",
                payload: { processed: true }
            });
        }
    }

    public getHealth(): { status: SpecialistStatus; metrics: Record<string, any> } {
        return { 
            status: this.status, 
            metrics: {
                activeConcepts: this.memory.getActiveConcepts().length
            }
        };
    }

    public getConfidence(taskDescription: string): number {
        if (taskDescription.includes("concept") || taskDescription.includes("abstraction")) {
            return 0.95;
        }
        return 0.1;
    }
}
