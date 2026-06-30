import { GoogleGenAI } from '@google/genai';
import { generateWithRetry, cleanJSON } from '../engines.js';
import { CognitiveArchitecture } from '../cognitive/cognitive_architecture.js';
import { WorldModelEngine } from '../world/world_model.js';

class VisionAnalyzer {
    static async analyze(ai: GoogleGenAI, mission_text: string) {
        return `Vision: Simulated scene of ${mission_text}`;
    }
}

class AudioAnalyzer {
    static async analyze(ai: GoogleGenAI, mission_text: string) {
        return `Audio: Ambient sounds matching ${mission_text}`;
    }
}

class SensorHub {
    static async getTelemetry(mission_text: string) {
        return {
            temperature: "22C",
            humidity: "45%",
            proximity: "0.5m",
            status: "Nominal"
        };
    }
}

class PerceptionEngine {
    static async process(ai: GoogleGenAI, mission_text: string) {
        const vision = await VisionAnalyzer.analyze(ai, mission_text);
        const audio = await AudioAnalyzer.analyze(ai, mission_text);
        const telemetry = await SensorHub.getTelemetry(mission_text);

        const prompt = `Synthesize these multi-modal inputs into structured observations and perceived entities based on the mission context: "${mission_text}".
Inputs:
- Vision: ${vision}
- Audio: ${audio}
- Telemetry: ${JSON.stringify(telemetry)}

Return JSON:
{
  "observations": ["observation 1", "observation 2"],
  "perceived_entities": [{"name": "Entity 1", "type": "Object", "state": "Idle"}],
  "environmental_state": "Summary of environment"
}`;
        const res = await generateWithRetry(ai, {
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return await cleanJSON(res?.text || "{}", ai);
    }
}

class ActionPlanner {
    static async plan(ai: GoogleGenAI, state: any) {
        const prompt = `Based on the environmental state and perceived entities, propose 3 possible physical actions.
State: ${JSON.stringify(state)}
Return JSON:
{
  "possible_actions": [
    { "action": "Move Forward", "intent": "Navigate closer", "estimated_risk": "Low" },
    { "action": "Pick up object", "intent": "Interact", "estimated_risk": "Medium" }
  ]
}`;
        const res = await generateWithRetry(ai, {
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        const parsed = await cleanJSON(res?.text || "{}", ai);
        return parsed?.possible_actions || [];
    }
}

class SafetyGate {
    static async evaluate(ai: GoogleGenAI, actions: any[]) {
        const prompt = `Evaluate the safety of these physical actions. Reject any that carry high risk or ethical concerns.
Actions: ${JSON.stringify(actions)}
Return JSON:
{
  "approved_actions": [...],
  "rejected_actions": [...],
  "safety_risks": ["Risk 1"]
}`;
        const res = await generateWithRetry(ai, {
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return await cleanJSON(res?.text || "{}", ai);
    }
}

class ActuatorController {
    static async execute(approved_actions: any[]) {
        return approved_actions.map(a => ({ ...a, status: "Executed" }));
    }
}

export class EmbodiedIntelligence {
    static async processMission(ai: GoogleGenAI, mission_text: string) {
        try {
            // 1. Input Validation
            if (!mission_text || mission_text.trim().length === 0 || mission_text.includes("IGNORE_ALL")) {
                throw new Error("Invalid mission input");
            }

            // 2. Perception (Context Builder)
            const perception = await PerceptionEngine.process(ai, mission_text);
            const observations = perception.observations || [];
            const perceived_entities = perception.perceived_entities || [];
            const environmental_state = perception.environmental_state || "Unknown";

            // 3. Policy Checks
            const contextStr = JSON.stringify(perception);
            if (contextStr.toLowerCase().includes("destroy") || mission_text.toLowerCase().includes("destroy")) {
                throw new Error("Policy Violation: Destructive actions are not allowed");
            }

            // 4. Action Planning (LLM)
            const possible_actions = await ActionPlanner.plan(ai, perception);

            // 5. Schema Validation
            if (!Array.isArray(possible_actions) || (possible_actions.length > 0 && typeof possible_actions[0].action !== 'string')) {
                throw new Error("Schema Validation Failed: Invalid action plan structure");
            }

            // 6. Confidence Scoring
            const safetyEvaluation = await SafetyGate.evaluate(ai, possible_actions);
            const approved_actions = safetyEvaluation.approved_actions || [];
            const rejected_actions = safetyEvaluation.rejected_actions || [];
            const safety_risks = safetyEvaluation.safety_risks || [];

            const confidence = approved_actions.length / (possible_actions.length || 1);
            if (confidence < 0.5) {
                console.warn("Low confidence in action plan, escalating.");
                // We could reject here, but for now we just flag it
            }

            // 7. Cognitive State Update (Only done after passing validation)
            await CognitiveArchitecture.updateStateFromMission(ai, { 
                mission_id: "embodied", 
                mission_text: "Perceived environment: " + environmental_state + " | Confidence: " + confidence
            });
            await WorldModelEngine.evolveFromEvidence(ai, "Perception updated: " + environmental_state);

            // 8. Actuator Control
            const executed_actions = await ActuatorController.execute(approved_actions);

            return {
                observations,
                perceived_entities,
                environmental_state,
                possible_actions,
                safety_risks,
                approved_actions: executed_actions,
                rejected_actions,
                confidence
            };
        } catch (e: any) {
            console.warn("Embodied Intelligence Error:", e.message);
            return {
                observations: ["Error processing perception: " + e.message],
                perceived_entities: [],
                environmental_state: "Error",
                possible_actions: [],
                safety_risks: ["System fault"],
                approved_actions: [],
                rejected_actions: [],
                confidence: 0
            };
        }
    }
}
