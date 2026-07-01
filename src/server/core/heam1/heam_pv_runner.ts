import { HyperMindExecutiveAttentionEngine } from "./heamSpecialist.js";
import { HyperMindCognitiveSociety } from "../hcse01/societyManager.js";
import { HyperMindEventMesh } from "../hcns01/eventMesh.js";
import { AttentionFocusMode } from "./types.js";
import { v4 as uuidv4 } from "uuid";

async function runValidation() {
    const society = HyperMindCognitiveSociety.getInstance();
    await society.initializeSociety();

    const heam = HyperMindExecutiveAttentionEngine.getInstance();
    await heam.initialize();
    await society.registerSpecialist(heam); // HEAM is a specialist itself
    
    const mesh = HyperMindEventMesh.getInstance();

    // 1. Test Goal Attention Scoring
    const goalScore = heam.manager.goalAttentionEngine.calculateScore("goal_1", 0.9, 0.8, 0.2);
    heam.manager.registerCandidate({
        id: uuidv4(),
        type: "GOAL",
        referenceId: "goal_1",
        score: goalScore,
        timestamp: Date.now()
    });

    // 2. Test Saliency Engine
    const saliencyScore = heam.manager.saliencyEngine.computeSaliency({
        novelty: 0.8,
        unexpectedness: 0.9,
        importance: 1.0
    });

    // 3. Test Working Memory eviction
    for (let i = 0; i < 15; i++) {
        heam.manager.workingMemory.addGoal(`goal_test_${i}`);
    }
    if (heam.manager.workingMemory.getState().activeGoals.length > 10) {
        throw new Error("Working Memory failed to enforce capacity");
    }

    // 4. Test Attention Shift
    heam.manager.shiftAttention();
    const history = heam.manager.attentionHistory.getLastRecord();
    if (!history) {
        throw new Error("Attention shift was not recorded in history");
    }

    // 5. Test Focus Controller Interruption
    heam.manager.focusController.setMode(AttentionFocusMode.FOCUSED);
    const interrupted = heam.manager.interrupt(50); // Low priority, should not interrupt
    if (interrupted) {
        throw new Error("Focus controller failed to block low priority interruption in FOCUSED mode");
    }
    const highInterrupted = heam.manager.interrupt(90); // High priority, should interrupt
    if (!highInterrupted) {
        throw new Error("Focus controller failed to allow high priority interruption");
    }

    console.log("HEAM PV-01 Validation Passed.");
}

runValidation().catch(console.error);
