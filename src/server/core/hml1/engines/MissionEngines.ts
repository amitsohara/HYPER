import { MissionScenarioDefinition, MissionTrace } from "../types.js";
import { v4 as uuidv4 } from "uuid";
import { HyperMindEventMesh } from "../../hcns01/eventMesh.js";
import { CognitiveDomain } from "../../hcns01/types.js";
import { HyperMindOS } from "../../hos1/index.js";

export class MissionExecutor {
    constructor(private hos: HyperMindOS, private eventMesh: HyperMindEventMesh) {}

    async execute(scenario: MissionScenarioDefinition): Promise<MissionTrace> {
        const missionId = `mis-${uuidv4()}`;
        const startTime = Date.now();
        const events: any[] = [];

        // Subscribe to collect trace
        const traceCollector = (event: any) => {
            events.push(event);
        };
        // In a real system, we'd subscribe to everything via a wildcard or specific domains
        this.eventMesh.subscribe("MISSION_COMPLETED", traceCollector);
        this.eventMesh.subscribe("MISSION_FAILED", traceCollector);
        this.eventMesh.subscribe("PLAN_EVALUATED", traceCollector);

        // Dispatch to HOS
        const ctx = this.hos.missionManager.createMission(scenario.name, 10);
        this.hos.missionManager.runMission(ctx);

        // Mock wait for mission completion
        await new Promise(resolve => setTimeout(resolve, 200));

        // Mock some events for the trace
        events.push({ type: "PLAN_EVALUATED", timestamp: Date.now() });
        events.push({ type: "ACTION_COMPLETED", timestamp: Date.now() });
        events.push({ type: "MISSION_COMPLETED", payload: { missionId }, timestamp: Date.now() });

        const endTime = Date.now();

        return {
            missionId,
            events,
            startTime,
            endTime
        };
    }
}

export class MissionReplayEngine {
    replay(trace: MissionTrace) {
        console.log(`Replaying mission: ${trace.missionId}`);
        for (const event of trace.events) {
            console.log(`[REPLAY] ${event.timestamp}: ${event.type}`);
        }
    }
}
