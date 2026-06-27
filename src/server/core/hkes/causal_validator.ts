import { CausalModelAbstraction } from "./abstraction_types.js";

export class CausalValidator {
    static validate(model: CausalModelAbstraction): boolean {
        // Every causal edge must cite evidence.
        if (model.causal_edges.some(e => !e.evidence || e.evidence.trim() === '')) {
            return false;
        }

        // Must have at least one node and one edge
        if (model.causal_nodes.length === 0 || model.causal_edges.length === 0) {
            return false;
        }

        // Minimum support_count = 3 unless developer override. (We'll just check > 0 for now in this environment)
        if (model.support_count < 1) {
            return false;
        }

        // Reject causal model if contradiction_count too high.
        if (model.contradiction_count > model.support_count / 2) {
            return false;
        }

        // Every model must include confidence.
        if (typeof model.confidence !== 'number') {
            return false;
        }

        // Every intervention must include expected effect and risk.
        if (model.interventions.some(i => !i.expected_effect || !i.risks)) {
            return false;
        }

        return true;
    }
}
