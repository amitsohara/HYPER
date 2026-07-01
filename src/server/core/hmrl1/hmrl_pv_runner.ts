import { HyperMindMetaReasoningLayer } from "./hmrlSpecialist.js";
import { ReasoningStrategy } from "./types.js";

async function runValidation() {
    const hmrl = HyperMindMetaReasoningLayer.getInstance();
    await hmrl.initialize();

    // 1. Strategy Selection
    const session = hmrl.manager.startSession("prove hypothesis A", "Initial finding", 1);
    if (session.selectedStrategy !== ReasoningStrategy.DEDUCTIVE) {
        throw new Error("Failed to select DEDUCTIVE strategy for 'prove'");
    }

    // 2. Bias Detection & Confidence
    // Only 1 hypothesis but 6 evidence = premature closure bias trigger
    session.activeHypothesisIds.push("hyp_1");
    hmrl.manager.evaluateState(session.id, 6, 0); 
    
    if (session.biasReports.length === 0) {
        throw new Error("Failed to detect premature closure bias");
    }
    if (session.confidence >= 0.8) {
        throw new Error("Confidence should have dropped due to bias");
    }

    // 3. Reflection
    hmrl.manager.runReflection(session.id, false); // goal not met
    if (session.reflections.length === 0) {
        throw new Error("Reflection not generated");
    }
    if (session.selectedStrategy === ReasoningStrategy.DEDUCTIVE) {
        // Since reflection flagged bias and failure, strategy should have changed
        throw new Error("Strategy should have shifted after reflection failure");
    }

    // 4. Trace Replay
    const traces = hmrl.manager.traceEngine.replaySession(session.id);
    if (traces.length < 3) {
        throw new Error("Trace serialization failed to capture state changes");
    }

    console.log("HMRL PV-01 Validation Passed.");
}

runValidation().catch(console.error);
