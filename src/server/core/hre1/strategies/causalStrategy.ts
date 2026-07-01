import { IReasoningStrategy } from "../IReasoningStrategy.js";
import { ReasoningSession, Evidence } from "../types.js";

export class CausalStrategy implements IReasoningStrategy {
    getName(): string { return "CAUSAL"; }
    async execute(session: ReasoningSession, evidenceSet: Evidence[]): Promise<void> {}
    benchmark(): Record<string, number> { return { executionTimeMs: 1 }; }
}
