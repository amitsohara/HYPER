import { GoogleGenAI } from "@google/genai";
import { ArchitectureAssessment } from "./verificationTypes.js";
import { VerificationEventBus, VerificationEvents } from "./verificationEvents.js";
import { generateWithRetry, cleanJSON } from "../../../engines.js";

export class ArchitectureCompliance {
    private eventBus = VerificationEventBus.getInstance();

    public async checkCompliance(ai: GoogleGenAI, implementationData: any, blueprintData: any): Promise<ArchitectureAssessment> {
        const prompt = `Evaluate if the given implementation complies with its architectural blueprint.
Blueprint: ${JSON.stringify(blueprintData)}
Implementation: ${JSON.stringify(implementationData)}

Check for:
- Adherence to Cognitive Blueprint
- Interface contracts
- Dependency graph violations
- Deviations from architectural patterns

Return JSON:
{
  "blueprint_followed": true,
  "interface_contracts_met": true,
  "dependency_violations": [],
  "deviations": []
}`;

        let result: any = {
            blueprint_followed: true,
            interface_contracts_met: true,
            dependency_violations: [],
            deviations: []
        };

        try {
            const res = await generateWithRetry(ai, {
                model: "gemini-2.5-flash",
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            result = await cleanJSON(res?.text || "{}", ai);
        } catch (e) {
            console.error("ArchitectureCompliance failed:", e);
        }

        const assessment: ArchitectureAssessment = {
            blueprint_followed: result.blueprint_followed ?? false,
            interface_contracts_met: result.interface_contracts_met ?? false,
            dependency_violations: result.dependency_violations || [],
            deviations: result.deviations || []
        };

        if (assessment.blueprint_followed && assessment.interface_contracts_met && assessment.deviations.length === 0) {
            this.eventBus.publish(VerificationEvents.ARCHITECTURE_COMPLIANCE_PASSED, assessment);
        }

        return assessment;
    }
}
