import { ThoughtState } from "./thought_state.js";
import { ThoughtStatus } from "./thinking_types.js";

export class ThoughtMerger {
    static merge(thoughts: ThoughtState[], selected_id: string): ThoughtState | undefined {
        const winner = thoughts.find(t => t.thought_id === selected_id);
        if (!winner) return undefined;
        
        for (const t of thoughts) {
            if (t.thought_id !== selected_id) {
                t.status = ThoughtStatus.MERGED;
            }
        }
        
        return winner;
    }
}
