const fs = require('fs');
const path = require('path');

const files = {
    './src/server/core/weakness_detector.ts': `import { GoogleGenAI } from "@google/genai";

export async function detectWeaknesses(ai: GoogleGenAI, report: string) {
    const prompt = \`Analyze the following mission report and detect weaknesses such as:
- generic answer
- missing budget
- weak roadmap
- unclear next actions
- unsupported confidence
- wrong mission stage
- poor domain fit
- missing risks
- no strategic decision
- excessive token usage
- irrelevant modules activated

Report:
\${report}

Respond with JSON:
{
  "weaknesses": [
    {
      "weakness_type": "string",
      "severity": "low|medium|high",
      "evidence": "string",
      "likely_cause": "string",
      "recommended_fix": "string"
    }
  ]
}
\`;
    const res = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(res.text || '{"weaknesses":[]}').weaknesses;
}
`,
    './src/server/core/skill_extractor.ts': `import { GoogleGenAI } from "@google/genai";
import { v4 as uuidv4 } from "uuid";

export async function extractSkills(ai: GoogleGenAI, report: string, missionId: string) {
    const prompt = \`Extract reusable skills from this successful mission report.
Examples of skills:
- startup_roadmap_generation
- budget_estimation
- investor_strategy_creation
- risk_mitigation_planning
- research_synthesis
- mission_classification
- token_efficient_routing
- strategic_recommendation_ranking

Report:
\${report}

Respond with JSON:
{
  "skills": [
    {
      "skill_name": "string",
      "domain": "string",
      "description": "string",
      "trigger_conditions": ["string"],
      "steps": ["string"],
      "success_evidence": "string"
    }
  ]
}
\`;
    const res = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    const data = JSON.parse(res.text || '{"skills":[]}');
    return data.skills.map((s: any) => ({
        skill_id: uuidv4(),
        ...s,
        source_mission_ids: [missionId],
        version: 1,
        success_rate: 100
    }));
}
`,
    './src/server/core/strategy_library.ts': `import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'strategies.json');

export interface Strategy {
    id: string;
    name: string;
    domain: string;
    steps: string[];
    version: number;
}

function ensureDb() {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, '[]');
}

export function getStrategies(): Strategy[] {
    ensureDb();
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

export function saveStrategy(strategy: Strategy) {
    const strategies = getStrategies();
    const index = strategies.findIndex(s => s.id === strategy.id);
    if (index >= 0) {
        strategies[index] = strategy;
    } else {
        strategies.push(strategy);
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(strategies, null, 2));
}
`,
    './src/server/core/improvement_generator.ts': `import { GoogleGenAI } from "@google/genai";
import { v4 as uuidv4 } from "uuid";

export async function generateImprovements(ai: GoogleGenAI, weaknesses: any[]) {
    if (!weaknesses || weaknesses.length === 0) return [];
    
    const prompt = \`Based on the following detected weaknesses in recent missions, generate candidate improvements for our Cognitive Architecture.
Types of improvements:
1. Prompt improvement
2. Compiler improvement
3. Router improvement
4. Evaluation rubric improvement
5. Report template improvement
6. Decision criteria improvement
7. Strategy improvement

Weaknesses:
\${JSON.stringify(weaknesses, null, 2)}

Respond with JSON:
{
  "improvements": [
    {
      "target_component": "string",
      "before": "string",
      "after": "string",
      "expected_benefit": "string",
      "risk": "string",
      "test_plan": "string"
    }
  ]
}
\`;
    const res = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    const data = JSON.parse(res.text || '{"improvements":[]}');
    return data.improvements.map((imp: any) => ({
        improvement_id: uuidv4(),
        ...imp
    }));
}
`,
    './src/server/core/benchmark_validator.ts': `import { GoogleGenAI } from "@google/genai";

export async function validateImprovement(ai: GoogleGenAI, improvement: any) {
    // In a real system, we'd run test missions.
    // For now, we simulate benchmark validation using the LLM to review the improvement.
    const prompt = \`Evaluate this proposed improvement against our benchmark criteria.
Require a minimum +5% improvement and no regression greater than 3% in any category.

Improvement:
\${JSON.stringify(improvement, null, 2)}

Respond with JSON:
{
  "accepted": true/false,
  "reason": "string",
  "benchmark_results": {
    "old_strategy_score": number,
    "new_strategy_score": number
  },
  "regression_detected": true/false
}
\`;
    const res = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(res.text || '{"accepted":false, "reason":"validation failed", "benchmark_results":{"old_strategy_score":0, "new_strategy_score":0}, "regression_detected":true}');
}
`,
    './src/server/core/learning_policy.ts': `export function evaluatePolicy(improvement: any, validationResult: any) {
    if (!validationResult.accepted) return false;
    if (validationResult.regression_detected) return false;
    
    // Auto-apply prompt/template/routing
    const autoApplyTypes = ['Prompt improvement', 'Report template improvement', 'Router improvement'];
    if (autoApplyTypes.some(t => improvement.target_component.includes(t))) {
        return true;
    }
    
    // Default to true for now, assuming validation passed
    return true;
}
`,
    './src/server/core/competence_tracker.ts': `import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'competence.json');

export interface CompetenceProfile {
    business_strategy: number;
    research_quality: number;
    planning_quality: number;
    risk_analysis: number;
    budgeting: number;
    technical_reasoning: number;
    social_intelligence: number;
    mission_compilation: number;
    token_efficiency: number;
    benchmark_score: number;
}

function ensureDb() {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify({
        business_strategy: 50,
        research_quality: 50,
        planning_quality: 50,
        risk_analysis: 50,
        budgeting: 50,
        technical_reasoning: 50,
        social_intelligence: 50,
        mission_compilation: 50,
        token_efficiency: 50,
        benchmark_score: 50
    }));
}

export function getCompetence(): CompetenceProfile {
    ensureDb();
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

export function updateCompetence(updates: Partial<CompetenceProfile>) {
    const comp = getCompetence();
    for (const k of Object.keys(updates) as (keyof CompetenceProfile)[]) {
        comp[k] = Math.min(100, Math.max(0, comp[k] + (updates[k] || 0)));
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(comp, null, 2));
    return comp;
}
`,
    './src/server/core/experience_replay.ts': `export async function replayMission(missionId: string) {
    // Placeholder for periodic replay
    return {
        improvement_score: 5,
        new_risks: [],
        regressions: [],
        lessons_learned: ["Replay feature active"]
    };
}
`,
    './src/server/core/autonomous_learning_engine.ts': `import { GoogleGenAI } from "@google/genai";
import { evaluateMission } from "./mission_evaluator";
import { detectWeaknesses } from "./weakness_detector";
import { extractSkills } from "./skill_extractor";
import { generateImprovements } from "./improvement_generator";
import { validateImprovement } from "./benchmark_validator";
import { evaluatePolicy } from "./learning_policy";
import { saveStrategy } from "./strategy_library";
import { updateCompetence } from "./competence_tracker";
import { CognitiveCore } from "./hcc/cognitive_core";
import fs from 'fs';
import path from 'path';

const LEARNING_DB = path.join(process.cwd(), 'data', 'learning_history.json');

function ensureDb() {
    const dir = path.dirname(LEARNING_DB);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(LEARNING_DB)) fs.writeFileSync(LEARNING_DB, '[]');
}

export async function runLearningCycle(ai: GoogleGenAI, missionId: string, missionReport: string, core: CognitiveCore) {
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
`
};

for (const [filepath, content] of Object.entries(files)) {
    fs.writeFileSync(filepath, content);
}
console.log('Files created');
