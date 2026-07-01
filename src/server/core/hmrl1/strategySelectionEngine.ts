import { ReasoningStrategy } from "./types.js";

export class StrategySelectionEngine {
    public selectStrategy(goalContext: string, availableEvidence: string[]): ReasoningStrategy {
        if (availableEvidence.length === 0) {
            return ReasoningStrategy.ABDUCTIVE; // Form hypotheses
        }
        
        if (goalContext.includes("simulate") || goalContext.includes("predict")) {
            return ReasoningStrategy.SIMULATION;
        }

        if (goalContext.includes("prove") || goalContext.includes("logic")) {
            return ReasoningStrategy.DEDUCTIVE;
        }

        if (goalContext.includes("pattern") || availableEvidence.length > 5) {
            return ReasoningStrategy.INDUCTIVE;
        }

        return ReasoningStrategy.HYBRID;
    }

    public getAlternatives(selected: ReasoningStrategy): ReasoningStrategy[] {
        const all = Object.values(ReasoningStrategy);
        return all.filter(s => s !== selected).slice(0, 2); // Return top 2 alternatives
    }
}
