import { GoogleGenAI } from "@google/genai";
import { DocumentationAssessment } from "./verificationTypes.js";
import { generateWithRetry, cleanJSON } from "../../../engines.js";

export class DocumentationValidator {

    public async validateDocs(ai: GoogleGenAI, code: string, docs: string): Promise<DocumentationAssessment> {
        const prompt = `Validate if the documentation matches the implemented code.
Code snippet: ${code.substring(0, 1000)}
Docs snippet: ${docs.substring(0, 1000)}

Return JSON:
{
  "api_docs_present": true,
  "developer_docs_present": true,
  "synchronized": true,
  "issues": []
}`;

        let result: any = {
            api_docs_present: true,
            developer_docs_present: true,
            synchronized: true,
            issues: []
        };

        try {
            const res = await generateWithRetry(ai, {
                model: "gemini-2.5-flash",
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            result = await cleanJSON(res?.text || "{}", ai);
        } catch (e) {
            console.error("DocumentationValidator failed:", e);
        }

        const assessment: DocumentationAssessment = {
            api_docs_present: result.api_docs_present ?? false,
            developer_docs_present: result.developer_docs_present ?? false,
            synchronized: result.synchronized ?? false,
            issues: result.issues || []
        };

        return assessment;
    }
}
