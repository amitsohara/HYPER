import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../../engines.js";

export class DomainRepairEngine {
  static async repairSection(ai: GoogleGenAI, sectionName: string, sectionContent: any, profile: any, validationResult: any): Promise<any> {
    const prompt = `You are the Domain Repair Engine.
Your task is to fix a report section that suffers from wrong-domain template leakage.
Mission Domain: ${profile.primary_domain}
Expected Vocabulary: ${profile.expected_vocabulary.join(", ")}
Expected Actions: ${profile.expected_actions.join(", ")}

Section Name: ${sectionName}
Original Content: ${JSON.stringify(sectionContent)}

Issues Detected:
- Wrong terms used: ${validationResult.wrong_domain_terms.join(", ")}
- Mismatched actions: ${validationResult.mismatched_actions.join(", ")}

Instructions:
1. Completely remove mismatched terms (e.g., MVP, GTM, CAC) and replace them with concepts appropriate for ${profile.primary_domain}.
2. Rewrite mismatched actions to fit the domain.
3. Preserve the exact JSON schema of the original content.

Return the repaired JSON for this section.`;

    try {
        const res = await generateWithRetry(ai, {
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json", temperature: 0.2 }
        });
        return await cleanJSON(res.text, ai);
    } catch (e) {
        console.error(`Repair failed for section ${sectionName}`, e);
        return sectionContent; // fallback to original if repair fails
    }
  }
  
  static async repairContradictions(ai: GoogleGenAI, draftReport: any, strategy: any, contradictions: string[]): Promise<any> {
     const prompt = `You are the Logic Repair Engine.
The draft report has contradictions against the core strategy.
Strategy: ${JSON.stringify(strategy)}
Contradictions Found: ${contradictions.join("; ")}

Draft Report: ${JSON.stringify(draftReport)}

Please fix the Draft Report so that it aligns PERFECTLY with the Strategy. Ensure you preserve all keys in the Draft Report object.
Return the corrected Draft Report JSON.`;

     try {
        const res = await generateWithRetry(ai, {
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json", temperature: 0.2 }
        });
        return await cleanJSON(res.text, ai);
    } catch (e) {
        console.error(`Contradiction repair failed`, e);
        return draftReport; 
    }
  }
}
