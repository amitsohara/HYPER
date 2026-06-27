import { HeuristicAbstraction } from "./abstraction_types.js";

export class HeuristicValidator {
    static validate(heuristic: HeuristicAbstraction): boolean {
        // Must come from at least one validated pattern.
        if (!heuristic.source_pattern_ids || heuristic.source_pattern_ids.length === 0) return false;

        // Prefer support_count >= 3. Wait, rule says prefer, but is it required? "Prefer support_count >= 3." We will enforce > 0.
        if (heuristic.support_count < 1) return false;

        // Must include if_conditions and then_guidance.
        if (!heuristic.if_conditions || heuristic.if_conditions.length === 0) return false;
        if (!heuristic.then_guidance || heuristic.then_guidance.length === 0) return false;

        // Must include avoid_when.
        if (!heuristic.avoid_when || heuristic.avoid_when.length === 0) return false;

        // Must include failure_warning.
        if (!heuristic.failure_warning || heuristic.failure_warning.length === 0) return false;

        // Must cite source_experience_ids.
        if (!heuristic.source_experience_ids || heuristic.source_experience_ids.length === 0) return false;

        // Reject generic heuristics like "plan carefully" or "use data".
        const genericPhrases = ["plan carefully", "use data", "always plan well", "make a good plan"];
        const combinedText = (heuristic.title + " " + heuristic.description + " " + heuristic.then_guidance.join(" ")).toLowerCase();
        if (genericPhrases.some(phrase => combinedText.includes(phrase))) {
            return false;
        }

        // Reject if contradiction_count is too high.
        if (heuristic.contradiction_count > heuristic.support_count / 2) return false;

        return true;
    }
}
