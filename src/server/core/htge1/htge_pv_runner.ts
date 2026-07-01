import { HyperMindThoughtGenerationEngine } from "./htgeSpecialist.js";
import { HyperMindCognitiveSociety } from "../hcse01/societyManager.js";
import { HyperMindEventMesh } from "../hcns01/eventMesh.js";
import { ThoughtDependencyType, ThoughtLifecycleState } from "./types.js";

async function runValidation() {
    const society = HyperMindCognitiveSociety.getInstance();
    await society.initializeSociety();

    const htge = HyperMindThoughtGenerationEngine.getInstance();
    await htge.initialize();
    await society.registerSpecialist(htge); 
    
    // 1. Generate Thoughts manually for test
    const t1 = htge.generator.generateFromGoalFocus("goal_alpha", 0.9);
    const t2 = htge.generator.generateFromWorldUpdate("world_x", "Saw something new");
    const t3 = htge.generator.generateFromConceptActivation("concept_y", "Activated via association");

    // 2. Dependency Graph
    htge.dependencyGraph.addDependency(t1.id, t2.id, ThoughtDependencyType.SUPPORTS);
    htge.dependencyGraph.addDependency(t3.id, t2.id, ThoughtDependencyType.CONTRADICTS);

    if (t2.contradictions.length === 0) {
        throw new Error("Contradiction dependency was not tracked bidirectionally");
    }

    // 3. Thought Evolution
    const merged = htge.evolutionEngine.mergeThoughts(t1.id, t3.id, "Merged Summary", "Detailed");
    if (!merged || merged.lifecycleState !== ThoughtLifecycleState.ACTIVE) {
        throw new Error("Thought Merge failed");
    }
    if (t1.lifecycleState !== ThoughtLifecycleState.MERGED) {
        throw new Error("Source thought was not marked as MERGED");
    }

    // 4. Hypotheses
    htge.hypothesisManager.promoteToHypothesis(t2.id);
    htge.hypothesisManager.resolveHypothesis(t2.id, false, "Evidence proved false");
    if (t2.lifecycleState !== ThoughtLifecycleState.REJECTED) {
        throw new Error("Rejected hypothesis should be in REJECTED state");
    }

    // 5. Reflection
    htge.reflectionAdapter.challengeThought(merged.id, "SPEC-001", "Looks wrong");
    if (!merged.metadata.annotations || merged.metadata.annotations.length === 0) {
        throw new Error("Reflection annotation failed");
    }

    // 6. Workspace Eviction
    for (let i = 0; i < 25; i++) {
        htge.generator.generateFromGoalFocus(`dummy_${i}`, 0.1);
    }
    if (htge.workspace.getActiveThoughts().length > 20) {
        throw new Error("Workspace failed to enforce capacity");
    }

    console.log("HTGE PV-01 Validation Passed.");
}

runValidation().catch(console.error);
