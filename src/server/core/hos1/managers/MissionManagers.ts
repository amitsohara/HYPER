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
            payload: { 
                missionId: context.id,
                missionName: context.name,
                directive: context.directive,
                objective: context.objective,
                execution 
            }
        });

        return execution;
    }
}

export class MissionManager {
    constructor(private scheduler: MissionScheduler, private eventMesh: HyperMindEventMesh) {}

    createMission(name: string, priority: number, directive: string = "", description: string = "", objective: string = "", metadata: any = {}): MissionContext {
        return {
            id: `sys-mission`,
            name,
            directive: directive || name,
            objective: objective || description || name,
            description,
            priority,
            requiredCapabilities: [],
            allocatedResources: [],
            status: "CREATED",
            observations: [],
            plans: [],
            decisions: [],
            results: [],
            metadata
        };
    }

    runMission(context: MissionContext) {
        this.scheduler.schedule(context);
    }
}
