import { ThoughtState } from "./thought_state.js";
import { ThoughtStatus } from "./thinking_types.js";

export class ThoughtStack {
    private thoughts: Map<string, ThoughtState> = new Map();
    private active_thought_id?: string;

    addThought(thought: ThoughtState) {
        this.thoughts.set(thought.thought_id, thought);
        if (thought.parent_id) {
            const parent = this.thoughts.get(thought.parent_id);
            if (parent && !parent.child_ids.includes(thought.thought_id)) {
                parent.child_ids.push(thought.thought_id);
            }
        }
    }

    getThought(id: string): ThoughtState | undefined {
        return this.thoughts.get(id);
    }

    getAll(): ThoughtState[] {
        return Array.from(this.thoughts.values());
    }

    setActive(id: string) {
        if (this.active_thought_id) {
            const current = this.thoughts.get(this.active_thought_id);
            if (current && current.status === ThoughtStatus.ACTIVE) {
                current.status = ThoughtStatus.PAUSED;
            }
        }
        const next = this.thoughts.get(id);
        if (next) {
            next.status = ThoughtStatus.ACTIVE;
            this.active_thought_id = id;
        }
    }

    getActive(): ThoughtState | undefined {
        if (!this.active_thought_id) return undefined;
        return this.thoughts.get(this.active_thought_id);
    }
    
    getHighestPriorityPending(): ThoughtState | undefined {
        let highest: ThoughtState | undefined;
        for (const t of this.thoughts.values()) {
            if (t.status === ThoughtStatus.PENDING) {
                if (!highest || t.priority > highest.priority) {
                    highest = t;
                }
            }
        }
        return highest;
    }
}
