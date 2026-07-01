import { WorldStateManager } from "./worldStateManager.js";
import { SimulationBranch } from "./types.js";

export class SimulationEngine {
    constructor(private stateManager: WorldStateManager) {}

    public runSimulation(description: string, operations: (branch: SimulationBranch) => void): SimulationBranch {
        const branch = this.stateManager.createSimulationBranch(description);
        
        // Execute arbitrary operations on the simulation branch (sandboxed from canonical)
        operations(branch);
        
        return branch;
    }

    public mergeSimulation(branchId: string): void {
        // Not typically recommended per WCP-001, but could be used to apply a selected plan
        const branch = this.stateManager.getSimulation(branchId);
        if (!branch) return;

        const canonical = this.stateManager.getCanonicalWorld();
        canonical.entities = new Map(JSON.parse(JSON.stringify(Array.from(branch.entities))));
        canonical.relationships = new Map(JSON.parse(JSON.stringify(Array.from(branch.relationships))));
        this.stateManager.incrementVersion();
    }
}
