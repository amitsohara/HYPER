import { GoogleGenAI } from "@google/genai";
import { evaluateMission } from "./mission_evaluator";
import { detectWeaknesses } from "./weakness_detector";
import { extractSkills } from "./skill_extractor";
import { generateImprovements } from "./improvement_generator";
import { validateImprovement } from "./benchmark_validator";
import { evaluatePolicy } from "./learning_policy";
import { saveStrategy } from "./strategy_library";
import { updateCompetence } from "./competence_tracker.js";
import { HyperMindCognitiveCore } from "./hcc/cognitive_core.js";
import fs from 'fs';
import path from 'path';

const LEARNING_DB = path.join(process.cwd(), 'data', 'learning_history.json');

function ensureDb() {
    const dir = path.dirname(LEARNING_DB);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(LEARNING_DB)) fs.writeFileSync(LEARNING_DB, '[]');
}

export async function runLearningCycle(ai: GoogleGenAI, missionId: string, missionReport: string, core: HyperMindCognitiveCore) {
    const evaluation = await evaluateMission(ai, missionReport);
    const weaknesses = await detectWeaknesses(ai, missionReport);
    const skills = await extractSkills(ai, missionReport, missionId);
    
    let improvements = [];
    if (weaknesses.length > 0) {
        improvements = await generateImprovements(ai, weaknesses);
    }

    const accepted_improvements = [];
    const rejected_improvements = [];

    for (const imp of improvements) {
        const val = await validateImprovement(ai, imp);
        if (evaluatePolicy(imp, val)) {
            accepted_improvements.push({ improvement: imp, validation: val });
            // Save to strategy library if it's a strategy
            if (imp.target_component.includes('Strategy')) {
                saveStrategy({
                    id: imp.improvement_id,
                    name: 'Improved Strategy ' + imp.improvement_id,
                    domain: 'General',
                    steps: [imp.after],
                    version: 1
                });
            }
        } else {
            rejected_improvements.push({ improvement: imp, reason: val.reason });
        }
    }

    const competence_changes = {};
    if (accepted_improvements.length > 0) {
        Object.assign(competence_changes, { benchmark_score: 2, mission_compilation: 1 });
        updateCompetence(competence_changes);
    } else if (weaknesses.length > 0) {
        Object.assign(competence_changes, { benchmark_score: -1 });
        updateCompetence(competence_changes);
    }

    const summary = {
        mission_id: missionId,
        timestamp: Date.now(),
        mission_score: evaluation.score,
        weaknesses_detected: weaknesses,
        skills_extracted: skills,
        improvements_generated: improvements,
        improvements_accepted: accepted_improvements,
        improvements_rejected: rejected_improvements,
        competence_changes,
        next_learning_focus: weaknesses.length > 0 ? weaknesses[0].weakness_type : 'Consolidate skills'
    };

    ensureDb();
    const history = JSON.parse(fs.readFileSync(LEARNING_DB, 'utf8'));
    history.push(summary);
    fs.writeFileSync(LEARNING_DB, JSON.stringify(history, null, 2));

    core.publishEvent("LEARNING_CYCLE_COMPLETED", summary, "AutonomousLearningEngine");

    return summary;
}
