import { ReasoningPersistence } from "./persistence.js";
import { InferenceGraphEngine } from "./inferenceGraphEngine.js";
import { ReasoningSessionManager } from "./reasoningSessionManager.js";
import { StrategyExecutionLayer } from "./strategyExecutionLayer.js";
import { ExplanationEngine } from "./explanationEngine.js";
import { ConsistencyEngine } from "./consistencyEngine.js";
import { UncertaintyEngine } from "./uncertaintyEngine.js";
import { EvidenceEngine } from "./evidenceEngine.js";
import { HypothesisEngine } from "./hypothesisEngine.js";
import { ReasoningManager } from "./reasoningManager.js";

import { DeductiveStrategy } from "./strategies/deductiveStrategy.js";
import { InductiveStrategy } from "./strategies/inductiveStrategy.js";
import { AbductiveStrategy } from "./strategies/abductiveStrategy.js";
import { ConstraintStrategy } from "./strategies/constraintStrategy.js";
import { ProbabilisticStrategy } from "./strategies/probabilisticStrategy.js";
import { AnalogicalStrategy } from "./strategies/analogicalStrategy.js";
import { MultiHopStrategy } from "./strategies/multiHopStrategy.js";
import { CausalStrategy } from "./strategies/causalStrategy.js";
import { CommonsenseStrategy } from "./strategies/commonsenseStrategy.js";
import { CounterfactualStrategy } from "./strategies/counterfactualStrategy.js";

import { HyperMindEventMesh } from "../hcns01/eventMesh.js";
import { ISpecialist, SpecialistRegistration, SpecialistStatus, CognitiveRole } from "../hcse01/types.js";
import { CognitiveDomain, CognitiveEvent } from "../hcns01/types.js";
import { v4 as uuidv4 } from "uuid";

export class HyperMindReasoningEngine implements ISpecialist {
    private static instance: HyperMindReasoningEngine;
    private status: SpecialistStatus = SpecialistStatus.LOADING;
    private identity: SpecialistRegistration;

    public manager: ReasoningManager;

    private constructor() {
        const persistence = new ReasoningPersistence();
        const graphEngine = new InferenceGraphEngine();
        const sessionManager = new ReasoningSessionManager(persistence, graphEngine);
        
        const strategyLayer = new StrategyExecutionLayer();
        strategyLayer.registerStrategy(new DeductiveStrategy());
        strategyLayer.registerStrategy(new InductiveStrategy());
        strategyLayer.registerStrategy(new AbductiveStrategy());
        strategyLayer.registerStrategy(new ConstraintStrategy());
        strategyLayer.registerStrategy(new ProbabilisticStrategy());
        strategyLayer.registerStrategy(new AnalogicalStrategy());
        strategyLayer.registerStrategy(new MultiHopStrategy());
        strategyLayer.registerStrategy(new CausalStrategy());
        strategyLayer.registerStrategy(new CommonsenseStrategy());
        strategyLayer.registerStrategy(new CounterfactualStrategy());

        this.manager = new ReasoningManager(
            sessionManager,
            strategyLayer,
            new ExplanationEngine(),
            new ConsistencyEngine(),
            new UncertaintyEngine(),
            new EvidenceEngine(),
            new HypothesisEngine()
        );

        this.identity = {
            id: "HRE-01",
            name: "HyperMind Reasoning Engine",
            version: "1.0.0",
            capabilities: [{
                name: "Structured Reasoning",
                description: "Executes reasoning strategies to produce explainable conclusions.",
                domain: CognitiveDomain.SYSTEM,
                roles: [CognitiveRole.REASONING],
                requiredInputs: ["REASONING_STRATEGY_UPDATED"],
                producedOutputs: ["CONCLUSION_GENERATED"],
                confidence: 1.0
            }],
            status: SpecialistStatus.LOADING,
            availability: 1.0,
            priority: 15,
            dependencies: ["HCNS-01", "HCSE-01", "HMRL-01", "HTGE-01"],
            resourceRequirements: {},
            communicationEndpoints: ["*"],
            researchMapping: {
                hirqIds: [],
                hctIds: []
            }
        };
    }

    public static getInstance(): HyperMindReasoningEngine {
        if (!HyperMindReasoningEngine.instance) {
            HyperMindReasoningEngine.instance = new HyperMindReasoningEngine();
        }
        return HyperMindReasoningEngine.instance;
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
        HyperMindEventMesh.getInstance().subscribe("THOUGHT_GENERATED", async (event: CognitiveEvent) => {
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

    public async handleEvent(event: any): Promise<void> {
        if (event.type === "THOUGHT_GENERATED" && event.payload) {
            // Actually execute reasoning instead of bypassing it
            const evidence = [{
                id: uuidv4(),
                type: "OBSERVATION",
                content: event.payload.summary || "Generated from thought",
                confidence: 0.9,
                source: "THOUGHT_GENERATED",
                timestamp: Date.now()
            }];
            
            try {
                const session = await this.manager.executeReasoning(
                    `Reasoning for Thought ${event.payload.thoughtId}`,
                    [event.payload.summary || "Generated from thought"],
                    "DEDUCTIVE",
                    evidence
                );

                if (session.finalConclusions && session.finalConclusions.length > 0) {
                    for (const conclusion of session.finalConclusions) {
                        HyperMindEventMesh.getInstance().publish({
                            type: "CONCLUSION_GENERATED",
                            domain: CognitiveDomain.SYSTEM,
                            priority: 1,
                            source: "HRE-01",
                            payload: {
                                thoughtId: event.payload.thoughtId,
                                conclusionId: conclusion.id,
                                content: conclusion.content,
                                explanation: conclusion.explanation,
                                confidence: conclusion.confidence
                            }
                        });
                    }
                } else {
                    // Fallback to ensure pipeline continues
                    HyperMindEventMesh.getInstance().publish({
                        type: "CONCLUSION_GENERATED",
                        domain: CognitiveDomain.SYSTEM,
                        priority: 1,
                        source: "HRE-01",
                        payload: {
                            thoughtId: event.payload.thoughtId,
                            conclusionId: uuidv4(),
                            content: "Fallback conclusion generated (no rules met)",
                            explanation: { humanReadable: "Fallback explanation" },
                            confidence: 0.5
                        }
                    });
                }
            } catch (e) {
                console.error("Reasoning execution failed", e);
            }
        }
    }

    public getHealth(): { status: SpecialistStatus; metrics: Record<string, any> } {
        return { 
            status: this.status, 
            metrics: {}
        };
    }

    public getConfidence(taskDescription: string): number {
        return taskDescription.includes("reason") || taskDescription.includes("logic") ? 1.0 : 0.0;
    }
}
