import { PlanObject } from "../types.js";

export class PlanningMemory {
    private plans: Map<string, PlanObject> = new Map();

    store(plan: PlanObject) {
        this.plans.set(plan.id, plan);
    }

    retrieve(planId: string): PlanObject | undefined {
        return this.plans.get(planId);
    }
    
    getAllPlans(): PlanObject[] {
        return Array.from(this.plans.values());
    }
}
