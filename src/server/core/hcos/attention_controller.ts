import { AttentionFocus } from "./thinking_types.js";

export class AttentionController {
    current_focus: AttentionFocus = AttentionFocus.MISSION;
    priorities: Map<AttentionFocus, number> = new Map();

    constructor() {
        // Initialize defaults
        Object.values(AttentionFocus).forEach(focus => {
            this.priorities.set(focus as AttentionFocus, 10);
        });
        this.priorities.set(AttentionFocus.MISSION, 100);
    }

    updateFocus(focus: AttentionFocus, priorityDelta: number) {
        const current = this.priorities.get(focus) || 10;
        this.priorities.set(focus, Math.max(0, current + priorityDelta));
        this.recalculateTopFocus();
    }

    private recalculateTopFocus() {
        let topFocus = AttentionFocus.MISSION;
        let maxScore = -1;
        for (const [focus, score] of this.priorities.entries()) {
            if (score > maxScore) {
                maxScore = score;
                topFocus = focus;
            }
        }
        this.current_focus = topFocus;
    }
}
