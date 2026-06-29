import { WorldModel } from "./world_types.js";

export class WorldMetrics {
    static getMetrics(world: WorldModel) {
        return {
            entity_count: world.entities.size,
            relationship_count: world.relationships.size,
            system_count: world.systems.size,
            process_count: world.processes.size,
            constraint_count: world.constraints.size,
            resource_count: world.resources.size,
            environment_count: world.environments.size,
            agent_count: world.agents.size,
            event_count: world.events.size
        };
    }
}
