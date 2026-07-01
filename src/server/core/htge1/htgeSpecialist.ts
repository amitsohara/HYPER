import { ThoughtPersistence } from "./thoughtPersistence.js";
import { ThoughtManager } from "./thoughtManager.js";
import { ThoughtGenerator } from "./thoughtGenerator.js";
import { ThoughtWorkspace } from "./thoughtWorkspace.js";
import { ThoughtEvolutionEngine } from "./thoughtEvolutionEngine.js";
import { ThoughtDependencyGraph } from "./thoughtDependencyGraph.js";
import { ThoughtPrioritizationEngine } from "./thoughtPrioritizationEngine.js";
import { HypothesisManager } from "./hypothesisManager.js";
import { ReflectionEngineAdapter } from "./reflectionEngineAdapter.js";
import { ISpecialist, SpecialistRegistration, SpecialistStatus, CognitiveRole } from "../hcse01/types.js";
import { CognitiveEvent, CognitiveDomain } from "../hcns01/types.js";
import { HyperMindEventMesh } from "../hcns01/eventMesh.js";

export class HyperMindThoughtGenerationEngine implements ISpecialist {
    private static instance: HyperMindThoughtGenerationEngine;
    private status: SpecialistStatus = SpecialistStatus.LOADING;
    private identity: SpecialistRegistration;

    public persistence: ThoughtPersistence;
    public manager: ThoughtManager;
    public generator: ThoughtGenerator;
    public workspace: ThoughtWorkspace;
    public evolutionEngine: ThoughtEvolutionEngine;
    public dependencyGraph: ThoughtDependencyGraph;
    public prioritizationEngine: ThoughtPrioritizationEngine;
    public hypothesisManager: HypothesisManager;
    public reflectionAdapter: ReflectionEngineAdapter;

    private constructor() {
        this.persistence = new ThoughtPersistence();
        this.workspace = new ThoughtWorkspace(this.persistence);
        this.prioritizationEngine = new ThoughtPrioritizationEngine();
        this.manager = new ThoughtManager(this.persistence, this.prioritizationEngine, this.workspace);
        this.generator = new ThoughtGenerator(this.manager);
        this.evolutionEngine = new ThoughtEvolutionEngine(this.persistence);
        this.dependencyGraph = new ThoughtDependencyGraph(this.persistence);
        this.hypothesisManager = new HypothesisManager(this.persistence);
        this.reflectionAdapter = new ReflectionEngineAdapter(this.persistence);

        this.identity = {
            id: "HTGE-01",
            name: "HyperMind Thought Generation Engine",
            version: "1.0.0",
            capabilities: [{
                name: "Thought Management",
                description: "Generates, manages, and evolves explicit Thought Objects.",
                domain: CognitiveDomain.SYSTEM,
                roles: [CognitiveRole.REASONING],
                requiredInputs: ["ATTENTION_SHIFTED", "WORLD_MODEL_UPDATED", "CONCEPT_DISCOVERED"],
                producedOutputs: ["THOUGHT_GENERATED", "THOUGHT_EVOLVED"],
                confidence: 1.0
            }],
            status: SpecialistStatus.LOADING,
            availability: 1.0,
            priority: 5,
            dependencies: ["HCNS-01", "HCSE-01", "HEAM-01", "HWME-01", "HCCE-01"],
            resourceRequirements: {},
            communicationEndpoints: ["*"],
            researchMapping: {
                hirqIds: ["HIRQ-04"],
                hctIds: ["TGP-001"]
            }
        };
    }

    public static getInstance(): HyperMindThoughtGenerationEngine {
        if (!HyperMindThoughtGenerationEngine.instance) {
            HyperMindThoughtGenerationEngine.instance = new HyperMindThoughtGenerationEngine();
        }
        return HyperMindThoughtGenerationEngine.instance;
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
        if (!mesh.registry.isRegistered("THOUGHT_GENERATED")) {
            mesh.registerEventType({
                type: "THOUGHT_GENERATED",
                domain: CognitiveDomain.SYSTEM,
                description: "A new thought object was generated"
            });
        }

        mesh.subscribe("ATTENTION_SHIFTED", async (event: CognitiveEvent) => {
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
        if (event.type === "ATTENTION_SHIFTED") {
            const wm = event.payload.workingMemory;
            if (wm && wm.activeGoals && wm.activeGoals.length > 0) {
                const thought = this.generator.generateFromGoalFocus(wm.activeGoals[0], 0.8);
                
                HyperMindEventMesh.getInstance().publish({
                    type: "THOUGHT_GENERATED",
                    domain: CognitiveDomain.SYSTEM,
                    priority: 1,
                    source: "HTGE-01",
                    payload: { thoughtId: thought.id, summary: thought.summary }
                });
            }
        }
    }

    public getHealth(): { status: SpecialistStatus; metrics: Record<string, any> } {
        return { 
            status: this.status, 
            metrics: {
                activeThoughts: this.workspace.getActiveThoughts().length,
                totalThoughts: this.persistence.getAll().length
            }
        };
    }

    public getConfidence(taskDescription: string): number {
        return taskDescription.includes("thought") || taskDescription.includes("reasoning") ? 0.9 : 0.1;
    }
}
