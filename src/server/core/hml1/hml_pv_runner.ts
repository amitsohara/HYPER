import { HyperMindEventMesh } from "../hcns01/eventMesh.js";
import { HyperMindOS } from "../hos1/index.js";
import { MissionLaboratory } from "./index.js";

async function runValidation() {
    console.log("Starting HML PV-01 Validation...");

    const eventMesh = HyperMindEventMesh.getInstance();
    const hos = new HyperMindOS(eventMesh);
    
    // Boot HOS first since HML relies on it for execution
    await hos.boot();

    const hml = new MissionLaboratory(eventMesh, hos);
    
    const hii = await hml.runGrandChallenge("1.0.0");

    if (hii.certificationLevel === "NONE") {
        throw new Error("HML PV-01 Validation Failed: HII Certification Level is NONE.");
    }

    if (hii.overallIntelligence <= 0) {
        throw new Error("HML PV-01 Validation Failed: Overall Intelligence score is zero.");
    }

    await hos.shutdown();
    console.log("HML PV-01 Validation Passed.");
}

runValidation().catch(console.error);
