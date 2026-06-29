export class EngineeringKnowledgeGraph {
    private nodes: Map<string, any> = new Map();
    private edges: Array<{ source: string; target: string; relation: string }> = [];

    public addNode(id: string, type: string, data: any) {
        this.nodes.set(id, { type, data });
    }

    public addEdge(source: string, target: string, relation: string) {
        this.edges.push({ source, target, relation });
    }

    public getGraph() {
        return {
            nodes: Array.from(this.nodes.entries()).map(([id, n]) => ({ id, ...n })),
            edges: this.edges
        };
    }
}
