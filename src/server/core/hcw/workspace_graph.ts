import { WorkspaceNode, WorkspaceEdge, WorkspaceGraph, NodeType, EdgeType } from "./workspace_types.js";

export class GraphOperations {
    static createEmptyGraph(): WorkspaceGraph {
        return {
            nodes: new Map(),
            edges: new Map()
        };
    }

    static cloneGraph(graph: WorkspaceGraph): WorkspaceGraph {
        const cloned: WorkspaceGraph = {
            nodes: new Map(),
            edges: new Map()
        };
        graph.nodes.forEach((n, k) => cloned.nodes.set(k, { ...n, properties: { ...n.properties }, provenance: [...n.provenance] }));
        graph.edges.forEach((e, k) => cloned.edges.set(k, { ...e, properties: { ...e.properties }, provenance: [...e.provenance] }));
        return cloned;
    }

    static getIncomingEdges(graph: WorkspaceGraph, nodeId: string): WorkspaceEdge[] {
        const incoming: WorkspaceEdge[] = [];
        graph.edges.forEach(e => {
            if (e.target === nodeId) incoming.push(e);
        });
        return incoming;
    }

    static getOutgoingEdges(graph: WorkspaceGraph, nodeId: string): WorkspaceEdge[] {
        const outgoing: WorkspaceEdge[] = [];
        graph.edges.forEach(e => {
            if (e.source === nodeId) outgoing.push(e);
        });
        return outgoing;
    }
}
