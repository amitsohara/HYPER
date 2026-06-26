import { GoogleGenAI } from '@google/genai';
import { generateWithRetry, cleanJSON } from '../engines.js';

export interface SocietyState {
    agents: any[];
    coalitions: any[];
    votes: any[];
    negotiations: any[];
}

// Generate hundreds of agents
const generateAgents = (count: number) => {
    const roles = ["researcher", "analyst", "planner", "critic", "synthesizer", "executor"];
    const personalities = ["analytical", "creative", "skeptical", "optimistic", "pragmatic"];
    const agents = [];
    for (let i = 0; i < count; i++) {
        agents.push({
            id: `agent_${i}`,
            name: `Agent ${i}`,
            role: roles[Math.floor(Math.random() * roles.length)],
            personality: personalities[Math.floor(Math.random() * personalities.length)],
            reputation: Math.floor(Math.random() * 100),
            status: "active"
        });
    }
    return agents;
};

const defaultState: SocietyState = {
    agents: generateAgents(150),
    coalitions: [
        { id: "c1", task: "Global Trend Analysis", members: ["agent_12", "agent_45", "agent_89"], status: "active" }
    ],
    votes: [
        { id: "v1", proposal: "Prioritize environmental simulations", approved: true, votes_for: 85, votes_against: 65 }
    ],
    negotiations: []
};

let memState = { ...defaultState };

export class MultiAgentSociety {
    static async getState() {
        return memState;
    }

    static async formCoalition(ai: GoogleGenAI, taskName: string, requiredRoles: string[]) {
        const team = [];
        for (const role of requiredRoles) {
            const availableAgents = memState.agents.filter(a => a.role === role);
            if (availableAgents.length > 0) {
                // Sort by reputation
                availableAgents.sort((a, b) => b.reputation - a.reputation);
                team.push(availableAgents[0].id);
            }
        }
        
        const coalition = {
            id: "c_" + Math.random().toString(36).substring(7),
            task: taskName,
            members: team,
            status: "active"
        };
        memState.coalitions.push(coalition);
        return coalition;
    }

    static async holdVote(proposal: string) {
        let votesFor = 0;
        let votesAgainst = 0;
        
        for (const agent of memState.agents) {
            // Simplified voting logic based on personality
            let prob = 0.5;
            if (agent.personality === 'optimistic') prob += 0.2;
            if (agent.personality === 'skeptical') prob -= 0.2;
            
            if (Math.random() < prob) {
                votesFor++;
            } else {
                votesAgainst++;
            }
        }
        
        const voteResult = {
            id: "v_" + Math.random().toString(36).substring(7),
            proposal: proposal,
            approved: votesFor > votesAgainst,
            votes_for: votesFor,
            votes_against: votesAgainst
        };
        
        memState.votes.push(voteResult);
        return voteResult;
    }

    static async simulateNegotiation(ai: GoogleGenAI, issue: string) {
        // Pick two random agents
        const agentA = memState.agents[Math.floor(Math.random() * memState.agents.length)];
        const agentB = memState.agents[Math.floor(Math.random() * memState.agents.length)];
        
        const prompt = `Simulate a short negotiation between two AI agents over the following issue: "${issue}"
Agent A: Role - ${agentA.role}, Personality - ${agentA.personality}
Agent B: Role - ${agentB.role}, Personality - ${agentB.personality}

Return a JSON object with:
{
  "winner": "agent_id (either ${agentA.id} or ${agentB.id})",
  "resolution_summary": "Brief summary of how it was resolved",
  "dialogue": ["A: ...", "B: ..."]
}`;
        try {
            const res = await generateWithRetry(ai, {
                model: 'gemini-flash-latest',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            }, 3);
            const data = await cleanJSON(res?.text || "{}", ai);
            
            const negotiation = {
                id: "n_" + Math.random().toString(36).substring(7),
                issue,
                participants: [agentA.id, agentB.id],
                winner: data.winner,
                resolution: data.resolution_summary,
                dialogue: data.dialogue || []
            };
            memState.negotiations.push(negotiation);
            return negotiation;
        } catch(e) {
            return null;
        }
    }
}
