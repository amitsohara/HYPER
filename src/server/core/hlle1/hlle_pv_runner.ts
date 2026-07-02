import { HyperMindEventMesh } from "../hcns01/eventMesh.js";
import { HLLESpecialist } from "./hlleSpecialist.js";
import { CognitiveDomain } from "../hcns01/types.js";

async function runValidation() {
    console.log("Starting HLLE PV-01 Validation...");
    
    const eventMesh = HyperMindEventMesh.getInstance();
    
    // Register events
    eventMesh.registerEventType({ type: "ACTION_COMPLETED", domain: CognitiveDomain.EXECUTION, description: "Action completed" });
    eventMesh.registerEventType({ type: "PLAN_EVALUATED", domain: CognitiveDomain.REASONING, description: "Plan evaluated" });
    eventMesh.registerEventType({ type: "MISSION_COMPLETED", domain: CognitiveDomain.SYSTEM, description: "Mission completed" });
    eventMesh.registerEventType({ type: "LEARNING_ARTIFACT_CREATED", domain: CognitiveDomain.LEARNING, description: "Artifact Created" });
    eventMesh.registerEventType({ type: "KNOWLEDGE_UPDATED", domain: CognitiveDomain.LEARNING, description: "Knowledge Updated" });

    const hlle = new HLLESpecialist(eventMesh);
    await hlle.initialize();

    let artifactCount = 0;
    let updateCount = 0;

    eventMesh.subscribe("LEARNING_ARTIFACT_CREATED", () => { artifactCount++; });
    eventMesh.subscribe("KNOWLEDGE_UPDATED", () => { updateCount++; });

    console.log("Simulating cognitive cycle experiences...");
    await hlle.handleEvent({
        type: "PLAN_EVALUATED",
        domain: CognitiveDomain.REASONING,
        priority: 1,
        source: "HSTE",
        payload: { planId: "P-1" }
    } as any);

    await hlle.handleEvent({
        type: "ACTION_COMPLETED",
        domain: CognitiveDomain.EXECUTION,
        priority: 1,
        source: "HPAE",
        payload: { actionId: "A-1" }
    } as any);

    console.log("Triggering MISSION_COMPLETED...");
    await hlle.handleEvent({
        type: "MISSION_COMPLETED",
        domain: CognitiveDomain.SYSTEM,
        priority: 1,
        source: "HDME",
        payload: { mission: { id: "M-1" } }
    } as any);

    await new Promise(resolve => setTimeout(resolve, 100));

    // We expect 4 artifacts (1 pattern, 1 heuristic, 1 skill, 1 strategy)
    if (artifactCount < 4) {
        throw new Error(`Expected at least 4 artifacts, got ${artifactCount}`);
    }

    // Since mock validation assigns confidence > 0.8 as verified, all 4 should be promoted.
    if (updateCount < 4) {
        throw new Error(`Expected at least 4 updates, got ${updateCount}`);
    }

    console.log("HLLE PV-01 Validation Passed.");
}

runValidation().catch(console.error);
