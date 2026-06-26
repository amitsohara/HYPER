import { CognitiveState } from "./cognitive_state.js";

export class StateSerializer {
    static serialize(state: CognitiveState): string {
        // We could implement partial serialization, compression, or scrubbing here.
        return JSON.stringify(state);
    }
}
