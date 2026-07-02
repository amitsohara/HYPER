import { UnifiedObservation } from "../types.js";
import { HyperMindEventMesh } from "../../hcns01/eventMesh.js";

export class EnvironmentInterpreter {
    constructor(private eventMesh: HyperMindEventMesh) {}

    interpret(unifiedObs: UnifiedObservation): void {
        this.eventMesh.publish({
            type: "WORLD_OBSERVATION",
            domain: 9 as any,
            priority: 1,
            source: "HPAE_ENVIRONMENT_INTERPRETER",
            payload: unifiedObs
        });
    }
}
