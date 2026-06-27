import { WorkspaceState, WorkspaceNode, WorkspaceEdge, NodeType, EdgeType } from "./workspace_types.js";
import { WorkspaceStore } from "./workspace_state.js";

export class WorkspaceReader {
    static getNodesByType(workspace_id: string, type: NodeType): WorkspaceNode[] {
        const ws = WorkspaceStore.getWorkspace(workspace_id);
        if (!ws) return [];
        return Array.from(ws.graph.nodes.values()).filter(n => n.type === type);
    }
    
    static getNodesByModule(workspace_id: string, module_name: string): WorkspaceNode[] {
        const ws = WorkspaceStore.getWorkspace(workspace_id);
        if (!ws) return [];
        return Array.from(ws.graph.nodes.values()).filter(n => n.provenance.includes(module_name));
    }
    
    static getEdgesByType(workspace_id: string, type: EdgeType): WorkspaceEdge[] {
        const ws = WorkspaceStore.getWorkspace(workspace_id);
        if (!ws) return [];
        return Array.from(ws.graph.edges.values()).filter(e => e.type === type);
    }
    
    static getSubgraph(workspace_id: string, node_ids: string[]): { nodes: WorkspaceNode[], edges: WorkspaceEdge[] } {
        const ws = WorkspaceStore.getWorkspace(workspace_id);
        if (!ws) return { nodes: [], edges: [] };
        
        const nodes = node_ids.map(id => ws.graph.nodes.get(id)).filter(Boolean) as WorkspaceNode[];
        const nodeSet = new Set(node_ids);
        const edges = Array.from(ws.graph.edges.values()).filter(e => nodeSet.has(e.source) && nodeSet.has(e.target));
        
        return { nodes, edges };
    }
}
