import { WorldModel } from "./world_types.js";

export class WorldState {
    static createEmptyWorld(): WorldModel {
        return {
            entities: new Map(),
            relationships: new Map(),
            systems: new Map(),
            processes: new Map(),
            constraints: new Map(),
            resources: new Map(),
            environments: new Map(),
            agents: new Map(),
            events: new Map()
        };
    }
}
