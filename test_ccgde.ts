import { CognitiveCapabilityGapDiscovery, GapType } from "./src/server/core/haces/ccgde/index.js";

async function runTests() {
    console.log("Running CCGDE Tests...");

    const ccgde = new CognitiveCapabilityGapDiscovery();

    // Setup some initial graph capability
    ccgde.capabilityGraph.addCapability({
        capability_id: "CAP-PLAN-1",
        name: "DFS Planner",
        purpose: "Basic search",
        inputs: [], outputs: [], dependencies: [], supported_domains: [],
        complexity: 10, historical_effectiveness: 60, benchmark_impact: 5,
        owner_division: "Core",
        genome: {
            genome_id: "GEN-1", capability_id: "CAP-PLAN-1", purpose: "Search", problem_solved: "Search", creation_reason: "Initial", dependencies: [], knowledge_requirements: [], algorithms: [], architecture_location: "planner", benchmarks: [], performance_history: [], evolution_history: [], replacement_history: [], retirement_status: "ACTIVE", timestamp: Date.now()
        }
    });

    console.log("\n--- Test 1: Analyze Diagnostics (Knowledge Gap) ---");
    const mockReport1 = {
        causal_graph: { nodes: [{ description: "Missing domain knowledge in Quantum Physics" }] }
    };
    const recs1 = ccgde.analyzeDiagnostics([mockReport1]);
    console.log(`Generated ${recs1.length} recommendations`);
    recs1.forEach(r => console.log("Action Type:", r.action_type, "Score:", r.cedm_result.selected_intervention.score));

    console.log("\n--- Test 2: Analyze Diagnostics (Capability Gap) ---");
    const mockReport2 = {
        causal_graph: { nodes: [{ description: "No planner found for deep reasoning." }] }
    };
    const recs2 = ccgde.analyzeDiagnostics([mockReport2]);
    console.log(`Generated ${recs2.length} recommendations`);
    recs2.forEach(r => console.log("Action Type:", r.action_type, "Score:", r.cedm_result.selected_intervention.score));

    console.log("\n--- Test 3: Metrics ---");
    console.log("CCGDE Metrics:", ccgde.getMetrics());

    console.log("\n--- Test 4: CEDM Decision Logic ---");
    const testGap = { gap_id: "test", type: GapType.ALGORITHM as GapType.ALGORITHM, description: "Slow", severity: 90, detected_at: Date.now(), inefficient_algorithm: "Old" };
    const cedmResult = ccgde.recommendationEngine.evaluateCEDM(testGap);
    console.log("Selected Intervention:", cedmResult.selected_intervention.intervention_type);
    console.log("Scores Evaluation:");
    cedmResult.scores.forEach(s => console.log(` - ${s.intervention_type}: ${s.score} (${s.justification})`));
}

runTests();
