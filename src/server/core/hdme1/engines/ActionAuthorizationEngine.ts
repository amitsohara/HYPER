import { Decision, DecisionStatus } from "../types.js";
import { HyperMindEventMesh } from "../../hcns01/eventMesh.js";
import { CognitiveDomain } from "../../hcns01/types.js";
import { HILASpecialist } from "../../hila1/hilaSpecialist.js";
import { v4 as uuidv4 } from "uuid";

export class ActionAuthorizationEngine {
    constructor(private eventMesh: HyperMindEventMesh) {}

    async authorize(decision: Decision): Promise<void> {
        let bestOption = null;

        try {
            const hila = HILASpecialist.getInstance();
            if (hila && hila.arbitrator && decision.options.length > 0) {
                const request = {
                    id: uuidv4(),
                    missionId: "SYSTEM",
                    domain: "DECISION",
                    task: "Authorize decision.",
                    context: { decision },
                    priority: 5,
                    requiredConfidence: 0.9
                };
                
                const arbitration = await hila.arbitrator.arbitrate(request, 0.4);
                
                if (arbitration.useExternal) {
                    const prompt = `Evaluate these options and select the best one based on highest utility and lowest risk.
Decision Goal: ${decision.goalId}
Options: ${JSON.stringify(decision.options, null, 2)}

Return a JSON object with:
- "selectedOptionId": the ID of the best option.
- "reason": a short string explaining why.
If none are acceptable (e.g. all have very high risk > 0.8), set selectedOptionId to null.
Do not use markdown formatting.`;

                    const response = await hila.arbitrator.executeExternal({...request, task: prompt}, arbitration);
                    
                    if (response && response.content) {
                        try {
                            const parsed = JSON.parse(response.content);
                            if (parsed.selectedOptionId) {
                                bestOption = decision.options.find(o => o.id === parsed.selectedOptionId);
                                if (bestOption) {
                                    decision.authorizationReason = parsed.reason || "Selected by HILA";
                                }
                            }
                        } catch (parseError) {
                            // Suppress parse error log
                        }
                    }
                    
                    // Fallback if HILA returned a mock or invalid ID
                    if (!bestOption) {
                        bestOption = decision.options.find(o => o.policyPassed && (o.riskScore || 0) < 0.8) || null;
                        if (bestOption) {
                            decision.authorizationReason = "Selected by Fallback (HILA provided invalid ID or non-JSON)";
                        }
                    }
                } else {
                    // Fallback heuristic
                    let maxUtility = -1;
                    for (const option of decision.options) {
                        if (option.policyPassed && (option.riskScore || 0) < 0.8) {
                            if ((option.utilityScore || 0) > maxUtility) {
                                maxUtility = option.utilityScore || 0;
                                bestOption = option;
                                decision.authorizationReason = `Approved with utility ${bestOption.utilityScore} and risk ${bestOption.riskScore}`;
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.error("Failed to authorize with HILA:", e);
        }

        if (bestOption) {
            decision.status = DecisionStatus.APPROVED;
            decision.selectedOptionId = bestOption.id;
            
            this.eventMesh.publish({
                type: "ACTION_AUTHORIZED",
                domain: CognitiveDomain.SYSTEM,
                priority: 1,
                source: "HDME",
                payload: { decision, planId: bestOption.planId }
            });
        } else {
            decision.status = DecisionStatus.REJECTED;
            decision.authorizationReason = decision.authorizationReason || "No options passed policy or risk thresholds.";
            
            this.eventMesh.publish({
                type: "ACTION_REJECTED",
                domain: CognitiveDomain.SYSTEM,
                priority: 1,
                source: "HDME",
                payload: { decision, reason: decision.authorizationReason, debug: decision.options }
            });
        }
    }
}
