import { CanonicalWorld, HWMEEntity, HWMERelationship } from "./types.js";

export class SpatialEngine {
    constructor(private canonicalWorld: CanonicalWorld) {}

    public getEntitiesInLocation(locationId: string): HWMEEntity[] {
        return Array.from(this.canonicalWorld.entities.values()).filter(e => 
            e.spatialContext === locationId
        );
    }

    public updateEntityLocation(entityId: string, locationId: string): void {
        const entity = this.canonicalWorld.entities.get(entityId);
        if (entity) {
            entity.spatialContext = locationId;
            entity.updatedAt = Date.now();
        }
    }
}
