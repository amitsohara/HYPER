import { PlanObject, GoalObject } from "./types.js";

export interface IPlanningStrategy {
    getName(): string;
    generatePlans(goal: GoalObject, context: any): Promise<PlanObject[]>;
}
