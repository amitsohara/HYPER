import { ThinkingOrchestrator } from "./src/server/core/hcos/thinking_orchestrator.js";
import { ThinkingCycle } from "./src/server/core/hcos/thinking_cycle.js";
import { SessionStatus } from "./src/server/core/hcos/thinking_types.js";

async function runTests() {
    console.log("Running HCOS Tests...");

    const orchestrator = new ThinkingOrchestrator();

    // Helper to run cognitive loop synchronously for tests
    const runUntilDone = (session: any) => {
        let maxTicks = 100;
        while (session.status === SessionStatus.RUNNING && maxTicks > 0) {
             ThinkingCycle.tick(session);
             maxTicks--;
        }
    }

    // Test 1: Build City on Mars
    console.log("\n--- Test 1: Build City on Mars ---");
    const session1 = orchestrator.createSession("Build City on Mars");
    console.log("Complexity:", session1.analysis.complexity);
    orchestrator.startSession(session1.session_id);
    runUntilDone(session1);
    console.log("Final Status:", session1.status);
    console.log("Final Confidence:", session1.confidence);
    console.log("Checkpoints created:", session1.checkpoints.length);
    console.log("Thoughts executed:", session1.stack.getAll().length);
    
    // Test 2: Simple arithmetic
    console.log("\n--- Test 2: Simple arithmetic ---");
    const session2 = orchestrator.createSession("Simple arithmetic 2+2");
    console.log("Complexity:", session2.analysis.complexity);
    orchestrator.startSession(session2.session_id);
    runUntilDone(session2);
    console.log("Final Status:", session2.status);
    console.log("Final Confidence:", session2.confidence);
    console.log("Iterations used:", session2.budget.current_iterations);

    // Test 3: Interrupt & Resume
    console.log("\n--- Test 3: Interrupt & Resume ---");
    const session3 = orchestrator.createSession("Long running research task");
    orchestrator.startSession(session3.session_id);
    // Tick a few times
    ThinkingCycle.tick(session3);
    ThinkingCycle.tick(session3);
    console.log("Status before pause:", session3.status);
    orchestrator.pauseSession(session3.session_id);
    console.log("Status after pause:", session3.status);
    orchestrator.resumeSession(session3.session_id);
    console.log("Status after resume:", session3.status);
    runUntilDone(session3);

    // Test 4: Multiple competing hypotheses (Branching and Merging)
    console.log("\n--- Test 4: Multiple competing hypotheses ---");
    // We mock the scheduler in this test to trigger branching
    const session4 = orchestrator.createSession("Generate competing hypotheses");
    
    // Setup event listener to verify
    let branchesCreated = 0;
    let mergesDone = 0;
    session4.events.on("BRANCH_CREATED", () => branchesCreated++);
    session4.events.on("THOUGHT_MERGED", () => mergesDone++);
    
    orchestrator.startSession(session4.session_id);
    runUntilDone(session4);
    
    console.log("Branches created:", branchesCreated);
    console.log("Thoughts merged:", mergesDone);
}

runTests();
