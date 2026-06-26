import { CognitiveState } from "./cognitive_state.js";

export class StateValidator {
    static validate(state: any): state is CognitiveState {
        // Minimal runtime validation
        if (!state || typeof state !== 'object') return false;
        if (typeof state.mission !== 'string') return false;
        if (!Array.isArray(state.working_memory)) return false;
        if (typeof state.version !== 'number') return false;
        return true;
    }
}
