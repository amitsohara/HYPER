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
        await hcse.registerSpecialist(new HyperMindExecutiveAttentionEngine());
        await hcse.registerSpecialist(new HyperMindMetaReasoningLayer());
        await hcse.registerSpecialist(new HyperMindReasoningEngine());
        await hcse.registerSpecialist(new HyperMindConceptAndAbstractionEngine());
        await hcse.registerSpecialist(new HPESpecialist());
        await hcse.registerSpecialist(new HyperMindThoughtGenerationEngine());
        await hcse.registerSpecialist(new HPAESpecialist());
        await hcse.registerSpecialist(new HSTESpecialist());
        await hcse.registerSpecialist(new HDMESpecialist());
        await hcse.registerSpecialist(new HLLESpecialist());
        await hcse.registerSpecialist(new HSMESpecialist());
        console.log("All Specialists Registered Successfully.");
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
