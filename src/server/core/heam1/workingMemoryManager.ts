import { WorkingMemoryState } from "./types.js";

export class WorkingMemoryManager {
    private state: WorkingMemoryState = {
        activeGoals: [],
        activeWorldRegions: [],
        activeConcepts: [],
        capacity: 10,
        currentLoad: 0
    };

    public addGoal(goalId: string): void {
        if (!this.state.activeGoals.includes(goalId)) {
            this.state.activeGoals.push(goalId);
            this.checkCapacity();
        }
    }

    public addWorldRegion(regionId: string): void {
        if (!this.state.activeWorldRegions.includes(regionId)) {
            this.state.activeWorldRegions.push(regionId);
            this.checkCapacity();
        }
    }

    public addConcept(conceptId: string): void {
        if (!this.state.activeConcepts.includes(conceptId)) {
            this.state.activeConcepts.push(conceptId);
            this.checkCapacity();
        }
    }

    public evictLeastImportant(): void {
        // Mock eviction logic
        if (this.state.activeConcepts.length > 0) {
            this.state.activeConcepts.shift();
        } else if (this.state.activeWorldRegions.length > 0) {
            this.state.activeWorldRegions.shift();
        } else if (this.state.activeGoals.length > 0) {
            this.state.activeGoals.shift();
        }
        this.updateLoad();
    }

    private checkCapacity(): void {
        this.updateLoad();
        while (this.state.currentLoad > this.state.capacity) {
            this.evictLeastImportant();
        }
    }

    private updateLoad(): void {
        this.state.currentLoad = this.state.activeGoals.length + this.state.activeWorldRegions.length + this.state.activeConcepts.length;
    }

    public getState(): WorkingMemoryState {
        return { ...this.state };
    }

    public clear(): void {
        this.state.activeGoals = [];
        this.state.activeWorldRegions = [];
        this.state.activeConcepts = [];
        this.updateLoad();
    }
}
