import { MotorFeedback, MotorPolicy, MotorSkill, ValidationStatus } from "../types.js";
import { HyperMindEventMesh } from "../../hcns01/eventMesh.js";
import { CognitiveDomain } from "../../hcns01/types.js";
import { HILASpecialist } from "../../hila1/hilaSpecialist.js";
import { v4 as uuidv4 } from "uuid";

export class PolicyOptimizationEngine {
    constructor() {}

    async optimize(policy: MotorPolicy, feedback: MotorFeedback): Promise<MotorPolicy> {
        policy.performanceHistory.push(feedback);

        try {
            const hila = HILASpecialist.getInstance();
            if (hila && hila.arbitrator) {
                const request = {
                    id: uuidv4(),
                    missionId: "SYSTEM",
                    domain: "SENSORIMOTOR",
                    task: "Optimize motor policy",
                    context: { policy: policy.parameters, feedback },
                    priority: 2,
                    requiredConfidence: 0.1 // Sensorimotor prefers internal execution, so required confidence is low
                };
                
                const arbitration = await hila.arbitrator.arbitrate(request, 0.5); // Internal confidence 0.5 > 0.1
                
                if (arbitration.useExternal) {
                    const prompt = `Optimize these motor policy parameters based on recent feedback.
Current Parameters: ${JSON.stringify(policy.parameters)}
Feedback: ${JSON.stringify(feedback)}

Return a JSON object containing ONLY the updated parameters. Do not use markdown formatting.`;

                    const response = await hila.arbitrator.executeExternal({...request, task: prompt}, arbitration);
                    
                    if (response && response.content) {
                        let parsed: any = {};
                        try { 
                            const _parsed = JSON.parse(response.content);
                            if (typeof _parsed === 'object' && !Array.isArray(_parsed) && !_parsed.fallback) {
                                parsed = _parsed;
                            } else {
                                console.warn("Fallback or non-object response from LLM, returning empty object");
                            }
                        } catch(e) { 
                            console.warn("Failed to parse LLM response", response.content); 
                        }
                        policy.parameters = { ...policy.parameters, ...parsed };
                        return policy;
                    }
                }
            }
        } catch (e) {
            // Suppress error
        }

        // Mock optimization fallback
        if (feedback.stability < 0.5) {
            policy.parameters.stabilityGain = (policy.parameters.stabilityGain || 1.0) * 1.1;
        }
        return policy;
    }
}

export class ErrorCorrectionEngine {
    constructor(private policyOptimizer: PolicyOptimizationEngine) {}

    async correct(skill: MotorSkill, feedback: MotorFeedback): Promise<MotorSkill> {
        if (!feedback.success || feedback.errorDelta) {
            // Apply error correction to policy
            skill.program.policy = await this.policyOptimizer.optimize(skill.program.policy, feedback);
            skill.confidence = Math.min(skill.confidence + 0.05, 1.0); // Simple learning curve
        } else {
            // Success, increase confidence
            skill.confidence = Math.min(skill.confidence + 0.1, 1.0);
        }
        return skill;
    }
}

export class FeedbackLearningEngine {
    constructor(private errorCorrection: ErrorCorrectionEngine, private eventMesh: HyperMindEventMesh) {}

    async processFeedback(skill: MotorSkill, feedback: MotorFeedback) {
        const updatedSkill = await this.errorCorrection.correct(skill, feedback);
        
        // Publish that policy was updated
        this.eventMesh.publish({
            type: "MOTOR_POLICY_UPDATED",
            domain: CognitiveDomain.LEARNING,
            priority: 1,
            source: "HSME",
            payload: { skill: updatedSkill }
        });
        
        return updatedSkill;
    }
}

export class BalanceLearningEngine {
    learnBalance(feedback: MotorFeedback): any {
        // Mock learning dynamic stability
        return {
            centerOfMassOffset: feedback.stability < 0.5 ? 0.1 : 0.0,
            correctionTorque: 5.0
        };
    }
}
