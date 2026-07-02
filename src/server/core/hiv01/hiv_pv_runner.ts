import { HyperMindEventMesh } from "../hcns01/eventMesh.js";
import { IntegrationValidationManager } from "./index.js";

async function runValidation() {
    console.log("Starting HIV PV-01 Validation...");
    
    const eventMesh = HyperMindEventMesh.getInstance();
    const hiv = new IntegrationValidationManager(eventMesh);

    // Run the Grand Challenge
    const cert = await hiv.runGrandChallenge();

    if (cert.level === "NONE") {
        throw new Error("Grand Challenge Failed to achieve certification.");
    }

    console.log("HIV PV-01 Validation Passed.");
}

runValidation().catch(console.error);
