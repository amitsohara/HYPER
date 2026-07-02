import { Decision, DecisionStatus } from "../types.js";
import { HyperMindEventMesh } from "../../hcns01/eventMesh.js";
import { CognitiveDomain } from "../../hcns01/types.js";

export class ActionAuthorizationEngine {
    constructor(private eventMesh: HyperMindEventMesh) {}

    authorize(decision: Decision): void {
        // Find best option that passes policies and has acceptable risk
        let bestOption = null;
        let maxUtility = -1;

        for (const option of decision.options) {
            if (option.policyPassed && (option.riskScore || 0) < 0.8) {
                if ((option.utilityScore || 0) > maxUtility) {
                    maxUtility = option.utilityScore || 0;
                    bestOption = option;
                }
            }
        }

        if (bestOption) {
            decision.status = DecisionStatus.APPROVED;
            decision.selectedOptionId = bestOption.id;
            decision.authorizationReason = `Approved with utility ${bestOption.utilityScore} and risk ${bestOption.riskScore}`;
            
            this.eventMesh.publish({
                type: "ACTION_AUTHORIZED",
                domain: CognitiveDomain.SYSTEM,
                priority: 1,
                source: "HDME",
                payload: { decision, planId: bestOption.planId }
            });
        } else {
            decision.status = DecisionStatus.REJECTED;
            decision.authorizationReason = "No options passed policy or risk thresholds.";
            
            this.eventMesh.publish({
                type: "ACTION_REJECTED",
                domain: CognitiveDomain.SYSTEM,
                priority: 1,
                source: "HDME",
                payload: { decision, reason: decision.authorizationReason }
            });
        }
    }
}
