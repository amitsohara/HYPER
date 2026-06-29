import { CapabilityGraph } from "./capabilityGraph.js";
import { AnyGap, Capability } from "./gapTypes.js";
import { GapEventBus, GapEvents } from "./gapEvents.js";

export class CapabilityReuseEngine {
    private graph: CapabilityGraph;
    private eventBus = GapEventBus.getInstance();

    constructor(graph: CapabilityGraph) {
        this.graph = graph;
    }

    public findReusableCapability(gap: AnyGap): Capability | null {
        if (gap.type !== "CAPABILITY" && gap.type !== "ALGORITHM") return null;

        const capabilities = this.graph.getAllCapabilities();
        
        for (const cap of capabilities) {
            // Mock matching logic
            if (gap.type === "CAPABILITY" && cap.purpose.includes((gap as any).missing_ability)) {
                this.eventBus.publish(GapEvents.CAPABILITY_REUSED, { capability_id: cap.capability_id, gap_id: gap.gap_id });
                return cap;
            }
        }

        return null;
    }
}
