import { SelfEvolutionEngine } from "./src/server/core/hsee/self_evolution_engine.js";

async function runTests() {
    console.log("Running HSEE Tests...");

    const engine = new SelfEvolutionEngine();

    // Test 1: Replay previous missions
    console.log("\n--- Test 1: Replay 100 previous missions ---");
    const mockMissions = Array(100).fill({ success: true, iterations: 60, branches: 25 });
    const generatedPolicies1 = engine.evaluateMissions(mockMissions);
    console.log(`Evaluated 100 missions. Generated ${generatedPolicies1.length} policy updates.`);
    const deployed = engine.getDeployedPolicies();
    console.log(`Deployed policies: ${deployed.length}`);

    // Test 2: Candidate policy reduces accuracy
    console.log("\n--- Test 2: Candidate policy reduces accuracy ---");
    const generatedPolicies2 = engine.evaluateMissions([{ test_case: "reduce accuracy" }]);
    const rejected = generatedPolicies2.filter(p => p.status === "REJECTED");
    console.log(`Generated ${generatedPolicies2.length} policies. Rejected: ${rejected.length}`);

    // Test 3: Candidate policy improves efficiency without reducing quality
    console.log("\n--- Test 3: Improve efficiency ---");
    const generatedPolicies3 = engine.evaluateMissions([{ test_case: "improve efficiency" }]);
    const approved = generatedPolicies3.filter(p => p.status === "DEPLOYED");
    console.log(`Generated ${generatedPolicies3.length} policies. Deployed: ${approved.length}`);

    // Test 4: New policy causes regression, automatic rollback
    console.log("\n--- Test 4: Regression and Rollback ---");
    // Manually force a deployment and then roll it back to simulate the process
    const generatedPolicies4 = engine.evaluateMissions([{ test_case: "regression" }]);
    if (generatedPolicies4.length > 0 && generatedPolicies4[0].status === "REJECTED") {
        console.log(`Regression caught by validator. Status: ${generatedPolicies4[0].status}`);
    } else if (generatedPolicies4.length > 0 && generatedPolicies4[0].status === "DEPLOYED") {
        console.log(`Regression deployed! Rolling back...`);
        engine.rollback(generatedPolicies4[0].policy_id);
        console.log(`Status after rollback: ${generatedPolicies4[0].status}`);
    }
}

runTests();
