import { AnyGap, GapType } from "./gapTypes.js";
import { GapEventBus, GapEvents } from "./gapEvents.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class GapClassifier {
    private eventBus = GapEventBus.getInstance();

    public classifyEvidence(evidence: any[]): AnyGap[] {
        const gaps: AnyGap[] = [];

        // Mock classification based on evidence
        for (const ev of evidence) {
            if (ev.description && ev.description.includes("Missing domain knowledge")) {
                const gap: AnyGap = {
                    gap_id: uuidv4(),
                    type: GapType.KNOWLEDGE,
                    description: ev.description,
                    severity: 80,
                    detected_at: Date.now(),
                    missing_domains: ["Quantum Physics"]
                };
                gaps.push(gap);
            } else if (ev.description && ev.description.includes("No planner found")) {
                const gap: AnyGap = {
                    gap_id: uuidv4(),
                    type: GapType.CAPABILITY,
                    description: ev.description,
                    severity: 90,
                    detected_at: Date.now(),
                    missing_ability: "Long-horizon planning"
                };
                gaps.push(gap);
            } else if (ev.description && ev.description.includes("Inefficient search")) {
                const gap: AnyGap = {
                    gap_id: uuidv4(),
                    type: GapType.ALGORITHM,
                    description: ev.description,
                    severity: 60,
                    detected_at: Date.now(),
                    inefficient_algorithm: "BFS Planner"
                };
                gaps.push(gap);
            } else {
                // Default to a generic architecture or resource gap
                const gap: AnyGap = {
                    gap_id: uuidv4(),
                    type: GapType.RESOURCE,
                    description: ev.description || "Resource constraint detected",
                    severity: 50,
                    detected_at: Date.now(),
                    constrained_resource: "Token Context Limit"
                };
                gaps.push(gap);
            }
        }

        for (const gap of gaps) {
            this.eventBus.publish(GapEvents.GAP_CLASSIFIED, { gap });
        }

        return gaps;
    }
}
