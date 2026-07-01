import { CanonicalWorld, SimulationBranch, TemporalSnapshot, HWMEEntity, HWMERelationship, HWMEGoal } from "./types.js";
import { v4 as uuidv4 } from "uuid";

export class WorldStateManager {
    private canonicalWorld: CanonicalWorld;
    private historicalSnapshots: Map<string, TemporalSnapshot> = new Map();
    private simulations: Map<string, SimulationBranch> = new Map();

    constructor() {
        this.canonicalWorld = {
            id: "canonical",
            version: 1,
            entities: new Map(),
            relationships: new Map(),
            goals: new Map(),
            context: {}
        };
    }

    public getCanonicalWorld(): CanonicalWorld {
        return this.canonicalWorld;
    }

    public incrementVersion(): void {
        this.canonicalWorld.version++;
    }

    public createSnapshot(description: string): TemporalSnapshot {
        const snapshot: TemporalSnapshot = {
            snapshotId: uuidv4(),
            timestamp: Date.now(),
            description,
            entities: new Map(JSON.parse(JSON.stringify(Array.from(this.canonicalWorld.entities)))),
            relationships: new Map(JSON.parse(JSON.stringify(Array.from(this.canonicalWorld.relationships))))
        };
        this.historicalSnapshots.set(snapshot.snapshotId, snapshot);
        return snapshot;
    }

    public restoreSnapshot(snapshotId: string): void {
        const snapshot = this.historicalSnapshots.get(snapshotId);
        if (!snapshot) throw new Error("Snapshot not found");
        this.canonicalWorld.entities = new Map(JSON.parse(JSON.stringify(Array.from(snapshot.entities))));
        this.canonicalWorld.relationships = new Map(JSON.parse(JSON.stringify(Array.from(snapshot.relationships))));
        this.incrementVersion();
    }

    public getSnapshot(snapshotId: string): TemporalSnapshot | undefined {
        return this.historicalSnapshots.get(snapshotId);
    }

    public createSimulationBranch(description: string): SimulationBranch {
        const branch: SimulationBranch = {
            branchId: uuidv4(),
            baseVersion: this.canonicalWorld.version,
            description,
            entities: new Map(JSON.parse(JSON.stringify(Array.from(this.canonicalWorld.entities)))),
            relationships: new Map(JSON.parse(JSON.stringify(Array.from(this.canonicalWorld.relationships)))),
            goals: new Map(JSON.parse(JSON.stringify(Array.from(this.canonicalWorld.goals))))
        };
        this.simulations.set(branch.branchId, branch);
        return branch;
    }

    public getSimulation(branchId: string): SimulationBranch | undefined {
        return this.simulations.get(branchId);
    }
}
