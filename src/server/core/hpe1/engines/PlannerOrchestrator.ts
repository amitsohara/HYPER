import { PlanObject, GoalObject } from "../types.js";
import { IPlanningStrategy } from "../IPlanningStrategy.js";
import { HTNPlanner } from "../planners/HTNPlanner.js";
import { GOAPPlanner } from "../planners/GOAPPlanner.js";
import { GraphPlanner } from "../planners/GraphPlanner.js";
import { ConstraintPlanner } from "../planners/ConstraintPlanner.js";
import { UtilityPlanner } from "../planners/UtilityPlanner.js";
import { HILASpecialist } from "../../hila1/hilaSpecialist.js";
import { v4 as uuidv4 } from "uuid";

export class PlannerOrchestrator {
    private planners: IPlanningStrategy[] = [];

    constructor() {
        this.planners.push(new HTNPlanner());
        this.planners.push(new GOAPPlanner());
        this.planners.push(new GraphPlanner());
        this.planners.push(new ConstraintPlanner());
        this.planners.push(new UtilityPlanner());
    }

    async orchestrate(goal: GoalObject, context: any): Promise<PlanObject[]> {
        const allCandidates: PlanObject[] = [];

        // Try all planners
        for (const planner of this.planners) {
            const plans = await planner.generatePlans(goal, context);
            allCandidates.push(...plans);
        }

        // If no planner could generate a plan, we have a knowledge gap
        if (allCandidates.length === 0) {
            console.log(`[PlannerOrchestrator] All planners failed for goal ${goal.name}. Consulting HILA for knowledge...`);
            
            let knowledge = "";
            try {
                const hila = HILASpecialist.getInstance();
                console.log(`[PlannerOrchestrator] hila exists: ${!!hila}, arbitrator exists: ${!!hila?.arbitrator}`);
if (hila && hila.arbitrator) {
                    const request = {
                        id: uuidv4(),
                        missionId: "SYSTEM",
                        domain: "RESEARCH",
                        task: `Provide facts, constraints, and strategies to achieve the goal: ${goal.name}`,
                        context: { goal },
                        priority: 5,
                        requiredConfidence: 0.8
                    };
                    // Pass low confidence to trigger external arbitration
                    const arbitration = await hila.arbitrator.arbitrate(request, 0.2);
                    if (arbitration.useExternal) {
                        const response = await hila.arbitrator.executeExternal(request, arbitration);
                        console.log(`[PlannerOrchestrator] response exists: ${!!response}, content: ${response?.content}`);
if (response && response.content) {
                            knowledge = response.content;
                        }
                    }
                }
            } catch (e) {
                console.error("Failed to retrieve external knowledge via HILA:", e);
            }

            if (knowledge) {
                console.log(`[PlannerOrchestrator] Received knowledge from HILA. Retrying planners...`);
                // Inject the retrieved knowledge into the context
                context.retrievedKnowledge = knowledge;

                for (const planner of this.planners) {
                    const plans = await planner.generatePlans(goal, context);
                    allCandidates.push(...plans);
                }
            }
        }

        return allCandidates;
    }
}
