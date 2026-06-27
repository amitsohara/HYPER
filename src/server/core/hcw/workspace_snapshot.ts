import { WorkspaceState, WorkspaceSnapshot } from "./workspace_types.js";
import { GraphOperations } from "./workspace_graph.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class WorkspaceSnapshotManager {
    static createSnapshot(ws: WorkspaceState, reason: string): WorkspaceSnapshot {
        const snapshot: WorkspaceSnapshot = {
            snapshot_id: uuidv4(),
            workspace_id: ws.workspace_id,
            timestamp: Date.now(),
            reason,
            graph: GraphOperations.cloneGraph(ws.graph),
            confidence: ws.confidence,
            uncertainty: ws.uncertainty
        };
        ws.snapshots.push(snapshot);
        return snapshot;
    }
}
