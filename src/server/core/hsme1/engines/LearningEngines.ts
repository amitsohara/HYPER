import { MotorFeedback, MotorPolicy, MotorSkill, ValidationStatus } from "../types.js";
import { HyperMindEventMesh } from "../../hcns01/eventMesh.js";
import { CognitiveDomain } from "../../hcns01/types.js";

export class PolicyOptimizationEngine {
    optimize(policy: MotorPolicy, feedback: MotorFeedback): MotorPolicy {
        // Mock optimization: adjust parameters based on feedback
        policy.performanceHistory.push(feedback);
        // E.g., if stability is low, increase stability gain
        if (feedback.stability < 0.5) {
            policy.parameters.stabilityGain = (policy.parameters.stabilityGain || 1.0) * 1.1;
        }
        return policy;
    }
}

export class ErrorCorrectionEngine {
    constructor(private policyOptimizer: PolicyOptimizationEngine) {}

    correct(skill: MotorSkill, feedback: MotorFeedback): MotorSkill {
        if (!feedback.success || feedback.errorDelta) {
            // Apply error correction to policy
            skill.program.policy = this.policyOptimizer.optimize(skill.program.policy, feedback);
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

    processFeedback(skill: MotorSkill, feedback: MotorFeedback) {
        const updatedSkill = this.errorCorrection.correct(skill, feedback);
        
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
