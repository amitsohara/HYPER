import { InferenceGraph, InferenceNode, InferenceNodeType, InferenceEdge, InferenceEdgeType } from "./types.js";

export class InferenceGraphEngine {
    public createGraph(): InferenceGraph {
        return {
            nodes: new Map(),
            edges: []
        };
    }

    public addNode(graph: InferenceGraph, node: InferenceNode): void {
        graph.nodes.set(node.id, node);
    }

    public addEdge(graph: InferenceGraph, sourceId: string, targetId: string, type: InferenceEdgeType, weight: number = 1.0): void {
        graph.edges.push({ sourceId, targetId, type, weight });
    }

    public getNodesByType(graph: InferenceGraph, type: InferenceNodeType): InferenceNode[] {
        return Array.from(graph.nodes.values()).filter(n => n.type === type);
    }
}
