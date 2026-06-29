import { EngineeringInstitute, HCAIEngineeringPackage } from "./src/server/core/haces/haei/index.js";

async function runTests() {
    console.log("Running HAEI Tests...");

    const haei = new EngineeringInstitute();

    const mockPackage: HCAIEngineeringPackage = {
        package_id: "PKG-001",
        blueprint: {},
        architecture_diagrams: [],
        dependency_graph: {},
        interface_specifications: [],
        event_definitions: [],
        data_models: [],
        state_machines: [],
        sequence_diagrams: [],
        testing_requirements: [],
        verification_requirements: [],
        benchmark_expectations: {},
        rollback_procedures: ["git revert HEAD"],
        timestamp: Date.now()
    };

    console.log("\n--- Test 1: Process Engineering Package ---");
    const rc = haei.processEngineeringPackage(mockPackage);

    if (rc) {
        console.log("Release Candidate Generated Successfully!");
        console.log("RC ID:", rc.rc_id);
        console.log("Implementation Summary:", rc.implementation_summary);
        console.log("Security Vulnerabilities:", rc.security_assessment.vulnerabilities.length);
        console.log("Build Artifacts:", rc.build_artifact.artifacts.length);
    } else {
        console.log("Failed to generate Release Candidate.");
    }

    console.log("\n--- Test 2: Check Digital Twin ---");
    const twin = haei.digitalTwin.getState();
    console.log("Active Projects:", twin.active_projects.length);
    console.log("Test Coverage:", twin.test_coverage + "%");
    console.log("Overall Task Progress:", Object.values(twin.task_progress));

    console.log("\n--- Test 3: Metrics ---");
    console.log("HAEI Metrics:", haei.getMetrics());
}

runTests();
