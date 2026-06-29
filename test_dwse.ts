import { DynamicWorldStateEngine } from "./src/server/core/hwme/dynamic/dynamic_world_state_engine.js";
import { StateVariableType } from "./src/server/core/hwme/dynamic/state_variable.js";
import { StateUpdate } from "./src/server/core/hwme/dynamic/state_update.js";

async function runTests() {
    console.log("Running DWSE Tests...");

    // Test 1: Mission Build Mars City
    console.log("\n--- Test 1: Mission Build Mars City ---");
    const marsWorld = DynamicWorldStateEngine.createWorld("mars_city_1");
    marsWorld.initVariable("population", "Population", StateVariableType.NUMERIC, 0);
    marsWorld.initVariable("energy", "Energy", StateVariableType.NUMERIC, 0);
    marsWorld.initVariable("food", "Food", StateVariableType.NUMERIC, 0);
    marsWorld.initVariable("water", "Water", StateVariableType.NUMERIC, 0);
    marsWorld.initVariable("habitats", "Habitats", StateVariableType.NUMERIC, 0);

    // Initial state
    console.log("Initial state:", marsWorld.getState().variables);
    
    // Action: Construct Habitat
    marsWorld.applyUpdate({
        timestamp: Date.now(),
        source: "MissionAction",
        reason: "Construct Habitat",
        changes: { habitats: 1, energy: -50 } // oops wait, energy starts at 0, this should fail if validator checks energy. But our validator specifically checks water/energy? Ah let's give them some first
    });
    // Wait, let's just supply them first
    marsWorld.applyUpdate({
        timestamp: Date.now(),
        source: "Supply Drop",
        reason: "Initial supplies",
        changes: { energy: 1000, food: 1000, water: 1000 }
    });
    marsWorld.applyUpdate({
        timestamp: Date.now(),
        source: "MissionAction",
        reason: "Construct Habitat",
        changes: { habitats: 1, energy: 950 }
    });
    
    // Action: Colonists arrive
    marsWorld.applyUpdate({
        timestamp: Date.now(),
        source: "Arrival Event",
        reason: "Ship landed",
        changes: { population: 50, food: 950, water: 950 }
    });
    
    console.log("Evolved state:", marsWorld.getState().variables);
    console.log("Snapshots created:", marsWorld.history.snapshots.length);
    console.log("Timeline events:", marsWorld.history.getTimeline().length);

    // Test 2: Hospital Emergency
    console.log("\n--- Test 2: Hospital Emergency ---");
    const hospitalWorld = DynamicWorldStateEngine.createWorld("hospital_1");
    hospitalWorld.initVariable("patients", "Patients", StateVariableType.NUMERIC, 0);
    hospitalWorld.initVariable("beds", "Available Beds", StateVariableType.NUMERIC, 100);
    hospitalWorld.initVariable("resources", "Medical Supplies", StateVariableType.NUMERIC, 500);
    
    hospitalWorld.applyUpdate({
        timestamp: Date.now(),
        source: "Event",
        reason: "Bus crash",
        changes: { patients: 20, beds: 80, resources: 400 }
    });
    
    console.log("Hospital State:", hospitalWorld.getState().variables);
    console.log("History maintained, transitions:", hospitalWorld.history.transitions.length);
    
    // Test 3: Rollback
    console.log("\n--- Test 3: Rollback ---");
    // Snapshot we want to rollback to is before colonists arrived in marsWorld
    const snapshotToRestore = marsWorld.history.snapshots[1]; // 0 is supply drop, 1 is habitat
    console.log("Rolling back to:", snapshotToRestore.reason);
    marsWorld.rollback(snapshotToRestore.snapshot_id);
    console.log("Restored state:", marsWorld.getState().variables);

    // Test 4: Impossible State
    console.log("\n--- Test 4: Impossible State ---");
    const result = marsWorld.applyUpdate({
        timestamp: Date.now(),
        source: "Accident",
        reason: "Disaster",
        changes: { population: -10 }
    });
    console.log("Validator result:", result);
    console.log("State unchanged?", marsWorld.getState().variables.population !== -10);
}

runTests();
