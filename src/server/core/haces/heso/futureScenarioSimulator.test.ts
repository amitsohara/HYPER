import { FutureScenarioSimulator } from "./futureScenarioSimulator.js";
import { FutureScenario } from "./strategyTypes.js";

// Mocking the GoogleGenAI client
class MockGenAI {
    // mock implementation
}

async function testScenarioSimulation() {
    console.log("Starting FutureScenarioSimulator Test...");
    const simulator = new FutureScenarioSimulator();
    
    // Mock system context and HEM
    const mockContext = {
        current_capability_level: 0.75,
        recent_bottleneck: "Reasoning limit"
    };

    const mockHem = {
        ikb: {
            getAllLessons: () => [
                { description: "Aggressive growth leads to instability", context: "Evolution Cycle 10" },
                { description: "Incremental capability gains compound effectively", context: "Evolution Cycle 15" }
            ],
            getAllArtifacts: () => [
                { content: "Architecture draft for distributed reasoning", rationale: "To bypass single-thread limits" }
            ]
        }
    };

    // Normally we would pass an actual AI instance, but since generateWithRetry connects directly,
    // we would ideally mock generateWithRetry or just test the fallback if ai is null and API key is missing.
    // For a real integration test, we use a mock AI object.
    
    const ai = new MockGenAI() as any;
    
    const scenarios = await simulator.simulateScenarios(ai, mockContext, mockHem);
    
    console.log("Generated Scenarios:");
    console.log(JSON.stringify(scenarios, null, 2));

    if (scenarios.length > 0 && scenarios[0].scenario_id) {
        console.log("✅ FutureScenarioSimulator test passed.");
    } else {
        console.error("❌ FutureScenarioSimulator test failed.");
    }
}

// In a real testing environment (like Jest/Mocha), this would be executed via a runner.
// For now, exporting to allow execution.
export { testScenarioSimulation };
