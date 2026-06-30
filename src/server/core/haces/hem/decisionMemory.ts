import { DecisionRecord } from "./memoryTypes.js";
import { MemoryEventBus, MemoryEvents } from "./memoryEvents.js";
import { MemoryMetrics } from "./memoryMetrics.js";

export class DecisionMemory {
    private eventBus = MemoryEventBus.getInstance();
    private decisions: Map<string, DecisionRecord> = new Map();

    public recordDecision(decision: DecisionRecord) {
        this.decisions.set(decision.decision_id, decision);
        MemoryMetrics.decisions_archived++;
        this.eventBus.publish(MemoryEvents.DECISION_ARCHIVED, decision);
    }

    public updateDecisionOutcome(decision_id: string, outcome: 'SUCCESS' | 'FAILURE' | 'PARTIAL' | 'PENDING', evaluation: string) {
        const decision = this.decisions.get(decision_id);
        if (decision) {
            decision.outcome = outcome;
            decision.long_term_evaluation = evaluation;
        }
    }

    public getDecision(decision_id: string): DecisionRecord | undefined {
        return this.decisions.get(decision_id);
    }

    public getAllDecisions(): DecisionRecord[] {
        return Array.from(this.decisions.values());
    }
}
