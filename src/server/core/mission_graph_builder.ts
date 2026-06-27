import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../engines.js";

export class MissionGraphBuilder {
    static async build(ai: GoogleGenAI, missionUnderstanding: any) {
        const prompt = `You are the Mission Graph Builder of the Meta-Cognition Engine.
Based on the following mission understanding, convert the core concepts into a knowledge graph.
Nodes represent core concepts, domains, and entities.
Edges represent relationships or dependencies between them.

Mission Understanding:
${JSON.stringify(missionUnderstanding, null, 2)}

Return a JSON object:
{
  "nodes": [{"id": "Node1", "label": "Concept/Entity"}],
  "edges": [{"source": "Node1", "target": "Node2", "relationship": "depends on / affects / creates"}]
}`;

        const res = await generateWithRetry(ai, {
            model: "gemini-2.5-flash",
            contents: prompt,
            bypassBudget: true,
            config: { responseMimeType: "application/json" }
        });

        return await cleanJSON(res?.text || "{}", ai);
    }
}
