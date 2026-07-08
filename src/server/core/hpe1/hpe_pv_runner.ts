import { PlanManager } from "./planManager.js";
import { GoalObject, TaskStatus, PlanStatus } from "./types.js";

async function runValidation() {
    console.log("Starting HPE PV-01 Validation...");
    const planManager = PlanManager.getInstance();

    const goal: GoalObject = {
        id: "GOAL-100",
        name: "Analyze environment and prepare report",
        description: "Observe the environment, process data, and output a structured report.",
        subGoalIds: [],
        priority: 1,
        status: TaskStatus.PENDING
    };

    console.log(`1. Goal decomposition and Multi-plan generation`);
    const plans = await planManager.createPlansForGoal(goal);

    if (plans.length < 3) {
        throw new Error(`Expected at least 3 candidate plans, got ${plans.length}`);
    }

    console.log(`Generated ${plans.length} candidate plans.`);
    
    // Check if plans are ranked
    for (let i = 0; i < plans.length; i++) {
        const plan = plans[i];
        if (plan.candidateRank !== i + 1) {
            throw new Error(`Plan rank incorrect. Expected ${i + 1}, got ${plan.candidateRank}`);
        }
        
        console.log(`Plan Rank ${plan.candidateRank}: [${plan.metadata.strategy}] Score: ${plan.evaluation?.overallScore.toFixed(2)}`);
        
        if (!plan.resourceEstimate) throw new Error("Missing resource estimate");
        if (!plan.riskAssessment) throw new Error("Missing risk assessment");
        if (!plan.evaluation) throw new Error("Missing plan evaluation");
    }

    const selectedPlan = plans[0];
    console.log(`\nSelected Plan (Rank 1): ${selectedPlan.id}`);
    console.log(`Explainability: ${selectedPlan.explainability}`);
    console.log(`Risk Score: ${selectedPlan.riskAssessment.failureProbability}`);
    console.log(`Resource Est - Parallelism: ${selectedPlan.resourceEstimate.parallelismOpportunities}`);

    console.log(`\n2. Plan Repair`);
    // Simulate failure of the first task
    const taskIds = Array.from(Object.keys(selectedPlan.atomicTasks));
    if (taskIds.length === 0) throw new Error("No atomic tasks generated");

    const failedTaskId = taskIds[0];
    console.log(`Simulating failure of task: ${failedTaskId}`);
    
    const repairedPlan = planManager.repairPlan(selectedPlan, failedTaskId);
    
    if (repairedPlan.status !== PlanStatus.READY) {
        throw new Error(`Plan status should be READY after repair, got ${repairedPlan.status}`);
    }
    
    const repairedTask = repairedPlan.atomicTasks[failedTaskId];
    if (repairedTask?.status !== TaskStatus.FAILED) {
        throw new Error(`Failed task status not updated to FAILED`);
    }

    // Check trace for repair
    const repairTrace = repairedPlan.planningTrace.find(t => t.action === "REPAIR");
    if (!repairTrace) throw new Error("No repair trace found");

    console.log("Plan repair successful.");

    console.log("\n3. Planning Trace (Replay)");
    for (const step of repairedPlan.planningTrace) {
        console.log(`[${new Date(step.timestamp).toISOString()}] ${step.action}: ${step.details}`);
    }

    console.log("\nHPE PV-01 Validation Passed.");
}

runValidation().catch(err => {
    console.error("HPE PV-01 Validation Failed:", err);
    process.exit(1);
});
