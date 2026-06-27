import { GoogleGenAI } from "@google/genai";
import { MasterOrchestrator } from "./src/server/core/master_orchestrator.js";
import { MissionCompiler } from "./src/server/core/mission_compiler.js";
import { kgInstance } from "./src/server/knowledge_graph.js";

async function run() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  console.log("Starting test run...");
  const result = await MasterOrchestrator.runMission(
     ai,
     { mission_text: "Explore Mars and build a base", simulation_mode: "realistic", mission_mode: "balanced" },
     kgInstance
  );
  
  const compiled = await MissionCompiler.compile(ai, result);
  console.log("Compiled Mission Type:", compiled.mission_type);
  console.log("Modules Used:", result.modules_used);
  console.log("Modules Skipped:", result.modules_skipped);
  console.log("Learning value:", result.hcc_state_after?.learning?.learning_value);
  console.log("Evidence Length:", result.hcc_state_after?.mission_understanding?.acquired_evidence?.length);
  
  import("fs").then(fs => {
    fs.writeFileSync("test_mission_output.json", JSON.stringify({ compiled, result }, null, 2));
  });
}

run().catch(console.error);
