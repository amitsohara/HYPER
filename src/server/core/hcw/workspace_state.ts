import { WorkspaceState } from "./workspace_types.js";
import { GraphOperations } from "./workspace_graph.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class WorkspaceStore {
    private static workspaces: Map<string, WorkspaceState> = new Map();

    static createWorkspace(mission: string, mission_id: string): WorkspaceState {
        const ws: WorkspaceState = {
            workspace_id: uuidv4(),
            mission_id,
            mission,
            created_at: Date.now(),
            updated_at: Date.now(),
            status: 'active',
            graph: GraphOperations.createEmptyGraph(),
            world_state: {},
            imagined_world: {},
            simulation_state: {},
            discovery_state: {},
            active_focus: 'mission_understanding',
            attention_weights: {},
            confidence: 50,
            uncertainty: 50,
            modules_contributed: [],
            events: [],
            snapshots: [],
            patches: [],
            version: 1
        };
        this.workspaces.set(ws.workspace_id, ws);
        return ws;
    }

    static getWorkspace(workspace_id: string): WorkspaceState | undefined {
        return this.workspaces.get(workspace_id);
    }
    
    static getAllWorkspaces(): WorkspaceState[] {
        return Array.from(this.workspaces.values());
    }

    static updateWorkspace(workspace_id: string, updateFn: (ws: WorkspaceState) => void): boolean {
        const ws = this.workspaces.get(workspace_id);
        if (!ws) return false;
        updateFn(ws);
        ws.updated_at = Date.now();
        ws.version += 1;
        return true;
    }
}
