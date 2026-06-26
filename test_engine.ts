import { runLearningCycle } from "./src/server/core/autonomous_learning_engine.ts";
import { HyperMindCognitiveCore } from "./src/server/core/hcc/cognitive_core.ts";
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

async function test() {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "dummy" });
    const core = new HyperMindCognitiveCore("manual_run");
    const summary = await runLearningCycle(ai, "test_mission_001", "Create a new startup with AI. The startup uses AI to do cool things.", core);
    console.log(summary);
}

test().catch(console.error);
