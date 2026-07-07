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

export async function initSociety() {
    const mesh = HyperMindEventMesh.getInstance();
    const society = HyperMindCognitiveSociety.getInstance();

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

    const hpae = new HPAESpecialist(mesh);
    const hwme = HyperMindWorldModelEngine.getInstance(); 
    const hcce = HyperMindConceptAndAbstractionEngine.getInstance();
    const heam = HyperMindExecutiveAttentionEngine.getInstance();
    const htge = HyperMindThoughtGenerationEngine.getInstance();
    const hre = HyperMindReasoningEngine.getInstance();
    const hpe = new HPESpecialist();
    const hste = new HSTESpecialist(mesh);
    const hdme = new HDMESpecialist(mesh);
    const hlle = new HLLESpecialist(mesh);

    await society.registerSpecialist(hpae);
    await society.registerSpecialist(hcce);
    await society.registerSpecialist(heam);
    await society.registerSpecialist(htge);
    await society.registerSpecialist(hre);
    await society.registerSpecialist(hpe);
    await society.registerSpecialist(hste);
    await society.registerSpecialist(hdme);
    await society.registerSpecialist(hlle);
    
    const { HILASpecialist } = await import("../hila1/hilaSpecialist.js");
    await society.registerSpecialist(HILASpecialist.getInstance());

    hwme.initialize(); 

    console.log("HyperMind Society Initialized");
}
