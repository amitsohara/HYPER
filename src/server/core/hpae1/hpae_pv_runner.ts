import { HyperMindEventMesh } from "../hcns01/eventMesh.js";
import { HPAESpecialist } from "./hpaeSpecialist.js";
import { CognitiveDomain } from "../hcns01/types.js";

async function runValidation() {
    console.log("Starting HPAE PV-01 Validation...");
    
    const eventMesh = HyperMindEventMesh.getInstance();
    
    // Register events for testing
    eventMesh.registerEventType({ type: "PLAN_EXECUTE", domain: CognitiveDomain.EXECUTION, description: "Execute a plan step" });
    eventMesh.registerEventType({ type: "ACTION_COMPLETED", domain: CognitiveDomain.EXECUTION, description: "Action completed" });
    eventMesh.registerEventType({ type: "ACTION_FAILED", domain: CognitiveDomain.EXECUTION, description: "Action failed" });
    eventMesh.registerEventType({ type: "WORLD_OBSERVATION", domain: CognitiveDomain.EXECUTION, description: "New unified observation" });

    const hpae = new HPAESpecialist(eventMesh);
    await hpae.initialize();

    let eventsReceived = 0;
    eventMesh.subscribe("ACTION_COMPLETED", (event) => {
        console.log("Received ACTION_COMPLETED event");
        eventsReceived++;
    });

    eventMesh.subscribe("WORLD_OBSERVATION", (event) => {
        console.log("Received WORLD_OBSERVATION event");
        eventsReceived++;
    });

    console.log("Triggering PLAN_EXECUTE event...");
    await hpae.handleEvent({
        type: "PLAN_EXECUTE",
        domain: CognitiveDomain.EXECUTION,
        priority: 1,
        source: "TEST",
        payload: {
            planId: "P-TEST",
            skillId: "S-1",
            parameters: { x: 100, y: 200 }
        }
    } as any);

    if (eventsReceived < 2) {
        throw new Error(`Expected at least 2 events, got ${eventsReceived}`);
    }

    console.log("HPAE PV-01 Validation Passed.");
}

runValidation().catch(err => {
    console.error("HPAE PV-01 Validation Failed:", err);
    process.exit(1);
});
