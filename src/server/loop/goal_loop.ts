import { GoogleGenAI } from '@google/genai';
import { generateWithRetry, cleanJSON } from '../engines.js';

export interface LoopIteration {
    iteration_number: number;
    action_taken: string;
    sub_agents_used: string[];
    verification_result: string;
    state_updates: Record<string, any>;
    is_complete: boolean;
    needs_human: boolean;
    handoff_reason?: string;
    timestamp: number;
}

export interface GoalLoopState {
    id: string;
    purpose: string;
    status: 'pending' | 'running' | 'completed' | 'needs_human' | 'failed';
    iterations: LoopIteration[];
    external_state: Record<string, any>;
    created_at: number;
}

const activeLoops: Record<string, GoalLoopState> = {};

export class GoalLoopEngine {
    static createLoop(purpose: string): GoalLoopState {
        const loopId = `LOOP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
        const newLoop: GoalLoopState = {
            id: loopId,
            purpose,
            status: 'pending',
            iterations: [],
            external_state: {},
            created_at: Date.now()
        };
        activeLoops[loopId] = newLoop;
        return newLoop;
    }

    static getLoop(id: string): GoalLoopState | undefined {
        return activeLoops[id];
    }

    static getAllLoops(): GoalLoopState[] {
        return Object.values(activeLoops).sort((a, b) => b.created_at - a.created_at);
    }

    static async stepLoop(ai: GoogleGenAI, loopId: string): Promise<GoalLoopState> {
        const loop = activeLoops[loopId];
        if (!loop) throw new Error("Loop not found");
        if (loop.status === 'completed' || loop.status === 'needs_human') return loop;

        loop.status = 'running';
        const iterNum = loop.iterations.length + 1;

        const prompt = `You are a Recursive Goal Loop Agent. 
Your overarching purpose is: "${loop.purpose}"
Current External State: ${JSON.stringify(loop.external_state)}

Previous Iterations Summary:
${loop.iterations.map(i => `Iter ${i.iteration_number}: ${i.action_taken} -> ${i.verification_result}`).join('\n')}

Determine the next step to achieve the purpose. You may decide to update state, use sub-agents (simulate this), verify progress, complete the goal, or hand off to a human if you are stuck or need approval.

Respond EXACTLY with this JSON structure:
{
  "action_taken": "Describe what you did or decided in this iteration",
  "sub_agents_used": ["Name of sub-agent 1", "Name of sub-agent 2"],
  "state_updates": { "key": "new_value" },
  "verification_result": "Result of verifying the action against the goal",
  "is_complete": boolean (true if the overarching purpose is achieved),
  "needs_human": boolean (true if you need human input or handoff),
  "handoff_reason": "Reason for handoff (if needs_human is true)"
}`;

        try {
            const resp = await generateWithRetry(ai, {
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            const result = await cleanJSON(resp?.text || "{}", ai);
            
            // Apply state updates
            if (result.state_updates) {
                loop.external_state = { ...loop.external_state, ...result.state_updates };
            }

            const iteration: LoopIteration = {
                iteration_number: iterNum,
                action_taken: result.action_taken || "Unknown action",
                sub_agents_used: result.sub_agents_used || [],
                verification_result: result.verification_result || "No verification",
                state_updates: result.state_updates || {},
                is_complete: result.is_complete || false,
                needs_human: result.needs_human || false,
                handoff_reason: result.handoff_reason,
                timestamp: Date.now()
            };

            loop.iterations.push(iteration);

            if (iteration.is_complete) {
                loop.status = 'completed';
            } else if (iteration.needs_human) {
                loop.status = 'needs_human';
            }

            return loop;

        } catch (e) {
            console.error("Error in GoalLoop step", e);
            loop.status = 'failed';
            return loop;
        }
    }
}
