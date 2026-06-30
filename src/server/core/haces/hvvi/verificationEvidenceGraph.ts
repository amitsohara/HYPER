export interface EvidenceNode {
    id: string;
    type: 'Requirement' | 'Architecture' | 'EngineeringTask' | 'Implementation' | 'Test' | 'VerificationResult' | 'ApprovalDecision';
    data: any;
}

export interface EvidenceEdge {
    source_id: string;
    target_id: string;
    relationship: string;
}

export class VerificationEvidenceGraph {
    public nodes: EvidenceNode[] = [];
    public edges: EvidenceEdge[] = [];

    public addNode(node: EvidenceNode) {
        if (!this.nodes.find(n => n.id === node.id)) {
            this.nodes.push(node);
        }
    }

    public addEdge(edge: EvidenceEdge) {
        if (!this.edges.find(e => e.source_id === edge.source_id && e.target_id === edge.target_id && e.relationship === edge.relationship)) {
            this.edges.push(edge);
        }
    }

    public getGraph() {
        return {
            nodes: this.nodes,
            edges: this.edges
        };
    }
}
