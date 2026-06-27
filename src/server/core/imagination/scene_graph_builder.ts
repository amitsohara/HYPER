import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../../engines.js";

export class SceneGraphBuilder {
  static async build(ai: GoogleGenAI, imaginedWorld: any): Promise<any> {
    const prompt = `Convert the following imagined world into a detailed scene graph.

Imagined World: ${JSON.stringify(imaginedWorld)}

Return a JSON object representing the graph:
{
  "nodes": [
    { "id": "node_id", "type": "object | person | system | force | institution | technology | resource", "label": "name" }
  ],
  "edges": [
    { "source": "node_id", "target": "node_id", "relation": "depends_on | causes | blocks | enables | threatens | supports | transforms" }
  ]
}`;
    
    try {
      const res = await generateWithRetry(ai, {
        model: "gemini-1.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2
        }
      });
      return await cleanJSON(res.text, ai);
    } catch (e) {
      console.error("SceneGraphBuilder Error:", e);
      return { nodes: [], edges: [] };
    }
  }
}
