import { CausalNode, CausalEdge } from "./abstraction_types.js";

export class CausalGraph {
    nodes: Map<string, CausalNode>;
    edges: CausalEdge[];

    constructor(nodes: CausalNode[] = [], edges: CausalEdge[] = []) {
        this.nodes = new Map(nodes.map(n => [n.id, n]));
        this.edges = [...edges];
    }

    addNode(node: CausalNode) {
        this.nodes.set(node.id, node);
    }

    addEdge(edge: CausalEdge) {
        this.edges.push(edge);
    }

    getIncomingEdges(nodeId: string): CausalEdge[] {
        return this.edges.filter(e => e.target === nodeId);
    }

    getOutgoingEdges(nodeId: string): CausalEdge[] {
        return this.edges.filter(e => e.source === nodeId);
    }

    getRootCauses(): string[] {
        // Nodes with no incoming edges or only bidirectional
        const nodesWithIncoming = new Set(
            this.edges.filter(e => e.direction !== 'bidirectional').map(e => e.target)
        );
        return Array.from(this.nodes.keys()).filter(id => !nodesWithIncoming.has(id));
    }
}
