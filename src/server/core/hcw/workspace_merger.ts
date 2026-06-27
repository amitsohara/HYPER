import { WorkspaceState, WorkspacePatch, WorkspaceNode, WorkspaceEdge } from "./workspace_types.js";

export class WorkspaceMerger {
    static applyPatch(ws: WorkspaceState, patch: WorkspacePatch) {
        // Record provenance
        if (!ws.modules_contributed.includes(patch.module_name)) {
            ws.modules_contributed.push(patch.module_name);
        }

        patch.nodes_added.forEach(n => {
            // Check for exact duplicate logic (e.g. same label and type)
            let existingNode = Array.from(ws.graph.nodes.values()).find(en => en.type === n.type && en.label === n.label);
            
            if (existingNode) {
                // Merge duplicate node
                if (!existingNode.provenance.includes(patch.module_name)) {
                    existingNode.provenance.push(patch.module_name);
                }
                existingNode.confidence = Math.max(existingNode.confidence, n.confidence);
                existingNode.updated_at = Date.now();
                // We'll update the patch to affect the existing node instead of adding a new one
                // For a robust system, we would map the new ID to the existing ID in edges too.
                // For simplicity here, we overwrite properties.
            } else {
                ws.graph.nodes.set(n.id, n);
            }
        });

        patch.nodes_updated.forEach(n => {
            if (ws.graph.nodes.has(n.id)) {
                const existing = ws.graph.nodes.get(n.id)!;
                Object.assign(existing.properties, n.properties);
                existing.confidence = n.confidence;
                existing.updated_at = Date.now();
                if (!existing.provenance.includes(patch.module_name)) existing.provenance.push(patch.module_name);
            }
        });

        patch.nodes_removed.forEach(id => {
            ws.graph.nodes.delete(id);
            // Also remove connected edges
            for (const [eId, e] of ws.graph.edges.entries()) {
                if (e.source === id || e.target === id) {
                    ws.graph.edges.delete(eId);
                }
            }
        });

        patch.edges_added.forEach(e => {
            let existingEdge = Array.from(ws.graph.edges.values()).find(ex => ex.source === e.source && ex.target === e.target && ex.type === e.type);
            if (existingEdge) {
                if (!existingEdge.provenance.includes(patch.module_name)) {
                    existingEdge.provenance.push(patch.module_name);
                }
                existingEdge.confidence = Math.max(existingEdge.confidence, e.confidence);
                existingEdge.updated_at = Date.now();
            } else {
                ws.graph.edges.set(e.id, e);
            }
        });

        patch.edges_updated.forEach(e => {
             if (ws.graph.edges.has(e.id)) {
                const existing = ws.graph.edges.get(e.id)!;
                Object.assign(existing.properties, e.properties);
                existing.confidence = e.confidence;
                existing.updated_at = Date.now();
                if (!existing.provenance.includes(patch.module_name)) existing.provenance.push(patch.module_name);
            }
        });

        patch.edges_removed.forEach(id => {
            ws.graph.edges.delete(id);
        });
        
        if (patch.confidence_delta !== undefined) {
            ws.confidence = Math.max(0, Math.min(100, ws.confidence + patch.confidence_delta));
        }
        
        if (patch.uncertainty_delta !== undefined) {
            ws.uncertainty = Math.max(0, Math.min(100, ws.uncertainty + patch.uncertainty_delta));
        }

        ws.patches.push(patch);
        ws.events.push({
            type: 'PATCH_APPLIED',
            patch_id: patch.patch_id,
            module: patch.module_name,
            timestamp: Date.now()
        });
    }
}
