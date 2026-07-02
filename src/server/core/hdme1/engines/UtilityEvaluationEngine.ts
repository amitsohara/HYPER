import { DecisionOption } from "../types.js";

export class UtilityEvaluationEngine {
    evaluate(option: DecisionOption): DecisionOption {
        // Mock utility calculation based on outcomes
        let utility = 0;
        
        for (const outcome of option.predictedOutcomes) {
            // Simplified: if outcome predicts success, increase utility
            if (outcome && outcome.state === "SUCCESS") {
                utility += 10;
            } else {
                utility += 5; // Neutral
            }
        }
        
        // Normalize between 0 and 1
        const normalizedUtility = Math.min(Math.max(utility / 100, 0), 1.0);
        
        // If no outcomes were evaluated, provide a base utility
        option.utilityScore = option.predictedOutcomes.length > 0 ? normalizedUtility : 0.5;
        
        return option;
    }
}
