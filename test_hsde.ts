import { SimulationEngine } from "./src/server/core/hsde/simulation_engine.js";
import { SimulationComparator } from "./src/server/core/hsde/simulation_comparator.js";

async function runTests() {
    console.log("Running HSDE Tests...");

    const engine = new SimulationEngine();

    // Test 1: Mars City
    console.log("\n--- Test 1: Mars City ---");
    const branches1 = engine.simulate("Build a Mars City", {});
    console.log(`Generated ${branches1.length} simulation branches.`);
    const bestStrategies1 = engine.getRankedStrategies();
    if (bestStrategies1.length > 0) {
        console.log(`Best strategy (Score): Branch ${bestStrategies1[0].branch_id}`);
    }
    const discoveries1 = engine.getDiscoveries();
    console.log(`Discoveries: ${discoveries1.length}`);

    // Test 2: Hospital Emergency Department
    console.log("\n--- Test 2: Optimize hospital emergency department ---");
    const branches2 = engine.simulate("Optimize hospital emergency department", {});
    console.log(`Generated ${branches2.length} alternative operational strategies.`);
    
    // Compare
    if (branches2.length > 1) {
         const comparison = SimulationComparator.compare(branches2[0], branches2[1]);
         console.log(`Compared Branch ${branches2[0].branch_id} vs ${branches2[1].branch_id}`);
         console.log(`Winner: ${comparison.winner} (Delta: ${comparison.delta})`);
    }

    // Test 3: Renewable Energy System
    console.log("\n--- Test 3: Design a renewable energy system ---");
    const branches3 = engine.simulate("Design a renewable energy system", {});
    console.log(`Generated ${branches3.length} architectures.`);
    const bestStrategies3 = engine.getRankedStrategies();
    console.log(`Best architecture: ${bestStrategies3[0]?.branch_id}`);

    // Test 4: Impossible Simulation
    console.log("\n--- Test 4: Impossible simulation ---");
    const branches4 = engine.simulate("Impossible mission", { impossible: true });
    console.log(`Generated ${branches4.length} branches. Status: ${branches4[0]?.status}`);
}

runTests();
