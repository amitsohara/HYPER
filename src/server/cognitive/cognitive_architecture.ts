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

    static async runMetaCognition(ai: GoogleGenAI) {
        memState.reasoning_summary = "Running Meta-Cognition: Self-reflection and uncertainty analysis...";
        
        const currentBeliefs = memState.beliefs.slice(0, 3).map(b => b.belief);
        
        const metaPrompt = `You are the Meta-Cognition Engine. Reflect on the system's current top beliefs: ${JSON.stringify(currentBeliefs)}.
Generate dynamic self-reflection questions and answers based on these beliefs. Specifically address:
- Why do I believe this?
- What evidence contradicts me?
- What experiment should I run?
- How uncertain am I?

Return JSON:
{
  "meta_questions": [
    {
      "question": "Why do I believe [specific belief]?",
      "analysis": "...",
      "contradicting_evidence_considered": "...",
      "proposed_experiment": "...",
      "uncertainty_level": 0.4
    }
  ],
  "overall_uncertainty": 0.35,
  "meta_reflection_summary": "Overall summary of current cognitive state."
}`;
        
        try {
            const res = await generateWithRetry(ai, {
                model: 'gemini-3.1-flash-lite',
                contents: metaPrompt,
                config: { responseMimeType: "application/json" }
            }, 3);
            const data = await cleanJSON(res?.text || "{}", ai);
            
            memState.uncertainty_level = data.overall_uncertainty || memState.uncertainty_level;
            memState.confidence_level = 1.0 - memState.uncertainty_level;
            memState.reasoning_summary = data.meta_reflection_summary || "Meta-cognition complete.";
            
            const metaReflection = {
                id: "meta_" + Math.random().toString(36).substring(7),
                timestamp: new Date().toISOString(),
                questions: data.meta_questions || [],
                overall_uncertainty: memState.uncertainty_level,
                summary: memState.reasoning_summary
            };
            
            memState.reasoning_chains.unshift({
                mission_id: "meta_reflection",
                reasoning_chain: data.meta_questions?.map((q: any) => `Q: ${q.question} | A: ${q.analysis} | Experiment: ${q.proposed_experiment} | Uncertainty: ${q.uncertainty_level}`) || [],
                lessons_learned: [data.meta_reflection_summary],
                timestamp: new Date().toISOString()
            });

            return metaReflection;
        } catch(e) {
            console.error("Meta-Cognition error:", e);
            return null;
        }
    }

    static async runContinuousLoop(ai: GoogleGenAI) {
        memState.reasoning_summary = "Starting continuous cognitive loop...";

        // 1. Observe (Simulate fetching incoming data/context)
        const observationPrompt = `You are the Observation Engine. Generate a random observation about the current simulated environment. Return JSON: {"observation": "..."}`;
        const obsRes = await generateWithRetry(ai, { model: 'gemini-3.1-flash-lite', contents: observationPrompt, config: { responseMimeType: "application/json" } }, 3);
        const obsData = await cleanJSON(obsRes?.text || "{}", ai);
        const observation = obsData.observation || "Detected anomalous data pattern.";

        // 2. Build internal representation
        const repPrompt = `Build an internal representation based on this observation: "${observation}". Return JSON: {"representation": "..."}`;
        const repRes = await generateWithRetry(ai, { model: 'gemini-3.1-flash-lite', contents: repPrompt, config: { responseMimeType: "application/json" } }, 3);
        const repData = await cleanJSON(repRes?.text || "{}", ai);
        const representation = repData.representation || "Internal representation built.";

        // 3. Reason
        const reasonPrompt = `Reason about this representation: "${representation}". Generate a reasoning chain. Return JSON: {"reasoning_chain": ["Step 1", "Step 2"]}`;
        const reasonRes = await generateWithRetry(ai, { model: 'gemini-3.1-flash-lite', contents: reasonPrompt, config: { responseMimeType: "application/json" } }, 3);
        const reasonData = await cleanJSON(reasonRes?.text || "{}", ai);
        const reasoningChain = reasonData.reasoning_chain || ["Reasoned about data."];

        // 4. Generate hypotheses
        const hypPrompt = `Generate a testable hypothesis based on this reasoning: ${JSON.stringify(reasoningChain)}. Return JSON: {"hypothesis": "..."}`;
        const hypRes = await generateWithRetry(ai, { model: 'gemini-3.1-flash-lite', contents: hypPrompt, config: { responseMimeType: "application/json" } }, 3);
        const hypData = await cleanJSON(hypRes?.text || "{}", ai);
        const hypothesis = hypData.hypothesis || "Hypothesized relationship.";

        // 5. Run experiments
        const expPrompt = `Simulate running an experiment to test this hypothesis: "${hypothesis}". Return JSON: {"experiment_outcome": "...", "success": true}`;
        const expRes = await generateWithRetry(ai, { model: 'gemini-3.1-flash-lite', contents: expPrompt, config: { responseMimeType: "application/json" } }, 3);
        const expData = await cleanJSON(expRes?.text || "{}", ai);
        const outcome = expData.experiment_outcome || "Experiment completed.";

        // 6. Update world model (Evolve from new evidence)
        const { WorldModelEngine } = await import('../world/world_model.js').catch(() => import('../world/world_model.ts'));
        const evolutionResult = await WorldModelEngine.evolveFromEvidence(ai, outcome);
        
        // 7. Update beliefs
        let newWorldRule = evolutionResult.evolution_summary || "World model updated.";
        
        const beliefPrompt = `Formulate a new belief based on this world rule: "${newWorldRule}". Return JSON: {"belief": "...", "confidence": 0.9}`;
        const beliefRes = await generateWithRetry(ai, { model: 'gemini-3.1-flash-lite', contents: beliefPrompt, config: { responseMimeType: "application/json" } }, 3);
        const beliefData = await cleanJSON(beliefRes?.text || "{}", ai);
        
        const newBelief = {
            id: "b_" + Math.random().toString(36).substring(7),
            belief: beliefData.belief || newWorldRule,
            confidence: beliefData.confidence || 0.8,
            evidence: [outcome],
            contradicting_evidence: [],
            last_updated: new Date().toISOString(),
            version: 1,
            source_missions: ["continuous_loop"]
        };
        memState.beliefs.unshift(newBelief);
        
        memState.reasoning_chains.unshift({
            mission_id: "loop_" + Math.random().toString(36).substring(7),
            reasoning_chain: reasoningChain,
            lessons_learned: [newWorldRule],
            timestamp: new Date().toISOString()
        });

        memState.reasoning_summary = "Completed a full cognitive cycle: Observation -> Hypothesis -> Experiment -> Belief Update.";
        
        return {
            observation,
            representation,
            reasoningChain,
            hypothesis,
            outcome,
            newWorldRule,
            newBelief
        };
    }

    static isLoopRunning = false;
    static loopTimeout: any = null;

    static async startContinuousLoop(ai: GoogleGenAI) {
        if (CognitiveArchitecture.isLoopRunning) return { status: "Already running" };
        CognitiveArchitecture.isLoopRunning = true;
        
        const loop = async () => {
            if (!CognitiveArchitecture.isLoopRunning) return;
            try {
                await CognitiveArchitecture.runContinuousLoop(ai);
            } catch (e) {
                console.error("Cognitive loop error:", e);
            }
            if (CognitiveArchitecture.isLoopRunning) {
                CognitiveArchitecture.loopTimeout = setTimeout(loop, 15000); // 15 seconds
            }
        };
        
        loop(); // Start immediately
        return { status: "Started" };
    }

    static async stopContinuousLoop() {
        CognitiveArchitecture.isLoopRunning = false;
        if (CognitiveArchitecture.loopTimeout) clearTimeout(CognitiveArchitecture.loopTimeout);
        memState.reasoning_summary = "Continuous loop stopped.";
        return { status: "Stopped" };
    }
}
