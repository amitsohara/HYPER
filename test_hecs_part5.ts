import { GoogleGenAI } from "@google/genai";
import { ExperienceStore } from "./src/server/core/hecs/experience_store.js";
import { ExperienceTransferEngine } from "./src/server/core/hecs/experience_transfer_engine.js";

process.env.MODEL_MODE = 'dev_stub';
const ai = new GoogleGenAI({ apiKey: "test" });

async function runTests() {
    console.log("Running HECS Part 5 Experience Transfer Tests...");

    // Store a Mars City experience
    ExperienceStore.storeExperience({
        experience_id: "exp_mars",
        mission_id: "m_mars",
        mission: "Build Mars City",
        mission_domain: "Aerospace",
        mission_type: "Engineering",
        mission_complexity: 9,
        timestamp: Date.now(),
        context: {},
        modules_used: [],
        reasoning_summary: "",
        imagined_world_summary: "",
        evidence_summary: [],
        decision_summary: "",
        action_summary: "",
        predicted_outcome: "",
        actual_outcome: "",
        prediction_error: 0,
        confidence: 90,
        uncertainty: 10,
        success_score: 95,
        usefulness_score: 90,
        novelty_score: 80,
        quality_score: 95,
        domain_tags: [],
        lessons: ["Lesson 1"],
        mistakes: [],
        strengths: [],
        weaknesses: [],
        reusable_patterns: ["ISRU", "radiation shielding", "closed-loop life support"],
        transferable_skills: ["Habitat construction"],
        related_experiences: []
    });

    // 1. Mars city -> Lunar colony
    console.log("Testing transfer from Aerospace to Lunar...");
    const transfers1 = await ExperienceTransferEngine.transferExperience(ai, "m_lunar", "Build Lunar Colony", "Aerospace"); // Target domain here could be aerospace, meaning same domain but different context. Wait, the retriever excludes target domain. Let's make target domain 'SpaceSettlement'
    console.log("Transfers to Lunar Colony (expected 0 if same domain, so let's check with different domain):", transfers1.length);
    
    const transfers2 = await ExperienceTransferEngine.transferExperience(ai, "m_lunar2", "Build Lunar Colony", "SpaceSettlement");
    console.log("Transfers to Lunar Colony (SpaceSettlement domain):", transfers2.map(t => t.analogy));

    // 2. Hospital waiting time -> Airport flow
    ExperienceStore.storeExperience({
        experience_id: "exp_hosp",
        mission_id: "m_hosp",
        mission: "Hospital waiting time reduction",
        mission_domain: "Healthcare",
        mission_type: "Process",
        mission_complexity: 7,
        timestamp: Date.now(),
        context: {},
        modules_used: [],
        reasoning_summary: "",
        imagined_world_summary: "",
        evidence_summary: [],
        decision_summary: "",
        action_summary: "",
        predicted_outcome: "",
        actual_outcome: "",
        prediction_error: 0,
        confidence: 80,
        uncertainty: 10,
        success_score: 85,
        usefulness_score: 90,
        novelty_score: 80,
        quality_score: 85,
        domain_tags: [],
        lessons: [],
        mistakes: [],
        strengths: [],
        weaknesses: [],
        reusable_patterns: ["queue management", "process bottleneck logic"],
        transferable_skills: [],
        related_experiences: []
    });
    
    console.log("Testing transfer from Healthcare to Airport...");
    const transfers3 = await ExperienceTransferEngine.transferExperience(ai, "m_airport", "Optimize airport passenger flow", "Transportation");
    console.log("Transfers to Airport (Transportation domain):", transfers3.map(t => t.analogy));

    // We can also see the rejected ones if we look inside the logic, but the output only shows successful ones.
}

runTests();
