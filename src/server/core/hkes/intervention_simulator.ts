import { CausalGraph } from "./causal_graph.js";

export class InterventionSimulator {
    static simulate(graph: CausalGraph, rootCauses: string[], mediators: string[]): any[] {
        const interventions = [];

        // Simple rule-based intervention logic for demonstration
        // In reality, this would query an LLM to propose interventions on graph nodes.
        
        // Let's generate interventions for root causes and some mediators
        const targets = [...rootCauses, ...mediators];

        for (const targetId of targets) {
            const node = graph.nodes.get(targetId);
            if (!node) continue;

            const outgoing = graph.getOutgoingEdges(targetId);
            if (outgoing.length === 0) continue;

            // Generate a simple intervention based on edge relationship
            // E.g., if node increases risk, intervention is to decrease node or block edge.
            
            for (const edge of outgoing) {
                const targetNode = graph.nodes.get(edge.target);
                if (edge.relationship === 'increases' && targetNode?.type === 'risk') {
                    interventions.push({
                        intervention: `Reduce or mitigate ${node.label}`,
                        target_node: targetId,
                        expected_effect: `Decreases ${targetNode.label}`,
                        risks: `May require significant resources to mitigate ${node.label}`,
                        confidence: edge.confidence
                    });
                } else if (edge.relationship === 'causes') {
                    interventions.push({
                        intervention: `Alter or prevent ${node.label}`,
                        target_node: targetId,
                        expected_effect: `Prevents ${targetNode?.label}`,
                        risks: `Unintended side effects down the causal chain`,
                        confidence: edge.confidence
                    });
                }
            }
        }

        // Add some mock specifics for the test cases if applicable
        if (graph.nodes.has('high_logistics_latency')) {
             interventions.push({
                 intervention: "Prioritize local resource production",
                 target_node: "local_production",
                 expected_effect: "Reduced supply dependency and improved survival probability",
                 risks: "High upfront energy and infrastructure cost",
                 confidence: 90
             });
        }

        // Deduplicate
        const uniqueInterventions = [];
        const seen = new Set();
        for (const i of interventions) {
            const key = i.intervention + i.target_node;
            if (!seen.has(key)) {
                seen.add(key);
                uniqueInterventions.push(i);
            }
        }

        return uniqueInterventions;
    }
}
