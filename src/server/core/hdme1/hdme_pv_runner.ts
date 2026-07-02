import { HyperMindEventMesh } from "../hcns01/eventMesh.js";
import { HDMESpecialist } from "./hdmeSpecialist.js";
import { CognitiveDomain } from "../hcns01/types.js";

async function runValidation() {
    console.log("Starting HDME PV-01 Validation...");
    
    const eventMesh = HyperMindEventMesh.getInstance();
    
    // Register events for testing
    eventMesh.registerEventType({ type: "PLAN_EVALUATED", domain: CognitiveDomain.REASONING, description: "Plan evaluated via simulation" });
    eventMesh.registerEventType({ type: "ACTION_AUTHORIZED", domain: CognitiveDomain.SYSTEM, description: "Action authorized" });
    eventMesh.registerEventType({ type: "ACTION_REJECTED", domain: CognitiveDomain.SYSTEM, description: "Action rejected" });
    eventMesh.registerEventType({ type: "MISSION_CREATED", domain: CognitiveDomain.SYSTEM, description: "Mission created" });
    eventMesh.registerEventType({ type: "MISSION_STARTED", domain: CognitiveDomain.SYSTEM, description: "Mission started" });
    eventMesh.registerEventType({ type: "MISSION_COMPLETED", domain: CognitiveDomain.SYSTEM, description: "Mission completed" });

    const hdme = new HDMESpecialist(eventMesh);
    await hdme.initialize();

    let authorizedCount = 0;
    let rejectedCount = 0;

    eventMesh.subscribe("ACTION_AUTHORIZED", () => { authorizedCount++; });
    eventMesh.subscribe("ACTION_REJECTED", () => { rejectedCount++; });

    console.log("Triggering MISSION_CREATED...");
    const mission = hdme.missionManager.createMission("Test Mission", "A test", ["G-1"]);
    
    console.log("Triggering PLAN_EVALUATED (Good Plan)...");
    await hdme.handleEvent({
        type: "PLAN_EVALUATED",
        domain: CognitiveDomain.REASONING,
        priority: 1,
        source: "TEST",
        payload: {
            planId: "P-100",
            outcomes: [{ state: "SUCCESS" }]
        }
    } as any);

    console.log("Triggering PLAN_EVALUATED (Bad Plan)...");
    await hdme.handleEvent({
        type: "PLAN_EVALUATED",
        domain: CognitiveDomain.REASONING,
        priority: 1,
        source: "TEST",
        payload: {
            planId: "P-101",
            outcomes: [{ state: "FAILURE" }, { state: "FAILURE" }, { state: "FAILURE" }, { state: "FAILURE" }, { state: "FAILURE" }] // Will create 100% risk, which is > 90% limit
        }
    } as any);

    await new Promise(resolve => setTimeout(resolve, 100));

    if (authorizedCount !== 1) {
        throw new Error(`Expected 1 authorized action, got ${authorizedCount}`);
    }

    if (rejectedCount !== 1) {
        throw new Error(`Expected 1 rejected action, got ${rejectedCount}`);
    }

    console.log("HDME PV-01 Validation Passed.");
}

runValidation().catch(console.error);
