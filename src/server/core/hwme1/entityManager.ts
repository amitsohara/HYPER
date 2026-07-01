import { CanonicalWorld, HWMEEntity } from "./types.js";
import { v4 as uuidv4 } from "uuid";

export class EntityManager {
    constructor(private canonicalWorld: CanonicalWorld) {}

    public createEntity(data: Omit<HWMEEntity, "id" | "version" | "createdAt" | "updatedAt">): string {
        const id = uuidv4();
        const entity: HWMEEntity = {
            ...data,
            id,
            version: 1,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        this.canonicalWorld.entities.set(id, entity);
        return id;
    }

    public updateEntity(id: string, updates: Partial<HWMEEntity>): void {
        const entity = this.canonicalWorld.entities.get(id);
        if (entity) {
            Object.assign(entity, updates);
            entity.version++;
            entity.updatedAt = Date.now();
        }
    }

    public deleteEntity(id: string): void {
        this.canonicalWorld.entities.delete(id);
    }

    public getEntity(id: string): HWMEEntity | undefined {
        return this.canonicalWorld.entities.get(id);
    }

    public queryEntities(filter: (entity: HWMEEntity) => boolean): HWMEEntity[] {
        return Array.from(this.canonicalWorld.entities.values()).filter(filter);
    }
}
