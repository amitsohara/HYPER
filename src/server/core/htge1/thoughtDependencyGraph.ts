import { ThoughtObject, ThoughtDependencyType } from "./types.js";
import { ThoughtPersistence } from "./thoughtPersistence.js";

export class ThoughtDependencyGraph {
    constructor(private persistence: ThoughtPersistence) {}

    public addDependency(sourceId: string, targetId: string, type: ThoughtDependencyType, evidence: string[] = []): void {
        const source = this.persistence.get(sourceId);
        if (source) {
            source.dependencies.push({ targetId, type, evidence });
            
            if (type === ThoughtDependencyType.CONTRADICTS) {
                source.contradictions.push(targetId);
                const target = this.persistence.get(targetId);
                if (target && !target.contradictions.includes(sourceId)) {
                    target.contradictions.push(sourceId);
                    target.version++;
                }
            }

            source.version++;
            source.updatedAt = Date.now();
        }
    }

    public getDependencies(id: string): ThoughtObject[] {
        const source = this.persistence.get(id);
        if (!source) return [];
        return source.dependencies
            .map(d => this.persistence.get(d.targetId))
            .filter(t => t !== undefined) as ThoughtObject[];
    }
}
