import { HyperMindEventMesh } from "../hcns01/eventMesh.js";
import { HyperMindCognitiveSociety } from "../hcse01/societyManager.js";
import { CognitiveDomain } from "../hcns01/types.js";

import { HPAESpecialist } from "../hpae1/hpaeSpecialist.js";
import { HyperMindWorldModelEngine } from "../hwme1/worldModelManager.js";
import { HyperMindConceptAndAbstractionEngine } from "../hcce1/hcceSpecialist.js";
import { HyperMindExecutiveAttentionEngine } from "../heam1/heamSpecialist.js";
import { HyperMindThoughtGenerationEngine } from "../htge1/htgeSpecialist.js";
import { HyperMindReasoningEngine } from "../hre1/hreSpecialist.js";
import { HPESpecialist } from "../hpe1/hpeSpecialist.js";
import { HSTESpecialist } from "../hste1/hsteSpecialist.js";
import { HDMESpecialist } from "../hdme1/hdmeSpecialist.js";
import { HLLESpecialist } from "../hlle1/hlleSpecialist.js";

async function runTrace() {
    console.log("=========================================");
    console.log("Phase 2 - Mission Pipeline End-to-End Trace");
    console.log("=========================================\n");

    const mesh = HyperMindEventMesh.getInstance();
    const society = HyperMindCognitiveSociety.getInstance();

    // Track events
    const trace: any[] = [];
    mesh.subscribe("*", (event) => {
        trace.push({
            type: event.type,
            source: event.source,
            timestamp: event.timestamp,
            id: event.id
        });
        console.log(`[EVENT] ${event.type} (from ${event.source}) -> id: ${event.id}`);
    });


    const eventsToRegister = [
        "WORLD_OBSERVATION", "WORLD_MODEL_UPDATED", "CONCEPT_DISCOVERED", 
        "ATTENTION_SHIFTED", "THOUGHT_GENERATED", "CONCLUSION_GENERATED",
        "PLAN_CREATED", "SIMULATION_STARTED", "SIMULATION_COMPLETED", "PLAN_EVALUATED", 
        "ACTION_AUTHORIZED", "ACTION_REJECTED", "ACTION_COMPLETED", 
        "MISSION_COMPLETED", "LEARNING_ARTIFACT_CREATED",
        "KNOWLEDGE_UPDATED", "GOAL_CREATED"
    ];
    eventsToRegister.forEach(evt => {
        if (!mesh.registry.isRegistered(evt)) {
            mesh.registerEventType({
                type: evt,
                domain: CognitiveDomain.SYSTEM,
                description: `Event: ${evt}`
            });
        }
    });

    // 1. Instantiate Specialists
    const hpae = new HPAESpecialist(mesh);
    const hwme = HyperMindWorldModelEngine.getInstance(); // No specialist wrapper directly subscribed, wait, hwme1 doesn't have a specialist class extending ISpecialist registered to society in our list, but observationIntegrator listens to it!
    const hcce = HyperMindConceptAndAbstractionEngine.getInstance();
    const heam = HyperMindExecutiveAttentionEngine.getInstance();
    const htge = HyperMindThoughtGenerationEngine.getInstance();
    const hre = HyperMindReasoningEngine.getInstance();
    const hpe = new HPESpecialist();
    const hste = new HSTESpecialist(mesh);
    const hdme = new HDMESpecialist(mesh);
    const hlle = new HLLESpecialist(mesh);

    // Add them to society so they can be managed (hwme doesn't implement ISpecialist directly but that's fine, we initialize it manually)
    await society.registerSpecialist(hpae);
    await society.registerSpecialist(hcce);
    await society.registerSpecialist(heam);
    await society.registerSpecialist(htge);
    await society.registerSpecialist(hre);
    await society.registerSpecialist(hpe);
    await society.registerSpecialist(hste);
    await society.registerSpecialist(hdme);
    await society.registerSpecialist(hlle);
    
    // Register HILA
    const { HILASpecialist } = await import("../hila1/hilaSpecialist.js");
    await society.registerSpecialist(HILASpecialist.getInstance());

    console.log("Registering and initializing all specialists...");
    hwme.initialize(); // Initialize HWME manually
    
        }
    });

    console.log("\n--- STARTING TRACE ---");
    console.log("Publishing initial WORLD_OBSERVATION...");
    
    // Kick off the pipeline
    mesh.publish({
        type: "WORLD_OBSERVATION",
        domain: CognitiveDomain.OBSERVATION,
        priority: 1,
        source: "InputAdapter",
        payload: {
            entity: { name: "Anomalous Signature", type: "THREAT" }
        }
    });

    // Wait for the cascade to finish
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log("\n--- TRACE COMPLETED ---");
    console.log(`Captured ${trace.length} events in the pipeline.`);
    
    const expectedSequence = [
        "WORLD_OBSERVATION",
        "WORLD_MODEL_UPDATED",
        "CONCEPT_DISCOVERED",
        "ATTENTION_SHIFTED",
        "THOUGHT_GENERATED",
        "CONCLUSION_GENERATED",
        "PLAN_CREATED",
        "PLAN_EVALUATED",
        "ACTION_AUTHORIZED",
        "ACTION_COMPLETED",
        "MISSION_COMPLETED"
    ];

    let success = true;
    for (const expected of expectedSequence) {
        if (!trace.find(e => e.type === expected)) {
            console.error(`❌ MISSING EVENT: ${expected}`);
            success = false;
        } else {
            console.log(`✅ FOUND EVENT: ${expected}`);
        }
    }

    if (success) {
        console.log("\n🎯 PIPELINE VALIDATION PASSED! Mission successfully traced end-to-end.");
    } else {
        console.log("\n⚠️ PIPELINE VALIDATION FAILED! Some stages were not reached.");
    }
}

runTrace().catch(console.error);
