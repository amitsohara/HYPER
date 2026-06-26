import { GoogleGenAI } from '@google/genai';
import { generateWithRetry, cleanJSON } from '../engines.js';

export interface DiscoveryState {
    discoveries: any[];
}

const defaultState: DiscoveryState = {
    discoveries: []
};

let memState = { ...defaultState };

export class ScientificDiscoveryPlatform {
  static async getState() {
      return memState;
  }

  static async discover(ai: GoogleGenAI, topic: string, discipline: string): Promise<any> {
    const prompt = `You are a Scientific Discovery AI specialized in ${discipline}. 
Analyze the topic: "${topic}".

Generate a scientific discovery package. Return EXACTLY a JSON object with:
{
  "discipline": "${discipline}",
  "hypotheses": [
    {
      "statement": "Clear testable hypothesis",
      "competing_explanations": ["Alternative explanation 1", "Alternative explanation 2"],
      "experiment_roadmap": ["Phase 1: ...", "Phase 2: ...", "Phase 3: ..."],
      "evidence_confidence": number (0-100, expected confidence in proving this)
    }
  ], // 2-3 hypotheses
  "discovery_report": "A comprehensive scientific discovery report summarizing the theoretical background, the proposed hypotheses, and the potential impact of these discoveries."
}`;
    
    try {
      const response = await generateWithRetry(ai, {
        model: 'gemini-flash-lite-latest',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      }, 3);
      const data = await cleanJSON(response?.text || "{}", ai);
      
      const discovery = {
        id: "disc_" + Math.random().toString(36).substring(7),
        topic,
        timestamp: new Date().toISOString(),
        ...data
      };
      
      memState.discoveries.unshift(discovery);
      return discovery;
    } catch (e) {
      console.warn("ScientificDiscoveryPlatform error:", e);
      return null;
    }
  }
}
