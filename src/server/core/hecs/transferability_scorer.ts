import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../../engines.js";

export class TransferabilityScorer {
    static async score(ai: GoogleGenAI, sourceDomain: string, targetDomain: string, analogy: string, sourcePatterns: string[], missionPrompt: string): Promise<{
        transferability_score: number;
        transferable_patterns: string[];
        non_transferable_patterns: string[];
    }> {
        const prompt = `You are the HyperMind Transferability Scorer.
Assess the transferability of patterns from the source domain to the target domain.

Source Domain: ${sourceDomain}
Target Domain: ${targetDomain}
Analogy: ${analogy}
Source Patterns: ${JSON.stringify(sourcePatterns)}
Target Mission: ${missionPrompt}

Return a JSON object:
{
  "transferability_score": number (0-100),
  "transferable_patterns": ["patterns that can be used directly or by analogy"],
  "non_transferable_patterns": ["patterns that do not apply"]
}
`;
        try {
            const response = await generateWithRetry(ai, {
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            let parsed = await cleanJSON(response?.text || "{}", ai);
            
            if (process.env.MODEL_MODE === 'dev_stub' && (parsed.transferability_score === undefined || parsed.provider_used)) {
                 parsed = { transferability_score: 80, transferable_patterns: ["Mock transferable pattern"], non_transferable_patterns: ["Mock non-transferable pattern"] };
            }

            return {
                transferability_score: parsed.transferability_score || 0,
                transferable_patterns: parsed.transferable_patterns || [],
                non_transferable_patterns: parsed.non_transferable_patterns || []
            };
        } catch (e) {
            console.error("[HECS] TransferabilityScorer failed", e);
            return { transferability_score: 0, transferable_patterns: [], non_transferable_patterns: [] };
        }
    }
}
