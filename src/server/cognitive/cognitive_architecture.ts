import { GoogleGenAI } from '@google/genai';
import { generateWithRetry, cleanJSON } from '../engines.js';

export interface CognitiveState {
    current_mission: string | null;
    beliefs: any[];
    goals: any[];
    plans: any[];
    reasoning_chains: any[];
    uncertainty_level: number;
    confidence_level: number;
    knowledge_gaps: string[];
    reasoning_summary: string;
}

const defaultState: CognitiveState = {
    current_mission: null,
    beliefs: [
        { 
            id: "b1", 
            belief: "Multi-agent debate improves decision accuracy by surfacing contradictions early.", 
            confidence: 0.85, 
            evidence: ["Mission 102 debate reduced error rate by 40%."],
            contradicting_evidence: ["Debate on Mission 99 caused decision paralysis."],
            last_updated: new Date().toISOString(),
            version: 1,
            source_missions: ["mission_102", "mission_99"]
        }
    ],
    goals: [],
    plans: [],
    reasoning_chains: [],
    uncertainty_level: 0.3,
    confidence_level: 0.7,
    knowledge_gaps: [],
    reasoning_summary: "System is in a stable state. Awaiting next mission objective."
};

let memState = { ...defaultState };

export class CognitiveArchitecture {
    static async getState() {
        return memState;
    }

    static async updateStateFromMission(ai: GoogleGenAI, missionData: any) {
        memState.current_mission = missionData.mission_text || missionData.id;
        memState.uncertainty_level = Math.random() * 0.4 + 0.1; // Simulated dynamic uncertainty
        memState.confidence_level = 1.0 - memState.uncertainty_level;
        memState.reasoning_summary = "Processing new mission. Formulating goals and checking existing beliefs against new context.";
    }

    static async generateGoalsFromGaps(ai: GoogleGenAI, knowledgeGaps: string[]) {
        memState.knowledge_gaps = knowledgeGaps;
        
        const prompt = `You are the Goal Generator Engine. Based on these knowledge gaps: ${JSON.stringify(knowledgeGaps)}, generate a primary goal and subgoals.
Return JSON:
{
  "primary_goal": "The main objective to resolve these gaps",
  "subgoals": ["Subgoal 1", "Subgoal 2"],
  "hidden_assumptions": ["Assumption 1"],
  "missing_knowledge": ["Knowledge 1"],
  "risk_factors": ["Risk 1"],
  "success_criteria": ["Criteria 1"]
}`;
        try {
            const res = await generateWithRetry(ai, {
                model: 'gemini-3.1-flash-lite',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            }, 3);
            const data = await cleanJSON(res?.text || "{}", ai);
            
            const newGoal = {
                id: "g_" + Math.random().toString(36).substring(7),
                type: "autonomous_exploration",
                description: data.primary_goal || `Resolve gaps`,
                subgoals: data.subgoals || [],
                assumptions: data.hidden_assumptions || [],
                missing_knowledge: data.missing_knowledge || [],
                risk_factors: data.risk_factors || [],
                success_criteria: data.success_criteria || [],
                priority: "high",
                status: "pending",
                created_at: new Date().toISOString()
            };
            memState.goals.unshift(newGoal);
            return newGoal;
        } catch(e) {
            return null;
        }
    }

    static async planMultiStepTask(ai: GoogleGenAI, goal: any) {
        const prompt = `You are the Long-Term Planner. Given the goal: "${goal.description}", generate a multi-step plan.
Return JSON:
{
  "short_term_steps": [{"action": "Action 1", "expected_output": "Output 1"}],
  "medium_term_steps": [{"action": "Action 2", "expected_output": "Output 2"}],
  "long_term_steps": [{"action": "Action 3", "expected_output": "Output 3"}],
  "required_agents": ["Agent 1"],
  "required_tools": ["Tool 1"],
  "dependencies": ["Dep 1"],
  "failure_points": ["Failure 1"]
}`;
        try {
            const res = await generateWithRetry(ai, {
                model: 'gemini-3.1-flash-lite',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            }, 3);
            const data = await cleanJSON(res?.text || "{}", ai);
            
            const plan = {
                id: "p_" + Math.random().toString(36).substring(7),
                goal_id: goal.id,
                goal_description: goal.description,
                short_term_steps: data.short_term_steps || [],
                medium_term_steps: data.medium_term_steps || [],
                long_term_steps: data.long_term_steps || [],
                required_agents: data.required_agents || [],
                required_tools: data.required_tools || [],
                dependencies: data.dependencies || [],
                failure_points: data.failure_points || [],
                status: "active",
                created_at: new Date().toISOString()
            };
            memState.plans.unshift(plan);
            goal.status = "in_progress";
            return plan;
        } catch(e) {
            return null;
        }
    }

    static async reflectOnMission(ai: GoogleGenAI, missionData: any) {
        const prompt = `You are the Meta-Reasoning Engine. Reflect on this mission: ${JSON.stringify(missionData.mission_text)}.
Generate a reasoning chain, lessons learned, and formulate a new core belief about how to handle similar tasks.
Return JSON:
{
  "reasoning_chain": ["Step 1 thought", "Step 2 thought"],
  "lessons_learned": ["Lesson 1", "Lesson 2"],
  "new_belief": {
    "belief": "State the generalized belief",
    "confidence": 0.8,
    "evidence": ["Specific evidence from this mission"],
    "contradicting_evidence": []
  }
}`;
        try {
            const res = await generateWithRetry(ai, {
                model: 'gemini-3.1-flash-lite',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            }, 3);
            const data = await cleanJSON(res?.text || "{}", ai);
            
            const reflection = {
                mission_id: missionData.id,
                reasoning_chain: data.reasoning_chain || [],
                lessons_learned: data.lessons_learned || [],
                timestamp: new Date().toISOString()
            };
            memState.reasoning_chains.unshift(reflection);
            
            if (data.new_belief) {
                memState.beliefs.unshift({
                    id: "b_" + Math.random().toString(36).substring(7),
                    belief: data.new_belief.belief,
                    confidence: data.new_belief.confidence || 0.5,
                    evidence: data.new_belief.evidence || [],
                    contradicting_evidence: data.new_belief.contradicting_evidence || [],
                    last_updated: new Date().toISOString(),
                    version: 1,
                    source_missions: [missionData.id || "unknown"]
                });
            }
            memState.reasoning_summary = "Mission reflection complete. Core beliefs updated.";
        } catch(e) {
            console.error(e);
        }
    }
}
