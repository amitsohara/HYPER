import { UnifiedObservation } from "../types.js";
import { HyperMindEventMesh } from "../../hcns01/eventMesh.js";

export class EnvironmentInterpreter {
    constructor(private eventMesh: HyperMindEventMesh) {}

    interpret(unifiedObs: UnifiedObservation, missionId: string = "sys-mission", directive: string = ""): void {
        this.eventMesh.publish({
            type: "WORLD_OBSERVATION",
            domain: 9 as any,
            priority: 1,
            source: "HPAE_ENVIRONMENT_INTERPRETER",
            payload: { ...unifiedObs, missionId, missionDirective: directive, entity: { name: "User Request", type: "MISSION_DIRECTIVE" } }
        });
    }
}
