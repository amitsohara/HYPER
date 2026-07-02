import { MissionExecution, MissionContext } from "../types.js";
import { v4 as uuidv4 } from "uuid";
import { HyperMindEventMesh } from "../../hcns01/eventMesh.js";
import { CognitiveDomain } from "../../hcns01/types.js";

export class MissionQueue {
    private queue: MissionExecution[] = [];

    enqueue(execution: MissionExecution) {
        this.queue.push(execution);
        // Simple priority sort
        this.queue.sort((a, b) => b.context.priority - a.context.priority);
    }

    dequeue(): MissionExecution | undefined {
        return this.queue.shift();
    }
}

export class MissionScheduler {
    constructor(private queue: MissionQueue, private eventMesh: HyperMindEventMesh) {}

    schedule(context: MissionContext): MissionExecution {
        const execution: MissionExecution = {
            id: `exec-${uuidv4()}`,
            missionId: context.id,
            status: "QUEUED",
            context,
            startTime: Date.now()
        };

        this.queue.enqueue(execution);

        this.eventMesh.publish({
            type: "MISSION_SCHEDULED",
            domain: CognitiveDomain.SYSTEM,
            priority: 1,
            source: "HOS_SCHEDULER",
            payload: { execution }
        });

        return execution;
    }
}

export class MissionManager {
    constructor(private scheduler: MissionScheduler, private eventMesh: HyperMindEventMesh) {}

    createMission(name: string, priority: number): MissionContext {
        // Reuse HCNS missions if possible, but this is the execution envelope
        return {
            id: `mis-ctx-${uuidv4()}`,
            priority,
            requiredCapabilities: [],
            allocatedResources: []
        };
    }

    runMission(context: MissionContext) {
        this.scheduler.schedule(context);
    }
}
