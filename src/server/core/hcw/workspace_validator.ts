import { WorkspacePatch, WorkspaceState } from "./workspace_types.js";

export class WorkspaceValidator {
    static validatePatch(ws: WorkspaceState, patch: WorkspacePatch): { valid: boolean; errors: string[], warnings: string[] } {
        const errors: string[] = [];
        const warnings: string[] = [];

        if (!patch.module_name) errors.push("Patch must identify source module.");
        if (!patch.reason) errors.push("Patch must include a reason.");
        
        if (patch.confidence_delta !== undefined && (!patch.reason || patch.reason.trim() === '')) {
            errors.push("Confidence change must include justification.");
        }

        patch.nodes_added.forEach(n => {
            if (ws.graph.nodes.has(n.id)) errors.push(`Duplicate node addition: ${n.id}`);
            if (!n.type) errors.push(`Node ${n.id} missing type.`);
        });

        patch.edges_added.forEach(e => {
            if (ws.graph.edges.has(e.id)) errors.push(`Duplicate edge addition: ${e.id}`);
            
            // Validate targets
            const sourceExists = ws.graph.nodes.has(e.source) || patch.nodes_added.some(n => n.id === e.source);
            const targetExists = ws.graph.nodes.has(e.target) || patch.nodes_added.some(n => n.id === e.target);
            
            if (!sourceExists) errors.push(`Invalid edge source: ${e.source}`);
            if (!targetExists) errors.push(`Invalid edge target: ${e.target}`);
        });
        
        patch.nodes_added.forEach(n => {
            if (n.type === 'DECISION') {
                // Check if reasoning exists
                const hasReasoning = patch.edges_added.some(e => e.source === n.id || e.target === n.id) || 
                                     Array.from(ws.graph.edges.values()).some(e => e.source === n.id || e.target === n.id);
                // The prompt says validator warning for decision without supporting reasoning
                if (!hasReasoning) {
                    warnings.push(`Decision node ${n.id} added without supporting reasoning edges.`);
                }
            }
        });

        return { valid: errors.length === 0, errors, warnings };
    }
}
