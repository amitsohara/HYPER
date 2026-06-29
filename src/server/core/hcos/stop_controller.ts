import { ThinkingBudget } from "./thinking_budget.js";

export class StopController {
    static shouldStop(budget: ThinkingBudget, confidence: number, mission_complexity: number): { stop: boolean, reason?: string } {
        if (budget.isExhausted()) {
            return { stop: true, reason: "Budget exhausted" };
        }
        
        // Dynamic confidence threshold based on complexity
        let threshold = 90;
        if (mission_complexity < 20) threshold = 60; // For simple arithmetic, stop early
        if (mission_complexity > 80) threshold = 95; // For mars city, demand high confidence
        
        if (confidence >= threshold) {
            return { stop: true, reason: "Confidence threshold reached" };
        }
        
        return { stop: false };
    }
}
