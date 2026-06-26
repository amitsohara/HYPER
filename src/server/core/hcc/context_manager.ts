import { CognitiveState } from "./cognitive_state.js";

export class ContextManager {
    static buildContext(state: CognitiveState): string {
        // Build a compact, structured representation of the current state
        // avoiding long strings where possible.
        
        const contextObj = {
            mission: state.mission,
            current_stage: state.mission_stage,
            top_goal: state.current_goal,
            active_memory: state.working_memory,
            attention: state.attention,
            confidence: state.confidence
        };

        return JSON.stringify(contextObj);
    }
}
