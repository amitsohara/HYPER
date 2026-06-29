import { PrincipleModel } from "./principle_model.js";

export class PrincipleGraph {
    nodes: Map<string, PrincipleModel> = new Map();
    edges: Array<{ source: string, target: string, relationship: string }> = [];

    addPrinciple(principle: PrincipleModel) {
        this.nodes.set(principle.principle_id, principle);
    }
    
    addRelationship(source_id: string, target_id: string, relationship: string) {
        this.edges.push({ source: source_id, target: target_id, relationship });
    }
}
