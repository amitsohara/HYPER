import { ArchitectureInstitute } from "./src/server/core/haces/hcai/index.js";

async function runTests() {
    console.log("Running HCAI Tests...");

    const hcai = new ArchitectureInstitute();

    console.log("\n--- Test 1: Compile Cognitive Architecture ---");
    const pkg = hcai.compileCognitiveArchitecture(
        "Improve reasoning efficiency",
        "Reduce latency by 20%",
        "CAP-001",
        "EVID-102"
    );

    if (pkg) {
        console.log("Engineering Package Compiled Successfully!");
        console.log("Package ID:", pkg.package_id);
        console.log("Blueprint Status:", pkg.blueprint.status);
        console.log("Interface Specs:", pkg.interface_specifications.length);
    } else {
        console.log("Architecture rejected by review board.");
    }

    console.log("\n--- Test 2: Check Pattern Library ---");
    const patterns = hcai.patterns.getPatterns();
    console.log("Available Patterns:", patterns.length);

    console.log("\n--- Test 3: Metrics ---");
    console.log("HCAI Metrics:", hcai.getMetrics());
}

runTests();
