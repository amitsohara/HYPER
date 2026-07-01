import { IReasoningStrategy } from "../IReasoningStrategy.js";
import { ReasoningSession, Evidence } from "../types.js";

export class CommonsenseStrategy implements IReasoningStrategy {
    getName(): string { return "COMMONSENSE"; }
    async execute(session: ReasoningSession, evidenceSet: Evidence[]): Promise<void> {}
    benchmark(): Record<string, number> { return { executionTimeMs: 1 }; }
}
