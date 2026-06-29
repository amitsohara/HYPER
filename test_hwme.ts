import { GoogleGenAI } from "@google/genai";
import { RealityRepresentationCore } from "./src/server/core/hwme/reality_representation_core.js";
import { WorldValidator } from "./src/server/core/hwme/world_validator.js";
import { WorldMetrics } from "./src/server/core/hwme/world_metrics.js";
import { CognitiveWorkspace } from "./src/server/core/hcw/cognitive_workspace.js";
import { WorkspaceStore } from "./src/server/core/hcw/workspace_state.js";

process.env.MODEL_MODE = 'dev_stub';

const ai = new GoogleGenAI({ apiKey: "test" });

async function runTests() {
    console.log("Running HWME Tests...");

    // Test 1: Mission Parsing
    const mission1 = "Build a city on Mars";
    console.log(`\nTesting Mission: "${mission1}"`);
    const world1 = await RealityRepresentationCore.parseMission(ai, mission1);
    
    console.log(`World 1 Metrics:`, WorldMetrics.getMetrics(world1));
    const validation1 = WorldValidator.validate(world1);
    console.log(`World 1 Validation:`, validation1);
    
    // Validate entities
    console.log("Entities:", Array.from(world1.entities.values()).map(e => e.name).join(", "));
    console.log("Constraints:", Array.from(world1.constraints.values()).map(c => c.name).join(", "));
    
    // Link to HCW
    const wsId = CognitiveWorkspace.createWorkspace(mission1);
    const ws = WorkspaceStore.getWorkspace(wsId);
    if (ws) {
        ws.world_model = { real_world: world1, imagined_world: undefined };
        console.log("World Model attached to Workspace", wsId);
    }
    
    // Test 2: Hospital Mission
    const mission2 = "Improve hospital emergency department.";
    console.log(`\nTesting Mission: "${mission2}"`);
    const world2 = await RealityRepresentationCore.parseMission(ai, mission2);
    console.log(`World 2 Metrics:`, WorldMetrics.getMetrics(world2));
    console.log("Entities:", Array.from(world2.entities.values()).map(e => e.name).join(", "));
    
    // Test 3: Startup Mission
    const mission3 = "Launch AI startup.";
    console.log(`\nTesting Mission: "${mission3}"`);
    const world3 = await RealityRepresentationCore.parseMission(ai, mission3);
    console.log(`World 3 Metrics:`, WorldMetrics.getMetrics(world3));
    console.log("Entities:", Array.from(world3.entities.values()).map(e => e.name).join(", "));
}

runTests();
