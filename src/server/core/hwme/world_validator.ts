import { WorldModel } from "./world_types.js";

export class WorldValidator {
    static validate(world: WorldModel): { valid: boolean, errors: string[] } {
        const errors: string[] = [];

        // Duplicate entities
        const entityNames = new Set();
        for (const [id, entity] of world.entities) {
            if (entityNames.has(entity.name)) {
                errors.push(`Duplicate entity name: ${entity.name}`);
            }
            entityNames.add(entity.name);
        }

        // Invalid relationships (missing source/target)
        for (const [id, rel] of world.relationships) {
            if (!world.entities.has(rel.source_entity)) {
                errors.push(`Relationship ${id} has unknown source entity: ${rel.source_entity}`);
            }
            if (!world.entities.has(rel.target_entity)) {
                errors.push(`Relationship ${id} has unknown target entity: ${rel.target_entity}`);
            }
        }
        
        // Circular dependencies (basic check)
        // Disconnected systems, missing constraints, unknown entities

        return {
            valid: errors.length === 0,
            errors
        };
    }
}
