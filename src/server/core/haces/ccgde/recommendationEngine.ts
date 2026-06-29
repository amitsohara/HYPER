import { CEDMResult, InterventionScore, InterventionType, AnyGap, EvolutionRecommendation, CapabilityProposal } from "./gapTypes.js";
import { GapPolicies } from "./gapPolicies.js";
import { GapEventBus, GapEvents } from "./gapEvents.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class RecommendationEngine {
    private eventBus = GapEventBus.getInstance();

    public evaluateCEDM(gap: AnyGap, proposal?: CapabilityProposal, reusedCapId?: string): CEDMResult {
        const scores: InterventionScore[] = [];

        // Mock evaluation logic
        if (gap.type === "KNOWLEDGE") {
            scores.push({
                intervention_type: InterventionType.LEARN_NEW_KNOWLEDGE,
                score: 92,
                expected_gain: 80,
                cost: 10,
                risk: 5,
                justification: "Missing domain knowledge can be efficiently learned without architectural changes."
            });
        } else if (gap.type === "ALGORITHM") {
            scores.push({
                intervention_type: InterventionType.OPTIMIZE_ALGORITHM,
                score: 78,
                expected_gain: 60,
                cost: 40,
                risk: 20,
                justification: "Optimizing existing algorithm provides good ROI."
            });
        }

        if (reusedCapId) {
            scores.push({
                intervention_type: InterventionType.REUSE_EXISTING_CAPABILITY,
                score: 85,
                expected_gain: 75,
                cost: 15,
                risk: 10,
                justification: "High ROI from reusing an existing proven capability."
            });
        }

        if (proposal) {
            scores.push({
                intervention_type: InterventionType.CREATE_NEW_CAPABILITY,
                score: 57,
                expected_gain: proposal.expected_benefit,
                cost: proposal.estimated_implementation_effort,
                risk: proposal.risk,
                justification: "Creating new capabilities incurs high cost and risk, evaluated as fallback."
            });
        }

        // Add a fallback
        if (scores.length === 0) {
            scores.push({
                intervention_type: InterventionType.UPDATE_POLICY,
                score: 80,
                expected_gain: 50,
                cost: 20,
                risk: 15,
                justification: "Policy update is safe and efficient."
            });
        }

        // Sort by score descending
        scores.sort((a, b) => b.score - a.score);

        return {
            scores,
            selected_intervention: scores[0]
        };
    }

    public generateRecommendation(gap: AnyGap, assessmentId: string, proposal?: CapabilityProposal, reusedCapId?: string): EvolutionRecommendation | null {
        const cedmResult = this.evaluateCEDM(gap, proposal, reusedCapId);

        if (!GapPolicies.minimumCEDMScoreRequired(cedmResult.selected_intervention)) {
            return null; // Not worth it
        }

        const recommendation: EvolutionRecommendation = {
            recommendation_id: uuidv4(),
            assessment_id: assessmentId,
            action_type: cedmResult.selected_intervention.intervention_type,
            target_capability_id: reusedCapId,
            proposal: cedmResult.selected_intervention.intervention_type === InterventionType.CREATE_NEW_CAPABILITY ? proposal : undefined,
            cedm_result: cedmResult,
            supporting_evidence: [gap.description],
            priority: Math.round(cedmResult.selected_intervention.score),
            timestamp: Date.now()
        };

        this.eventBus.publish(GapEvents.EVOLUTION_RECOMMENDATION_CREATED, { recommendation });
        return recommendation;
    }
}
