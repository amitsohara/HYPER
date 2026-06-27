import { WorkspaceStore } from "./workspace_state.js";
import { WorkspaceWriter } from "./workspace_writer.js";
import { WorkspaceReader } from "./workspace_reader.js";
import { WorkspaceSnapshotManager } from "./workspace_snapshot.js";
import { WorkspaceMetrics } from "./workspace_metrics.js";
import { WorkspaceState, WorkspacePatch, NodeType, EdgeType } from "./workspace_types.js";

export class CognitiveWorkspace {
    static createWorkspace(mission: string, mission_id: string = `mission_${Date.now()}`): string {
        const ws = WorkspaceStore.createWorkspace(mission, mission_id);
        return ws.workspace_id;
    }

    static getWorkspace(workspace_id: string): WorkspaceState | undefined {
        return WorkspaceStore.getWorkspace(workspace_id);
    }

    static updateWorkspace(workspace_id: string, patch: Partial<WorkspacePatch>) {
        return WorkspaceWriter.applyPatch(workspace_id, patch);
    }

    static queryNodes(workspace_id: string, filter: { type?: NodeType, module?: string }) {
        if (filter.type) return WorkspaceReader.getNodesByType(workspace_id, filter.type);
        if (filter.module) return WorkspaceReader.getNodesByModule(workspace_id, filter.module);
        return [];
    }
    
    static queryEdges(workspace_id: string, filter: { type?: EdgeType }) {
        if (filter.type) return WorkspaceReader.getEdgesByType(workspace_id, filter.type);
        return [];
    }

    static getSubgraph(workspace_id: string, node_ids: string[]) {
        return WorkspaceReader.getSubgraph(workspace_id, node_ids);
    }

    static createSnapshot(workspace_id: string, reason: string) {
        const ws = WorkspaceStore.getWorkspace(workspace_id);
        if (!ws) return null;
        return WorkspaceSnapshotManager.createSnapshot(ws, reason);
    }

    static getWorkspaceMetrics(workspace_id: string) {
        const ws = WorkspaceStore.getWorkspace(workspace_id);
        if (!ws) return null;
        return WorkspaceMetrics.getMetrics(ws);
    }
    
    static getAllWorkspaces() {
        return WorkspaceStore.getAllWorkspaces();
    }
}
