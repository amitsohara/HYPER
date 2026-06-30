import { EvolutionKnowledgeGraphData, GraphNode, GraphEdge } from "./memoryTypes.js";

export class EvolutionKnowledgeGraph {
    private graph: EvolutionKnowledgeGraphData = {
        nodes: new Map(),
        edges: []
    };

    public addNode(node: GraphNode) {
        if (!this.graph.nodes.has(node.id)) {
            this.graph.nodes.set(node.id, node);
        }
    }

    public addEdge(edge: GraphEdge) {
        const existingEdge = this.graph.edges.find(e => 
            e.source_id === edge.source_id && 
            e.target_id === edge.target_id && 
            e.relationship === edge.relationship
        );
        if (!existingEdge) {
            this.graph.edges.push(edge);
        }
    }

    public getGraphData() {
        return {
            nodes: Array.from(this.graph.nodes.values()),
            edges: this.graph.edges
        };
    }

    public traverse(startNodeId: string, maxDepth: number = 5): GraphNode[] {
        // Simple BFS traversal stub
        const visited = new Set<string>();
        const result: GraphNode[] = [];
        const queue: { id: string, depth: number }[] = [{ id: startNodeId, depth: 0 }];

        while (queue.length > 0) {
            const { id, depth } = queue.shift()!;
            if (!visited.has(id) && depth <= maxDepth) {
                visited.add(id);
                const node = this.graph.nodes.get(id);
                if (node) {
                    result.push(node);
                    const outEdges = this.graph.edges.filter(e => e.source_id === id);
                    for (const edge of outEdges) {
                        queue.push({ id: edge.target_id, depth: depth + 1 });
                    }
                }
            }
        }
        return result;
    }
}
