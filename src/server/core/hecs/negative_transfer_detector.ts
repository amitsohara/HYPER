import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../../engines.js";

export class NegativeTransferDetector {
    static async detectRisk(ai: GoogleGenAI, sourceDomain: string, targetDomain: string, transferablePatterns: string[], analogy: string, missionPrompt: string): Promise<{
        risk_of_negative_transfer: number;
        risk_factors: string[];
    }> {
        const prompt = `You are the HyperMind Negative Transfer Detector.
Assess the risk that transferring these patterns might harm the target mission. Negative transfer occurs when past experience inappropriately interferes with learning or problem-solving in a new context.

Source Domain: ${sourceDomain}
Target Domain: ${targetDomain}
Target Mission: ${missionPrompt}
Analogy: ${analogy}
Transferable Patterns: ${JSON.stringify(transferablePatterns)}

Return a JSON object:
{
  "risk_of_negative_transfer": number (0-100),
  "risk_factors": ["reasons why transfer might fail or cause harm"]
}
`;
        try {
            const response = await generateWithRetry(ai, {
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            let parsed = await cleanJSON(response?.text || "{}", ai);

            if (process.env.MODEL_MODE === 'dev_stub' && (parsed.risk_of_negative_transfer === undefined || parsed.provider_used)) {
                 parsed = { risk_of_negative_transfer: 10, risk_factors: ["Mock risk factor"] };
            }

            return {
                risk_of_negative_transfer: parsed.risk_of_negative_transfer || 0,
                risk_factors: parsed.risk_factors || []
            };
        } catch (e) {
            console.error("[HECS] NegativeTransferDetector failed", e);
            return { risk_of_negative_transfer: 0, risk_factors: [] };
        }
    }
}
