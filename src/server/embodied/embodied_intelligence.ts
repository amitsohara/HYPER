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
            model: 'gemini-3.1-flash-lite',
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
            model: 'gemini-3.1-flash-lite',
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
            model: 'gemini-3.1-flash-lite',
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
            // 1. Perception
            const perception = await PerceptionEngine.process(ai, mission_text);
            const observations = perception.observations || [];
            const perceived_entities = perception.perceived_entities || [];
            const environmental_state = perception.environmental_state || "Unknown";

            // 2. Feed to Cognitive State & World Model
            await CognitiveArchitecture.updateStateFromMission(ai, { 
                mission_id: "embodied", 
                mission_text: "Perceived environment: " + environmental_state 
            });
            await WorldModelEngine.evolveFromEvidence(ai, "Perception updated: " + environmental_state);

            // 3. Action Planning
            const possible_actions = await ActionPlanner.plan(ai, perception);

            // 4. Safety Gate
            const safetyEvaluation = await SafetyGate.evaluate(ai, possible_actions);
            const approved_actions = safetyEvaluation.approved_actions || [];
            const rejected_actions = safetyEvaluation.rejected_actions || [];
            const safety_risks = safetyEvaluation.safety_risks || [];

            // 5. Actuator Control
            const executed_actions = await ActuatorController.execute(approved_actions);

            return {
                observations,
                perceived_entities,
                environmental_state,
                possible_actions,
                safety_risks,
                approved_actions: executed_actions,
                rejected_actions
            };
        } catch (e) {
            console.error("Embodied Intelligence Error:", e);
            return {
                observations: ["Error processing perception"],
                perceived_entities: [],
                environmental_state: "Error",
                possible_actions: [],
                safety_risks: ["System fault"],
                approved_actions: [],
                rejected_actions: []
            };
        }
    }
}
