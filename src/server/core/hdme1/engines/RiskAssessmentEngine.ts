import { DecisionOption } from "../types.js";

export class RiskAssessmentEngine {
    evaluate(option: DecisionOption): DecisionOption {
        let risk = 0;
        
        for (const outcome of option.predictedOutcomes) {
            if (outcome && outcome.state === "FAILURE") {
                risk += 20; // High risk for failure states
            }
        }
        
        const normalizedRisk = Math.min(Math.max(risk / 100, 0), 1.0);
        option.riskScore = normalizedRisk;
        
        return option;
    }
}
