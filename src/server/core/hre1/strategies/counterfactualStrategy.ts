import { IReasoningStrategy } from "../IReasoningStrategy.js";
import { ReasoningSession, Evidence } from "../types.js";

export class CounterfactualStrategy implements IReasoningStrategy {
    getName(): string { return "COUNTERFACTUAL"; }
    async execute(session: ReasoningSession, evidenceSet: Evidence[]): Promise<void> {}
    benchmark(): Record<string, number> { return { executionTimeMs: 1 }; }
}
