import { ResearchInstitute } from "./src/server/core/haces/hcri/index.ts";

async function runTests() {
    console.log("Running HCRI Tests...");

    const hcri = new ResearchInstitute();

    console.log("\n--- Test 1: Ingest Literature ---");
    hcri.literature.ingestDocument("ArXiv:2401.0001", "Transformers can be optimized using tree-search.");
    console.log("Search Result:", hcri.literature.search("tree-search").length > 0 ? "Found" : "Not Found");

    console.log("\n--- Test 2: Evaluate Technology ---");
    const tech = hcri.technologyRadar.evaluateTechnology("Spiking Neural Networks", "Hardware");
    console.log(`Evaluated ${tech.name} with expected impact ${tech.expected_impact}`);

    console.log("\n--- Test 3: Run Scientific Discovery Pipeline (SDP) ---");
    console.log("Starting SDP for objective: 'Improve reasoning depth'");
    const session = hcri.runScientificDiscoveryPipeline("Improve reasoning depth");
    console.log("SDP Session Stage:", session.stage);
    console.log("SDP Conclusion:", session.final_conclusion);
    console.log("SDP Peer Review Feedback:", session.peer_review_feedback);

    console.log("\n--- Test 4: Check Extracted Algorithms & Theories ---");
    console.log("Discovered Algorithms:", hcri.algorithmDiscovery.getCandidates().length);
    console.log("Theories Formulated:", hcri.theories.getTheories().length);

    console.log("\n--- Test 5: Metrics ---");
    console.log("HCRI Metrics:", hcri.getMetrics());
}

runTests();
