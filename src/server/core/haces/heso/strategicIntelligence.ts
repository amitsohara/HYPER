import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../../../engines.js";

export class StrategicIntelligenceEngine {
    
    public async evaluateCurrentState(ai: GoogleGenAI, systemState: any): Promise<any> {
        const prompt = `Evaluate the current strategic intelligence state of the HyperMind ecosystem.
State: ${JSON.stringify(systemState)}

Identify emerging opportunities, technological trends, and long-term advantages.

Return JSON:
{
  "emerging_opportunities": ["Opportunity 1"],
  "technological_trends": ["Trend 1"],
  "competitive_advantages": ["Advantage 1"]
}`;

        let result: any = {
            emerging_opportunities: [],
            technological_trends: [],
            competitive_advantages: []
        };

        try {
            const res = await generateWithRetry(ai, {
                model: "gemini-2.5-flash",
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            result = await cleanJSON(res?.text || "{}", ai);
        } catch (e) {
            console.error("StrategicIntelligenceEngine failed:", e);
        }

        return result;
    }
}
