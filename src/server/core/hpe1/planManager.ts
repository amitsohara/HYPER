import { GoalObject, PlanObject, PlanStatus } from "./types.js";
import { PlannerOrchestrator } from "./engines/PlannerOrchestrator.js";
import { ResourceAllocationEngine } from "./engines/resourceAllocationEngine.js";
import { PlanEvaluationEngine } from "./engines/planEvaluationEngine.js";
import { RiskAssessmentEngine } from "./engines/riskAssessmentEngine.js";
import { PlanRepairEngine } from "./engines/planRepairEngine.js";
import { OpportunityEngine } from "./engines/opportunityEngine.js";
import { AdaptivePlanningEngine } from "./engines/adaptivePlanningEngine.js";
import { PlanningMemory } from "./engines/planningMemory.js";
import { HyperMindEventMesh } from "../hcns01/eventMesh.js";

export class PlanManager {
    private static instance: PlanManager;
    
    public plannerOrchestrator: PlannerOrchestrator;
    public resourceAllocationEngine: ResourceAllocationEngine;
    public planEvaluationEngine: PlanEvaluationEngine;
    public riskAssessmentEngine: RiskAssessmentEngine;
    public planRepairEngine: PlanRepairEngine;
    public opportunityEngine: OpportunityEngine;
    public adaptivePlanningEngine: AdaptivePlanningEngine;
    public planningMemory: PlanningMemory;
    
    private constructor() {
        const eventMesh = HyperMindEventMesh.getInstance();
        
        this.plannerOrchestrator = new PlannerOrchestrator();
        this.resourceAllocationEngine = new ResourceAllocationEngine();
        this.planEvaluationEngine = new PlanEvaluationEngine();
        this.riskAssessmentEngine = new RiskAssessmentEngine();
        this.planRepairEngine = new PlanRepairEngine();
        this.opportunityEngine = new OpportunityEngine();
        this.adaptivePlanningEngine = new AdaptivePlanningEngine(eventMesh);
        this.planningMemory = new PlanningMemory();
        

    }

    public static getInstance(): PlanManager {
        if (!PlanManager.instance) {
            PlanManager.instance = new PlanManager();
        }
        return PlanManager.instance;
    }

    public async createPlansForGoal(goal: GoalObject, context: any = {}): Promise<PlanObject[]> {
        // 1. Generate candidate plans
        const candidates = await this.plannerOrchestrator.orchestrate(goal, context);
        
        // 2. Evaluate and enrich candidates
        for (const plan of candidates) {
            plan.resourceEstimate = this.resourceAllocationEngine.estimate(plan);
            plan.riskAssessment = this.riskAssessmentEngine.assess(plan);
            plan.evaluation = this.planEvaluationEngine.evaluate(plan);
            
            plan.planningTrace.push({
                timestamp: Date.now(),
                action: "EVALUATION",
                details: `Evaluated plan with score ${plan.evaluation.overallScore.toFixed(2)}`
            });
            
            plan.status = PlanStatus.READY;
            this.planningMemory.store(plan);
        }
        
        // 3. Rank candidates
        candidates.sort((a, b) => (b.evaluation?.overallScore || 0) - (a.evaluation?.overallScore || 0));
        
        candidates.forEach((plan, index) => {
            plan.candidateRank = index + 1;
        });

        return candidates;
    }

    public repairPlan(plan: PlanObject, failurePointId: string): PlanObject {
        const repairedPlan = this.planRepairEngine.repair(plan, failurePointId);
        this.planningMemory.store(repairedPlan);
        return repairedPlan;
    }
}
