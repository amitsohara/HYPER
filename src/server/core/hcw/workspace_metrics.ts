import { WorkspaceState } from "./workspace_types.js";

export class WorkspaceMetrics {
    static getMetrics(ws: WorkspaceState) {
        const nodeTypeCounts: Record<string, number> = {};
        ws.graph.nodes.forEach(n => {
            nodeTypeCounts[n.type] = (nodeTypeCounts[n.type] || 0) + 1;
        });
        
        const edgeTypeCounts: Record<string, number> = {};
        ws.graph.edges.forEach(e => {
            edgeTypeCounts[e.type] = (edgeTypeCounts[e.type] || 0) + 1;
        });

        return {
            total_nodes: ws.graph.nodes.size,
            total_edges: ws.graph.edges.size,
            total_patches: ws.patches.length,
            total_snapshots: ws.snapshots.length,
            confidence: ws.confidence,
            uncertainty: ws.uncertainty,
            modules_contributed: ws.modules_contributed,
            node_type_counts: nodeTypeCounts,
            edge_type_counts: edgeTypeCounts
        };
    }
}
