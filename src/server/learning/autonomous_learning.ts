import { GoogleGenAI } from '@google/genai';
import { generateWithRetry, cleanJSON } from '../engines.js';

export interface LearningState {
    skill_library: any[];
    learning_progress: any[];
    replayed_missions: any[];
    evaluations: any[];
}

const defaultState: LearningState = {
    skill_library: [
        { 
            id: "sk1", 
            name: "Data Synthesis", 
            description: "Combine multiple sources into a coherent summary", 
            domain: "Data Analysis",
            use_case: "Aggregating multiple search results",
            success_rate: 0.85, 
            evidence: "Successfully used in 15 past missions",
            procedure: ["Identify key themes", "Group data", "Draft summary"],
            version: 1,
            related_missions: ["mission_x", "mission_y"]
        }
    ],
    learning_progress: [
        { date: new Date().toISOString(), improvement: "+15%", area: "Context Analysis" }
    ],
    replayed_missions: [],
    evaluations: []
};

let memState = { ...defaultState };

export class AutonomousLearningEngine {
    static async getState() {
        return memState;
    }

    static async getSkills() {
        return memState.skill_library;
    }
    
    static async getProgress() {
        return memState.learning_progress;
    }

    static async extractSkill(ai: GoogleGenAI, missionData: any) {
        const prompt = `You are the Skill Extractor Engine. Analyze this mission: ${JSON.stringify(missionData.mission_text)}
Identify reasoning patterns, successful strategies, and reusable concepts to form a new skill.
Return JSON:
{
  "skill_name": "Name of the skill",
  "skill_description": "What it does",
  "domain": "e.g., Logical Reasoning, File I/O",
  "use_case": "When to apply it",
  "procedure": ["Step 1", "Step 2"],
  "evidence": "Why it works based on this mission"
}`;
        try {
            const res = await generateWithRetry(ai, {
                model: 'gemini-1.5-flash',
                contents: prompt,
                bypassBudget: true,
                config: { responseMimeType: "application/json" }
            }, 3);
            const data = await cleanJSON(res?.text || "{}", ai);
            
            const skill = {
                id: "sk_" + Math.random().toString(36).substring(7),
                name: data.skill_name || "Unknown Skill",
                description: data.skill_description || "",
                domain: data.domain || "General",
                use_case: data.use_case || "Unknown",
                procedure: data.procedure || [],
                success_rate: 0.5,
                evidence: data.evidence || "Extracted from mission.",
                version: 1,
                related_missions: [missionData.id || "unknown"]
            };
            memState.skill_library.unshift(skill);
            return skill;
        } catch(e) {
            return null;
        }
    }
    
    static async evaluateMission(ai: GoogleGenAI, missionData: any) {
        const prompt = `You are the Self Evaluator Engine. Evaluate the outcome of this mission.
Original Mission: ${JSON.stringify(missionData.mission)}
Mission Outcome / Report: ${JSON.stringify(missionData.mission_text)}

Provide scores from 0-100 for various metrics based on how well the outcome achieved the mission and its quality.
Return JSON:
{
  "reasoning_quality": 85,
  "novelty": 60,
  "usefulness": 90,
  "factual_confidence": 95,
  "planning_quality": 80,
  "risk_awareness": 70,
  "learning_value": 75,
  "key_takeaways": ["Identify specific actionable lesson learned 1", "Lesson 2"],
  "justification": "Overall solid execution."
}`;
        try {
            const res = await generateWithRetry(ai, {
                model: 'gemini-1.5-flash',
                contents: prompt,
                bypassBudget: true,
                config: { responseMimeType: "application/json" }
            }, 3);
            const data = await cleanJSON(res?.text || "{}", ai);
            
            const evalResult = {
                mission_id: missionData.id,
                reasoning_quality: data.reasoning_quality || 0,
                novelty: data.novelty || 0,
                usefulness: data.usefulness || 0,
                factual_confidence: data.factual_confidence || 0,
                planning_quality: data.planning_quality || 0,
                risk_awareness: data.risk_awareness || 0,
                learning_value: data.learning_value || 0,
                justification: data.justification || "Evaluated.",
                ...data,
                timestamp: new Date().toISOString()
            };
            memState.evaluations.unshift(evalResult);
            return evalResult;
        } catch(e) {
            console.error("evaluateMission error:", e);
            return {
                mission_id: missionData.id,
                reasoning_quality: 0,
                novelty: 0,
                usefulness: 0,
                factual_confidence: 0,
                planning_quality: 0,
                risk_awareness: 0,
                learning_value: 0,
                justification: "Error in evaluation.",
                timestamp: new Date().toISOString()
            };
        }
    }

    static async replayMission(missionId: string) {
        // Simulated Replay Logic
        const intelligenceGain = Math.floor(Math.random() * 20) + 5;
        const replay = {
            mission_id: missionId,
            timestamp: new Date().toISOString(),
            old_score: 75,
            new_score: 75 + intelligenceGain,
            intelligence_gain: intelligenceGain,
            insights_gained: ["Refined prompt generation", "Eliminated redundant loops"]
        };
        memState.replayed_missions.unshift(replay);
        
        memState.learning_progress.unshift({
            date: new Date().toISOString(),
            improvement: "+" + intelligenceGain + "%",
            area: "Efficiency"
        });
        return replay;
    }
}
