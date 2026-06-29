import { ThoughtState } from "./thought_state.js";
import { ThoughtStatus } from "./thinking_types.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class ThoughtBranch {
    static fork(parent: ThoughtState, alternatives: string[]): ThoughtState[] {
        return alternatives.map(alt => ({
            thought_id: uuidv4(),
            parent_id: parent.thought_id,
            child_ids: [],
            description: alt,
            priority: parent.priority,
            confidence: parent.confidence,
            dependencies: [...parent.dependencies],
            origin: "BRANCH",
            status: ThoughtStatus.PENDING,
            results: null,
            created_at: Date.now(),
            updated_at: Date.now()
        }));
    }
}
