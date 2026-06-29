import { CognitiveDiagnosisEngine, DiagnosticEvidence } from "./src/server/core/haces/hcde/index.js";

async function runTests() {
    console.log("Running HCDE Tests...");

    const hcde = new CognitiveDiagnosisEngine();

    const mockEvidence: DiagnosticEvidence[] = [
        { evidence_id: "E1", source: "HCO", description: "Latency spiked in planning.", timestamp: Date.now() }
    ];

    console.log("\n--- Test 1: Diagnose Failure ---");
    const report1 = hcde.diagnoseMission({ mission_id: "M1", success: false }, mockEvidence);
    console.log("Diagnosis Type:", report1.type);
    console.log("Root Cause Layer:", report1.causal_graph?.nodes.find(n => n.node_id === report1.causal_graph?.edges[0]?.source_id)?.layer);
    console.log("Autopsy Generated:", !!report1.autopsy);
    console.log("Recommendations Generated:", report1.recommendations.length);

    console.log("\n--- Test 2: Diagnose Success ---");
    const report2 = hcde.diagnoseMission({ mission_id: "M2", success: true, criticality: 90 }, mockEvidence);
    console.log("Diagnosis Type:", report2.type);
    console.log("Autopsy Generated (Due to high criticality):", !!report2.autopsy);
    
    console.log("\n--- Test 3: Systemic Patterns ---");
    const patterns = hcde.patternAnalyzer.getPatterns();
    console.log("Systemic Patterns Detected:", patterns.length);

    console.log("\n--- Test 4: Metrics ---");
    console.log("Diagnostic Metrics:", hcde.getMetrics());
}

runTests();
