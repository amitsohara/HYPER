export interface Goal {
    id: string;
    description: string;
    status: "PENDING" | "ACTIVE" | "COMPLETED" | "FAILED";
    subgoals?: Goal[];
}

export class GoalStack {
    private stack: Goal[] = [];

    push(goal: Goal) {
        this.stack.push(goal);
    }

    pop(): Goal | undefined {
        return this.stack.pop();
    }

    peek(): Goal | undefined {
        return this.stack[this.stack.length - 1];
    }

    getTopGoal(): Goal | null {
        // recursively find the deepest active/pending subgoal of the top goal
        if (this.stack.length === 0) return null;
        let current = this.stack[this.stack.length - 1];
        while (current.subgoals && current.subgoals.length > 0) {
            const activeSubgoal = current.subgoals.find(g => g.status !== "COMPLETED" && g.status !== "FAILED");
            if (activeSubgoal) {
                current = activeSubgoal;
            } else {
                break;
            }
        }
        return current;
    }

    getState() {
        return this.stack;
    }
}
