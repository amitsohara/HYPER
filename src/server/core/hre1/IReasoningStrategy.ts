import { ReasoningSession, Evidence } from "./types.js";

export interface IReasoningStrategy {
    getName(): string;
    execute(session: ReasoningSession, evidenceSet: Evidence[]): Promise<void>;
    benchmark(): Record<string, number>;
}
