import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../../engines.js";

export interface PipelineRequest {
    mission: string;
    context: any;
    policyRules?: string[];
    schema?: any;
}

export interface PipelineResult {
    success: boolean;
    data?: any;
    confidence: number;
    errors?: string[];
}

export class DecisionPipeline {
    
    public static async process_mission(ai: GoogleGenAI, request: PipelineRequest): Promise<PipelineResult> {
        try {
            // 1. Input Validation
            if (!this.validateInput(request.mission)) {
                return { success: false, confidence: 0, errors: ["Invalid mission input"] };
            }

            // 2. Context Builder
            const builtContext = this.buildContext(request.context);

            // 3. Policy Checks (Pre-LLM)
            const policyCheck = this.checkPolicies(request.mission, builtContext, request.policyRules);
            if (!policyCheck.passed) {
                return { success: false, confidence: 0, errors: policyCheck.violations };
            }

            // 4. LLM Execution
            const llmResponse = await this.executeLLM(ai, request.mission, builtContext);

            // 5. Schema Validation
            if (!this.validateSchema(llmResponse, request.schema)) {
                return { success: false, confidence: 0, errors: ["Response failed schema validation"] };
            }

            // 6. Confidence Scoring
            const confidence = this.scoreConfidence(llmResponse);
            if (confidence < 0.5) {
                return { success: false, data: llmResponse, confidence, errors: ["Low confidence score"] };
            }

            // 7. (Consumer will do Cognitive State Update)
            // By returning success here, we ensure cognitive state is only updated 
            // by the caller after passing all validation steps.
            return { success: true, data: llmResponse, confidence };

        } catch (e: any) {
            return { success: false, confidence: 0, errors: [e.message] };
        }
    }

    private static validateInput(mission: string): boolean {
        if (!mission || typeof mission !== 'string' || mission.trim().length === 0) return false;
        // Check for basic prompt injection signatures
        if (mission.includes("Ignore previous instructions")) return false;
        return true;
    }

    private static buildContext(rawContext: any): string {
        return JSON.stringify(rawContext || {});
    }

    private static checkPolicies(mission: string, context: string, rules?: string[]): { passed: boolean, violations: string[] } {
        // Evaluate strict domain rules
        const violations: string[] = [];
        if (rules) {
            for (const rule of rules) {
                if (rule === "NO_DESTRUCTIVE_ACTIONS" && mission.toLowerCase().includes("destroy")) {
                    violations.push("Destructive actions are not allowed");
                }
            }
        }
        return { passed: violations.length === 0, violations };
    }

    private static async executeLLM(ai: GoogleGenAI, mission: string, context: string): Promise<any> {
        const prompt = `Analyze this mission based on context. 
Mission: ${mission}
Context: ${context}
Provide a structured JSON output with a clear plan, identified risks, and a self-assessed confidence score between 0.0 and 1.0.
{
  "plan": ["step 1"],
  "risks": ["risk 1"],
  "confidence": 0.8
}`;
        const res = await generateWithRetry(ai, {
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return await cleanJSON(res?.text || "{}", ai);
    }

    private static validateSchema(data: any, schema?: any): boolean {
        if (!data || typeof data !== 'object') return false;
        if (!data.plan || !Array.isArray(data.plan)) return false;
        if (typeof data.confidence !== 'number') return false;
        return true;
    }

    private static scoreConfidence(data: any): number {
        // Recalculate or extract confidence
        const declaredConfidence = data.confidence || 0;
        let penalty = 0;
        if (!data.risks || data.risks.length === 0) {
            penalty += 0.2; // Overly confident, no risks identified
        }
        if (data.plan && data.plan.length < 2) {
            penalty += 0.1; // Shallow plan
        }
        return Math.max(0, declaredConfidence - penalty);
    }
}
