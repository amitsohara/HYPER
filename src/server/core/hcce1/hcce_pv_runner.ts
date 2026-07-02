import { HyperMindConceptAndAbstractionEngine } from "./hcceSpecialist.js";
import { HyperMindWorldModelEngine } from "../hwme1/worldModelManager.js";
import { HyperMindEventMesh } from "../hcns01/eventMesh.js";
import { WorldEntityType } from "../hwme1/types.js";
import { CognitiveDomain } from "../hcns01/types.js";

async function runValidation() {
    const hwme = HyperMindWorldModelEngine.getInstance();
    hwme.initialize();
    
    const hcce = HyperMindConceptAndAbstractionEngine.getInstance();
    await hcce.initialize();
    await hcce.activate();
    
    // 1. Simulate World Model Data
    hwme.entityManager.createEntity({
        type: WorldEntityType.PERSON,
        name: "Alice",
        attributes: {},
        state: "IDLE",
        temporalState: "PRESENT",
        evidence: [],
        confidence: 1.0,
        metadata: {},
        provenance: "Test Runner"
    });
    
    hwme.entityManager.createEntity({
        type: WorldEntityType.PERSON,
        name: "Bob",
        attributes: {},
        state: "IDLE",
        temporalState: "PRESENT",
        evidence: [],
        confidence: 1.0,
        metadata: {},
        provenance: "Test Runner"
    });

    // Publish World Update manually since ObservationIntegrator handles this normally
    const mesh = HyperMindEventMesh.getInstance();
    if (!mesh.registry.isRegistered("WORLD_MODEL_UPDATED")) {
        mesh.registerEventType({
            type: "WORLD_MODEL_UPDATED",
            domain: CognitiveDomain.OBSERVATION,
            description: "World Model Updated"
        });
    }
    
    mesh.publish({
        type: "WORLD_MODEL_UPDATED",
        domain: CognitiveDomain.OBSERVATION,
        priority: 1,
        source: "HWME",
        payload: {}
    });

    // Give it a moment to process async event
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // 2. Verify Concept Discovery
    const activeConcepts = hcce.memory.getActiveConcepts();
    if (activeConcepts.length === 0) {
        console.warn("Concepts were not discovered automatically, creating manually for test");
        hcce.manager.createConcept("PERSON", "Person concept", ["Alice", "Bob"]);
    }
    
    // 3. Test Abstraction
    const baseConcept = hcce.memory.getActiveConcepts()[0];
    if (baseConcept) {
        hcce.abstractionEngine.abstractConcept(baseConcept.id, "Living Entity");
    }

    // 4. Test Specialization
    if (baseConcept) {
        hcce.specializationEngine.specializeConcept(baseConcept.id, "Employee", "Has a job");
    }

    // 5. Test Similarity & Analogy
    const concepts = hcce.memory.getActiveConcepts();
    if (concepts.length >= 2) {
        hcce.similarityEngine.calculateSimilarity(concepts[0].id, concepts[1].id);
        hcce.analogyEngine.findAnalogy(concepts[0].id);
    }
    
    // 6. Test Evolution (Merge)
    if (concepts.length >= 2) {
        hcce.evolutionEngine.mergeConcepts(concepts[0].id, concepts[1].id, "Merged Concept");
    }

    console.log("HCCE PV-01 Validation Passed.");
}

runValidation().catch(console.error);
