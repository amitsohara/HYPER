import { Mission, MissionState } from "../types.js";
import { HyperMindEventMesh } from "../../hcns01/eventMesh.js";
import { CognitiveDomain } from "../../hcns01/types.js";
import { v4 as uuidv4 } from "uuid";

export class MissionLifecycleManager {
    private missions: Map<string, Mission> = new Map();

    constructor(private eventMesh: HyperMindEventMesh) {}

    createMission(name: string, description: string, goalIds: string[]): Mission {
        const mission: Mission = {
            id: `mis-${uuidv4()}`,
            name,
            description,
            state: MissionState.CREATED,
            goalIds,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            traceId: `trc-${uuidv4()}`
        };
        this.missions.set(mission.id, mission);
        
        this.eventMesh.publish({
            type: "MISSION_CREATED",
            domain: CognitiveDomain.SYSTEM,
            priority: 1,
            source: "HDME",
            payload: { mission }
        });

        return mission;
    }

    startMission(id: string): void {
        const mission = this.missions.get(id);
        if (mission && mission.state === MissionState.CREATED) {
            mission.state = MissionState.EXECUTING;
            mission.updatedAt = Date.now();
            
            this.eventMesh.publish({
                type: "MISSION_STARTED",
                domain: CognitiveDomain.SYSTEM,
                priority: 1,
                source: "HDME",
                payload: { mission }
            });
        }
    }

    completeMission(id: string): void {
        const mission = this.missions.get(id);
        if (mission && mission.state === MissionState.EXECUTING) {
            mission.state = MissionState.COMPLETED;
            mission.updatedAt = Date.now();
            
            this.eventMesh.publish({
                type: "MISSION_COMPLETED",
                domain: CognitiveDomain.SYSTEM,
                priority: 1,
                source: "HDME",
                payload: { mission }
            });
        }
    }
}
