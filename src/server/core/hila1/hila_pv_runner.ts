import { HILASpecialist } from "./hilaSpecialist.js";
import { IntelligenceRequest } from "./types/index.js";
import { v4 as uuidv4 } from "uuid";

async function runValidation() {
    console.log("Starting HILA-01 PV-01 Validation...");

    const hila = HILASpecialist.getInstance();
    await hila.initialize();
    console.log("HILA initialized.");

    const request: IntelligenceRequest = {
        id: uuidv4(),
        missionId: "PV-01",
        domain: "CREATIVE",
        task: "Generate a novel poem about AGI.",
        context: {},
        priority: 5,
        requiredConfidence: 0.9
    };

    console.log("Arbitrating request (low internal confidence)...");
    const decision = await hila.arbitrator.arbitrate(request, 0.2);
    
    if (!decision.useExternal) {
        throw new Error("HILA failed to route to external model when knowledge gap is high and confidence is low.");
    }
    
    console.log(`Arbitration successful: routing to ${decision.selectedProvider}`);

    console.log("Executing external model call...");
    const response = await hila.arbitrator.executeExternal(request, decision);
    if (!response || !response.content) {
        throw new Error("HILA failed to execute external request properly.");
    }
    
    console.log(`External model responded with ${response.content.length} characters.`);
    console.log(`Latency: ${response.latencyMs}ms, Cost: $${response.costEstimate}`);

    console.log("Arbitrating sensorimotor request (strict internal preference)...");
    const smRequest: IntelligenceRequest = {
        id: uuidv4(),
        missionId: "PV-01",
        domain: "SENSORIMOTOR",
        task: "Balance on bike.",
        context: {},
        priority: 10,
        requiredConfidence: 0.5
    };
    
    const smDecision = await hila.arbitrator.arbitrate(smRequest, 0.6);
    if (smDecision.useExternal) {
        throw new Error("HILA incorrectly routed a high-confidence sensorimotor task to an LLM.");
    }
    console.log("Sensorimotor request correctly arbitrated to internal logic.");

    console.log("HILA-01 PV-01 Validation completed successfully.");
}

runValidation().catch(e => {
    console.error("PV-01 Validation Failed:", e);
    process.exit(1);
});
