import { CognitiveObservatory, MetricCategory } from "./src/server/core/haces/hco/index.js";

async function runTests() {
    console.log("Running HCO Tests...");

    const hco = new CognitiveObservatory();

    console.log("\n--- Test 1: Record Telemetry ---");
    hco.telemetry.record(MetricCategory.REASONING, "reasoning_latency", 150);
    hco.telemetry.record(MetricCategory.REASONING, "reasoning_latency", 160);
    hco.telemetry.record(MetricCategory.MEMORY, "memory_retrieval_acc", 95);
    console.log(`Recorded ${hco.telemetry.getSamples().length} samples.`);

    console.log("\n--- Test 2: Run Observation Cycle ---");
    hco.runObservationCycle();
    const state = hco.digitalTwin.getState();
    console.log("Health Score:", state.health_profile.overall_health_score);
    console.log("Active Bottlenecks:", state.active_bottlenecks.length);
    console.log("Evolution Readiness Score:", state.evolution_readiness.readiness_score);
    console.log("Is Ready For Evolution:", state.evolution_readiness.is_ready);

    console.log("\n--- Test 3: Query Engine ---");
    const genome = hco.queryEngine.executeQuery("COGNITIVE_GENOME");
    console.log("Cognitive Genome Version:", genome.version);
    console.log("Active Modules in Genome:", genome.active_modules.join(", "));

    console.log("\n--- Test 4: Trend Analysis ---");
    const trend = hco.trendAnalyzer.analyze("reasoning_latency");
    console.log(`Trend Direction: ${trend.direction}, Magnitude: ${trend.magnitude}`);

    console.log("\n--- Test 5: Dashboard Generation ---");
    const dashboard = hco.dashboards.generateDashboard("EEC");
    console.log("Dashboard Target Audience:", dashboard.target_audience);
    console.log("Dashboard Panels:", dashboard.panels.length);

    console.log("\n--- Test 6: Metrics ---");
    console.log("Observability Metrics:", hco.getMetrics());
}

runTests();
