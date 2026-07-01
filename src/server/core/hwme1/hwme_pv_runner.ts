import { HyperMindWorldModelEngine } from "./worldModelManager.js";
import { WorldEntityType, WorldRelationshipType } from "./types.js";

async function runValidation() {
    const hwme = HyperMindWorldModelEngine.getInstance();
    hwme.initialize();
    
    // 1. Create an entity
    const entityId = hwme.entityManager.createEntity({
        type: WorldEntityType.PERSON,
        name: "Test Subject",
        attributes: { age: 30 },
        state: "IDLE",
        temporalState: "PRESENT",
        evidence: ["Observation 1"]
    });
    
    // 2. Create another entity
    const targetId = hwme.entityManager.createEntity({
        type: WorldEntityType.LOCATION,
        name: "Test Lab",
        attributes: {},
        state: "OPEN",
        temporalState: "PRESENT",
        evidence: []
    });

    // 3. Create a relationship
    hwme.relationshipEngine.createRelationship({
        sourceId: entityId,
        targetId: targetId,
        type: WorldRelationshipType.LOCATED_IN,
        weight: 1.0,
        isCausal: false,
        evidence: ["Observation 2"]
    });

    // 4. Create a Goal
    hwme.goalModel.createGoal({
        name: "Complete Validation",
        description: "Run through all tests",
        status: "ACTIVE",
        priority: 10,
        subGoalIds: [],
        constraints: [],
        dependencies: [],
        completionCriteria: []
    });

    // 5. Test Temporal Engine
    const activeEntities = hwme.temporalEngine.getEntitiesActiveAt(Date.now());
    if (activeEntities.length < 2) throw new Error("Temporal Engine failed");

    // 6. Test Spatial Engine
    hwme.spatialEngine.updateEntityLocation(entityId, targetId);
    
    // 7. Test Simulation Engine
    hwme.simulationEngine.runSimulation("Hypothetical test", (branch) => {
        branch.entities.delete(entityId); // Should not affect canonical world
    });
    const canonicalEntity = hwme.entityManager.getEntity(entityId);
    if (!canonicalEntity) throw new Error("Simulation leaked to canonical world");

    // 8. Test Snapshot
    const snapshot = hwme.stateManager.createSnapshot("Baseline");
    hwme.entityManager.deleteEntity(entityId);
    hwme.stateManager.restoreSnapshot(snapshot.snapshotId);
    if (!hwme.entityManager.getEntity(entityId)) throw new Error("Snapshot restore failed");

    console.log("HWME PV-01 Validation Passed.");
}

runValidation().catch(console.error);
