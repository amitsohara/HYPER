import { EvolutionEventType } from "./memoryTypes.js";

export const PreservationPolicies = {
    PROTECTED_EVENT_TYPES: [
        EvolutionEventType.RESEARCH,
        EvolutionEventType.ARCHITECTURE,
        EvolutionEventType.ENGINEERING,
        EvolutionEventType.VERIFICATION,
        EvolutionEventType.BENCHMARK,
        EvolutionEventType.PRODUCTION_EVOLUTION
    ],
    NEVER_DELETE_SCIENTIFIC_EVIDENCE: true,
    NEVER_DELETE_DECISION_RATIONALE: true,
    
    canDeleteEvent(type: EvolutionEventType): boolean {
        if (this.PROTECTED_EVENT_TYPES.includes(type)) return false;
        return true;
    }
};
