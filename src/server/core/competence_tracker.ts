import fs from 'fs';
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
    try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); } catch(e) { return {} as any; }
}

export function updateCompetence(updates: Partial<CompetenceProfile>) {
    const comp = getCompetence();
    for (const k of Object.keys(updates) as (keyof CompetenceProfile)[]) {
        comp[k] = Math.min(100, Math.max(0, comp[k] + (updates[k] || 0)));
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(comp, null, 2));
    return comp;
}
