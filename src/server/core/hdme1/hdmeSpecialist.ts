import { HyperMindWorldModelEngine } from "../hwme1/worldModelManager.js";
import { ISpecialist, SpecialistRegistration, SpecialistStatus, CognitiveRole } from "../hcse01/types.js";
import { CognitiveDomain, CognitiveEvent } from "../hcns01/types.js";
import { HyperMindEventMesh } from "../hcns01/eventMesh.js";
import { DecisionFusionEngine } from "./engines/DecisionFusionEngine.js";
import { UtilityEvaluationEngine } from "./engines/UtilityEvaluationEngine.js";
import { RiskAssessmentEngine } from "./engines/RiskAssessmentEngine.js";
import { ExecutivePolicyEngine } from "./engines/ExecutivePolicyEngine.js";
import { ActionAuthorizationEngine } from "./engines/ActionAuthorizationEngine.js";
import { MissionLifecycleManager } from "./managers/MissionLifecycleManager.js";
import { DecisionContext } from "./types.js";

export class HDMESpecialist implements ISpecialist {
    private registration: SpecialistRegistration = {
        id: "HDME-1",
        name: "HyperMind Decision & Executive Engine",
        version: "1.0.0",
        capabilities: [{
            name: "Action Authorization",
            description: "Evaluates plans and authorizes action.",
            domain: CognitiveDomain.SYSTEM,
            roles: [CognitiveRole.REASONING],
            requiredInputs: ["PLAN_EVALUATED"],
            producedOutputs: ["ACTION_AUTHORIZED", "ACTION_REJECTED"],
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

    private fusionEngine = new DecisionFusionEngine();
    private utilityEngine = new UtilityEvaluationEngine();
    private riskEngine = new RiskAssessmentEngine();
    private policyEngine = new ExecutivePolicyEngine();
    private authEngine: ActionAuthorizationEngine;
    public missionManager: MissionLifecycleManager;

    constructor(private eventMesh: HyperMindEventMesh) {
        this.authEngine = new ActionAuthorizationEngine(eventMesh);
        this.missionManager = new MissionLifecycleManager(eventMesh);
        
        // Add a basic safety policy
        this.policyEngine.registerPolicy({
            id: "safe-01",
            type: "SAFETY",
            name: "Basic Safety",
            description: "No option with greater than 90% risk.",
            evaluate: (ctx, opt) => (opt.riskScore || 0) <= 0.9
        });
    }

    getIdentity(): SpecialistRegistration {
        return this.registration;
    }

    async initialize(): Promise<void> {
        this.registration.status = SpecialistStatus.ACTIVE;
        this.eventMesh.subscribe("PLAN_EVALUATED", this.handlePlanEvaluated.bind(this));
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

    async handleEvent(event: CognitiveEvent<any>): Promise<void> {
        if (event.type === "PLAN_EVALUATED") {
            await this.handlePlanEvaluated(event);
        }
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

    private async handlePlanEvaluated(event: CognitiveEvent<any>) {
        const payload = event.payload;
        
        // 1. Fuse
        let ws = {};
        try {
            ws = {
                entities: Array.from(HyperMindWorldModelEngine.getInstance().stateManager.getCanonicalWorld().entities.values()),
                relationships: Array.from(HyperMindWorldModelEngine.getInstance().stateManager.getCanonicalWorld().relationships.values())
            };
        } catch(e) {}
        const context: DecisionContext = { missionId: event.payload?.missionId || "sys-mission", worldStateSnapshot: ws };
        const decision = this.fusionEngine.fuse(payload, context);

        // 2. Evaluate Utility & Risk
        for (const option of decision.options) {
            this.utilityEngine.evaluate(option);
            this.riskEngine.evaluate(option);
            
            // 3. Apply Policies
            this.policyEngine.evaluate(context, option);
        }

        // 4. Authorize
        this.authEngine.authorize(decision);
    }
}
