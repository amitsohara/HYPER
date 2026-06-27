import { WorkspaceState, WorkspacePatch } from "./workspace_types.js";
import { WorkspaceValidator } from "./workspace_validator.js";
import { WorkspaceMerger } from "./workspace_merger.js";
import { WorkspaceStore } from "./workspace_state.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class WorkspaceWriter {
    static applyPatch(workspace_id: string, partialPatch: Partial<WorkspacePatch>): { success: boolean, patch_id?: string, errors?: string[], warnings?: string[] } {
        const ws = WorkspaceStore.getWorkspace(workspace_id);
        if (!ws) return { success: false, errors: ["Workspace not found"] };

        const patch: WorkspacePatch = {
            patch_id: uuidv4(),
            workspace_id,
            module_name: partialPatch.module_name || 'UNKNOWN',
            step_name: partialPatch.step_name || 'UNKNOWN',
            timestamp: Date.now(),
            nodes_added: partialPatch.nodes_added || [],
            nodes_updated: partialPatch.nodes_updated || [],
            nodes_removed: partialPatch.nodes_removed || [],
            edges_added: partialPatch.edges_added || [],
            edges_updated: partialPatch.edges_updated || [],
            edges_removed: partialPatch.edges_removed || [],
            confidence_delta: partialPatch.confidence_delta,
            uncertainty_delta: partialPatch.uncertainty_delta,
            affected_nodes: partialPatch.affected_nodes || [],
            affected_edges: partialPatch.affected_edges || [],
            reason: partialPatch.reason || ''
        };

        const validation = WorkspaceValidator.validatePatch(ws, patch);
        
        if (!validation.valid) {
            return { success: false, errors: validation.errors, warnings: validation.warnings };
        }

        WorkspaceStore.updateWorkspace(workspace_id, (workspace) => {
            WorkspaceMerger.applyPatch(workspace, patch);
        });

        return { success: true, patch_id: patch.patch_id, warnings: validation.warnings };
    }
}
