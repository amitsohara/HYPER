import { EvolutionExecutiveController } from "./src/server/core/haces/eec/index.js";

async function runTests() {
    console.log("Running EEC Tests...");

    const eec = new EvolutionExecutiveController();

    console.log("\n--- Test 1: Mission completed with good performance ---");
    const report1 = eec.handleMissionCompleted({ success: true, iterations: 20 });
    console.log("Report:", report1 || "No action taken (as expected)");

    console.log("\n--- Test 2: Mission completed with poor performance (Triggers Evolution) ---");
    const report2 = eec.handleMissionCompleted({ missionId: "MISSION-X", success: true, iterations: 100 });
    console.log("Report:", report2);

    console.log("\n--- Test 3: Processing Queue ---");
    console.log("Queue size before:", eec.priorityManager.getQueue().length);
    eec.processQueue();
    console.log("Queue size after processing 1 item:", eec.priorityManager.getQueue().length);

    console.log("\n--- Test 4: Checking Metrics ---");
    console.log("Metrics:", eec.getMetrics());
}

runTests();
