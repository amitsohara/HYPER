import { GoogleGenAI } from "@google/genai";
import { WorldModel, WorldEntityType, WorldRelationshipType } from "./world_types.js";
import { generateWithRetry, cleanJSON } from "../../engines.js";
import { WorldState } from "./world_state.js";
import { WorldValidator } from "./world_validator.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class RealityRepresentationCore {
    static async parseMission(ai: GoogleGenAI, mission: string): Promise<WorldModel> {
        const prompt = `You are the HyperMind Reality Representation Core.
Your task is to convert the following mission into an internal executable representation of reality.
Do NOT reason directly from the text. Instead, identify the discrete structural components of the world this mission entails.

Mission: "${mission}"

Extract the following arrays and return them as a JSON object:
- entities: array of { id, type (from WorldEntityType), name, description, capabilities, limitations, state }
- relationships: array of { id, source_entity (id), target_entity (id), type (from WorldRelationshipType), strength, confidence, evidence }
- systems: array of { id, name, subsystems (ids), dependencies (ids), inputs (ids), outputs (ids), constraints (ids) }
- processes: array of { id, name, inputs (ids), outputs (ids), resources (ids), dependencies (ids), duration, risk }
- constraints: array of { id, name, type, description, severity }
- resources: array of { id, name, type, quantity, status }
- environments: array of { id, name, conditions, hazards, resources (ids), limitations }
- agents: array of { id, name, type, goals, capabilities, resources (ids), knowledge, authority, responsibilities }
- events: array of { id, name, type, description, probability, impact }

Use these enums where applicable:
WorldEntityType: PERSON, ROBOT, AI_AGENT, CITY, COUNTRY, PLANET, SATELLITE, BUILDING, VEHICLE, COMPANY, ORGANIZATION, RESOURCE, MATERIAL, ENERGY_SOURCE, DEVICE, SOFTWARE, PROCESS, SYSTEM, DOCUMENT, EVENT, LOCATION, ENVIRONMENT, LAW, RULE, UNKNOWN
WorldRelationshipType: PART_OF, CONNECTED_TO, USES, PRODUCES, CONSUMES, CAUSES, DEPENDS_ON, SUPPORTS, CONFLICTS_WITH, LOCATED_IN, OWNS, CONTROLS, AFFECTS, ENABLES, BLOCKS, INTERACTS_WITH
`;

        try {
            const response = await generateWithRetry(ai, {
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            let parsed = await cleanJSON(response?.text || '{}', ai);

            if (process.env.MODEL_MODE === 'dev_stub' && (!parsed.entities || parsed.provider_used)) {
                 if (mission.toLowerCase().includes("mars")) {
                     parsed = {
                         entities: [
                             { id: "mars", type: "PLANET", name: "Mars", description: "Red planet", capabilities: [], limitations: [], state: "active" },
                             { id: "city", type: "CITY", name: "Mars City", description: "Habitable settlement", capabilities: [], limitations: [], state: "planned" },
                             { id: "humans", type: "PERSON", name: "Colonists", description: "Inhabitants", capabilities: [], limitations: [], state: "ready" },
                             { id: "robots", type: "ROBOT", name: "Construction Bots", description: "Build stuff", capabilities: [], limitations: [], state: "ready" }
                         ],
                         relationships: [
                             { id: "rel1", source_entity: "city", target_entity: "mars", type: "LOCATED_IN", strength: 100, confidence: 100, evidence: "Mission spec" }
                         ],
                         systems: [
                             { id: "sys1", name: "Habitat System", subsystems: [], dependencies: [], inputs: [], outputs: [], constraints: ["c1"] }
                         ],
                         processes: [],
                         constraints: [
                             { id: "c1", name: "Radiation", type: "Radiation", description: "High radiation levels", severity: "High" },
                             { id: "c2", name: "Gravity", type: "Gravity", description: "Low gravity", severity: "Medium" }
                         ],
                         resources: [
                             { id: "res1", name: "Water", type: "Water", quantity: "Limited", status: "critical" },
                             { id: "res2", name: "Power", type: "Energy", quantity: "Required", status: "critical" }
                         ],
                         environments: [],
                         agents: [],
                         events: []
                     };
                 } else if (mission.toLowerCase().includes("hospital")) {
                     parsed = {
                         entities: [
                             { id: "hospital", type: "BUILDING", name: "Hospital ED", description: "Emergency Department", capabilities: [], limitations: [], state: "active" },
                             { id: "patients", type: "PERSON", name: "Patients", description: "Need care", capabilities: [], limitations: [], state: "waiting" },
                             { id: "doctors", type: "PERSON", name: "Doctors", description: "Provide care", capabilities: [], limitations: [], state: "busy" }
                         ],
                         relationships: [
                             { id: "rel1", source_entity: "patients", target_entity: "hospital", type: "LOCATED_IN", strength: 100, confidence: 100, evidence: "Context" }
                         ],
                         systems: [
                             { id: "sys1", name: "Triage System", subsystems: [], dependencies: [], inputs: [], outputs: [], constraints: [] }
                         ],
                         processes: [],
                         constraints: [
                             { id: "c1", name: "Bed Capacity", type: "Capacity", description: "Limited beds", severity: "High" }
                         ],
                         resources: [],
                         environments: [],
                         agents: [],
                         events: []
                     };
                 } else if (mission.toLowerCase().includes("startup")) {
                      parsed = {
                         entities: [
                             { id: "startup", type: "COMPANY", name: "AI Startup", description: "New AI company", capabilities: [], limitations: [], state: "active" },
                             { id: "customers", type: "PERSON", name: "Customers", description: "Target market", capabilities: [], limitations: [], state: "unknown" }
                         ],
                         relationships: [
                             { id: "rel1", source_entity: "startup", target_entity: "customers", type: "INTERACTS_WITH", strength: 80, confidence: 90, evidence: "Business logic" }
                         ],
                         systems: [],
                         processes: [],
                         constraints: [
                             { id: "c1", name: "Funding", type: "Budget", description: "Limited runway", severity: "High" }
                         ],
                         resources: [
                             { id: "res1", name: "Capital", type: "Money", quantity: "Limited", status: "critical" }
                         ],
                         environments: [],
                         agents: [],
                         events: []
                     };
                 } else {
                     parsed = { entities: [], relationships: [], systems: [], processes: [], constraints: [], resources: [], environments: [], agents: [], events: [] };
                 }
            }

            const world = WorldState.createEmptyWorld();
            
            (parsed.entities || []).forEach((e: any) => {
                world.entities.set(e.id, {
                    entity_id: e.id,
                    entity_type: e.type as WorldEntityType || WorldEntityType.UNKNOWN,
                    name: e.name || "Unknown",
                    description: e.description || "",
                    properties: e.properties || {},
                    capabilities: e.capabilities || [],
                    limitations: e.limitations || [],
                    state: e.state || "unknown",
                    confidence: 90,
                    source: "RealityRepresentationCore",
                    created_at: Date.now(),
                    updated_at: Date.now()
                });
            });

            (parsed.relationships || []).forEach((r: any) => {
                world.relationships.set(r.id, {
                    relationship_id: r.id,
                    source_entity: r.source_entity,
                    target_entity: r.target_entity,
                    relationship_type: r.type as WorldRelationshipType || WorldRelationshipType.INTERACTS_WITH,
                    strength: r.strength || 50,
                    confidence: r.confidence || 90,
                    evidence: r.evidence || "Mission parsing",
                    source_module: "RealityRepresentationCore"
                });
            });

            (parsed.systems || []).forEach((s: any) => world.systems.set(s.id, s));
            (parsed.processes || []).forEach((p: any) => world.processes.set(p.id, p));
            (parsed.constraints || []).forEach((c: any) => world.constraints.set(c.id, c));
            (parsed.resources || []).forEach((r: any) => world.resources.set(r.id, r));
            (parsed.environments || []).forEach((e: any) => world.environments.set(e.id, e));
            (parsed.agents || []).forEach((a: any) => world.agents.set(a.id, a));
            (parsed.events || []).forEach((e: any) => world.events.set(e.id, e));

            return world;
        } catch (error) {
            console.error("[HWME] Failed to parse reality", error);
            return WorldState.createEmptyWorld();
        }
    }
}
