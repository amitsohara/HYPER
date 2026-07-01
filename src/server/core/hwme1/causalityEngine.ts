import { CanonicalWorld, HWMERelationship } from "./types.js";

export class CausalityEngine {
    constructor(private canonicalWorld: CanonicalWorld) {}

    public getCausesFor(entityId: string): HWMERelationship[] {
        return Array.from(this.canonicalWorld.relationships.values()).filter(r => 
            r.targetId === entityId && r.isCausal
        );
    }

    public getEffectsOf(entityId: string): HWMERelationship[] {
        return Array.from(this.canonicalWorld.relationships.values()).filter(r => 
            r.sourceId === entityId && r.isCausal
        );
    }

    public performCounterfactualAnalysis(targetEntityId: string, removeCauseId: string): any {
        // Return a simulated graph of consequences if removeCauseId is removed
        return {
            targetId: targetEntityId,
            hypotheticalState: "CHANGED",
            cascadingEffects: 2
        };
    }
}
