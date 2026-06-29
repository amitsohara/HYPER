import { CausalGraph, CausalGraphNode, CausalGraphEdge, RootCause, DiagnosticLayer } from "./diagnosticTypes.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class CausalGraphBuilder {
    public build(rootCause: RootCause, contributingFactors: RootCause[], symptoms: string[]): CausalGraph {
        const nodes: CausalGraphNode[] = [];
        const edges: CausalGraphEdge[] = [];

        // Symptom nodes
        const symptomNodes = symptoms.map(s => {
            const id = uuidv4();
            nodes.push({ node_id: id, description: s, layer: DiagnosticLayer.COORDINATION });
            return id;
        });

        // Root cause node
        const rootNodeId = uuidv4();
        nodes.push({
            node_id: rootNodeId,
            description: rootCause.description,
            layer: rootCause.layer
        });

        // Contributing nodes
        const factorIds = contributingFactors.map(f => {
            const id = uuidv4();
            nodes.push({ node_id: id, description: f.description, layer: f.layer });
            return id;
        });

        // Build edges (Root -> Factor -> Symptom)
        for (const factorId of factorIds) {
            edges.push({
                source_id: rootNodeId,
                target_id: factorId,
                relationship: "CAUSES"
            });
            for (const symptomId of symptomNodes) {
                edges.push({
                    source_id: factorId,
                    target_id: symptomId,
                    relationship: "CONTRIBUTES_TO"
                });
            }
        }

        // If no factors, connect root directly to symptoms
        if (factorIds.length === 0) {
            for (const symptomId of symptomNodes) {
                edges.push({
                    source_id: rootNodeId,
                    target_id: symptomId,
                    relationship: "CAUSES"
                });
            }
        }

        return {
            graph_id: uuidv4(),
            nodes,
            edges,
            timestamp: Date.now()
        };
    }
}
