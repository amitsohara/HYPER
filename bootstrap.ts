import { HyperMindEventMesh } from "./src/server/core/hcns01/eventMesh.js";
import { HyperMindOS } from "./src/server/core/hos1/index.js";
import { MissionLaboratory } from "./src/server/core/hml1/index.js";
import { RealMissionManager } from "./src/server/core/hml2/index.js";
import { HyperMindCognitiveSociety } from "./src/server/core/hcse01/societyManager.js";
import { HyperMindExecutiveAttentionEngine } from "./src/server/core/heam1/heamSpecialist.js";
import { HyperMindMetaReasoningLayer } from "./src/server/core/hmrl1/hmrlSpecialist.js";
import { HyperMindReasoningEngine } from "./src/server/core/hre1/hreSpecialist.js";
import { HyperMindConceptAndAbstractionEngine } from "./src/server/core/hcce1/hcceSpecialist.js";
import { HPESpecialist } from "./src/server/core/hpe1/hpeSpecialist.js";
import { HyperMindThoughtGenerationEngine } from "./src/server/core/htge1/htgeSpecialist.js";
import { HPAESpecialist } from "./src/server/core/hpae1/hpaeSpecialist.js";
import { HSTESpecialist } from "./src/server/core/hste1/hsteSpecialist.js";
import { HDMESpecialist } from "./src/server/core/hdme1/hdmeSpecialist.js";
import { HLLESpecialist } from "./src/server/core/hlle1/hlleSpecialist.js";
import { HSMESpecialist } from "./src/server/core/hsme1/hsmeSpecialist.js";
import { HILASpecialist } from "./src/server/core/hila1/hilaSpecialist.js";
import { HyperMindWorldModelEngine } from "./src/server/core/hwme1/worldModelManager.js";

export async function initHyperMindPlatform() {
    console.log("=== Booting HyperMind Core Platform ===");
    
    console.log("1. Initializing HCNS (HyperMind Core Event Mesh)...");
    const eventMesh = HyperMindEventMesh.getInstance();
    (global as any).eventMesh = eventMesh;
    
    console.log("2. Initializing HyperMindOS...");
    const hos = new HyperMindOS(eventMesh);
    (global as any).hos = hos;
    await hos.boot();

    console.log("3. Initializing HCSE (HyperMind Cognitive Society Engine)...");
    const hcse = HyperMindCognitiveSociety.getInstance();
    (global as any).hcse = hcse;
    await hcse.initializeSociety();

    console.log("4. Registering Cognitive Specialists...");
    try {
        await hcse.registerSpecialist(HyperMindExecutiveAttentionEngine.getInstance());
        await hcse.registerSpecialist(HyperMindMetaReasoningLayer.getInstance());
        await hcse.registerSpecialist(HyperMindReasoningEngine.getInstance());
        await hcse.registerSpecialist(HyperMindConceptAndAbstractionEngine.getInstance());
        await hcse.registerSpecialist(new HPESpecialist());
        await hcse.registerSpecialist(HyperMindThoughtGenerationEngine.getInstance());
        await hcse.registerSpecialist(new HPAESpecialist(eventMesh));
        await hcse.registerSpecialist(new HSTESpecialist(eventMesh));
        await hcse.registerSpecialist(new HDMESpecialist(eventMesh));
        await hcse.registerSpecialist(new HLLESpecialist(eventMesh));
        await hcse.registerSpecialist(new HSMESpecialist(eventMesh));
        await hcse.registerSpecialist(HILASpecialist.getInstance());
        console.log("All Specialists Registered Successfully.");
        
        console.log("Initializing World Model Engine...");
        HyperMindWorldModelEngine.getInstance().initialize();
    } catch (error) {
        console.warn("Some specialists could not be registered:", error);
    }
    
    console.log("5. Starting Telemetry & Resource Management...");
    hos.telemetryManager.health.reportHealth("SYSTEM_BOOT", true, {});
    
    console.log("6. Initializing Mission Runtime (HML1 & HML2)...");
    const hml1 = new MissionLaboratory(eventMesh, hos);
    const rmv = new RealMissionManager(eventMesh);
    (global as any).hml1 = hml1;
    (global as any).rmv = rmv;

    console.log("=== HyperMind Core Platform Fully Operational ===");
    
    eventMesh.registerEventType({
        type: "HOS_HEARTBEAT",
        domain: "SYSTEM" as any,
        description: "Heartbeat from HOS"
    });
    
    eventMesh.registerEventType({ type: "WORLD_OBSERVATION", domain: "SYSTEM" as any, description: "Raw observation from environment" });
    eventMesh.registerEventType({ type: "WORLD_MODEL_UPDATED", domain: "SYSTEM" as any, description: "World model was updated" });
    eventMesh.registerEventType({ type: "GOAL_CREATED", domain: "SYSTEM" as any, description: "Goal was created" });
    eventMesh.registerEventType({ type: "PLAN_CREATED", domain: "PLANNING" as any, description: "Plan was created" });
    eventMesh.registerEventType({ type: "SIMULATION_STARTED", domain: "REASONING" as any, description: "Simulation started" });
    eventMesh.registerEventType({ type: "SIMULATION_COMPLETED", domain: "REASONING" as any, description: "Simulation completed" });
    eventMesh.registerEventType({ type: "PLAN_EVALUATED", domain: "REASONING" as any, description: "Plan was evaluated" });
    eventMesh.registerEventType({ type: "ACTION_AUTHORIZED", domain: "SYSTEM" as any, description: "Action authorized" });
    eventMesh.registerEventType({ type: "ACTION_REJECTED", domain: "SYSTEM" as any, description: "Action rejected" });
    eventMesh.registerEventType({ type: "ACTION_COMPLETED", domain: "EXECUTION" as any, description: "Action completed" });
    eventMesh.registerEventType({ type: "MISSION_COMPLETED", domain: "SYSTEM" as any, description: "Mission completed" });
    eventMesh.registerEventType({ type: "LEARNING_ARTIFACT_CREATED", domain: "SYSTEM" as any, description: "Learning artifact created" });
    eventMesh.registerEventType({ type: "FEEDBACK_RECEIVED", domain: "SYSTEM" as any, description: "Feedback received" });
    eventMesh.registerEventType({ type: "KNOWLEDGE_UPDATED", domain: "SYSTEM" as any, description: "Knowledge updated" });

    
    // Simulate some active missions and telemetry so UI has real data points
    setInterval(() => {
        // Send heartbeat events
        eventMesh.publish({
            type: "HOS_HEARTBEAT",
            domain: "SYSTEM" as any,
            priority: 1,
            source: "HOS",
            payload: { timestamp: Date.now() }
        });
    }, 5000);
}
