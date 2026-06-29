import { DigitalTwin } from "./digitalTwin.js";

export class ObservatoryQueryEngine {
    private twin: DigitalTwin;

    constructor(twin: DigitalTwin) {
        this.twin = twin;
    }

    public executeQuery(queryType: string, params?: any): any {
        const state = this.twin.getState();
        switch (queryType) {
            case "CURRENT_HEALTH":
                return state.health_profile;
            case "CURRENT_BOTTLENECKS":
                return state.active_bottlenecks;
            case "EVOLUTION_READINESS":
                return state.evolution_readiness;
            case "COGNITIVE_GENOME":
                return state.genome;
            case "CAPABILITY_PROFILE":
                return state.capability_profile;
            case "FULL_STATE":
            default:
                return state;
        }
    }
}
