import { CanonicalWorld, HWMERelationship } from "./types.js";
import { v4 as uuidv4 } from "uuid";

export class RelationshipEngine {
    constructor(private canonicalWorld: CanonicalWorld) {}

    public createRelationship(data: Omit<HWMERelationship, "id" | "version" | "createdAt" | "updatedAt">): string {
        const id = uuidv4();
        const rel: HWMERelationship = {
            ...data,
            id,
            version: 1,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        this.canonicalWorld.relationships.set(id, rel);
        return id;
    }

    public updateRelationship(id: string, updates: Partial<HWMERelationship>): void {
        const rel = this.canonicalWorld.relationships.get(id);
        if (rel) {
            Object.assign(rel, updates);
            rel.version++;
            rel.updatedAt = Date.now();
        }
    }

    public deleteRelationship(id: string): void {
        this.canonicalWorld.relationships.delete(id);
    }

    public getRelationship(id: string): HWMERelationship | undefined {
        return this.canonicalWorld.relationships.get(id);
    }
    
    public getRelationshipsForEntity(entityId: string): HWMERelationship[] {
        return Array.from(this.canonicalWorld.relationships.values()).filter(r => 
            r.sourceId === entityId || r.targetId === entityId
        );
    }
}
