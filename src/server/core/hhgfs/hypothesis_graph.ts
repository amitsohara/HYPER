import { HypothesisModel } from "./hypothesis_model.js";

export class HypothesisGraph {
    nodes: Map<string, HypothesisModel> = new Map();
    edges: Array<{ source: string, target: string, relationship: string }> = [];

    addNode(hypothesis: HypothesisModel) {
        this.nodes.set(hypothesis.hypothesis_id, hypothesis);
    }
    
    addRelationship(source_id: string, target_id: string, relationship: string) {
        this.edges.push({ source: source_id, target: target_id, relationship });
    }
}
