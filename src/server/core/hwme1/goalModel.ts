import { CanonicalWorld, HWMEGoal } from "./types.js";
import { v4 as uuidv4 } from "uuid";

export class GoalModel {
    constructor(private canonicalWorld: CanonicalWorld) {}

    public createGoal(data: Omit<HWMEGoal, "id" | "version" | "createdAt" | "updatedAt">): string {
        const id = uuidv4();
        const goal: HWMEGoal = {
            ...data,
            id,
            version: 1,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        this.canonicalWorld.goals.set(id, goal);
        return id;
    }

    public updateGoalStatus(id: string, status: HWMEGoal["status"]): void {
        const goal = this.canonicalWorld.goals.get(id);
        if (goal) {
            goal.status = status;
            goal.updatedAt = Date.now();
            goal.version++;
        }
    }

    public getGoal(id: string): HWMEGoal | undefined {
        return this.canonicalWorld.goals.get(id);
    }
    
    public getActiveGoals(): HWMEGoal[] {
        return Array.from(this.canonicalWorld.goals.values()).filter(g => g.status === 'ACTIVE');
    }
}
