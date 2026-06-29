import { StateUpdate } from "./state_update.js";
import { StateTransition } from "./state_transition.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class StateTransitionEngine {
    static computeTransition(oldStateId: string, newStateId: string, update: StateUpdate): StateTransition {
        return {
            transition_id: uuidv4(),
            trigger: update.source,
            source_state_id: oldStateId,
            target_state_id: newStateId,
            reason: update.reason,
            timestamp: update.timestamp,
            confidence: 90, // default or computed
            changes: update.changes
        };
    }
}
