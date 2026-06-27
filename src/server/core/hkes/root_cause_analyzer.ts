import { CausalNode, CausalEdge } from "./abstraction_types.js";
import { CausalGraph } from "./causal_graph.js";

export class RootCauseAnalyzer {
    static analyze(graph: CausalGraph): { root_causes: string[], mediators: string[], outcomes: string[] } {
        const nodes = Array.from(graph.nodes.keys());
        const root_causes = graph.getRootCauses();
        
        const outcomes = nodes.filter(id => {
            const outgoing = graph.getOutgoingEdges(id);
            return outgoing.length === 0 || outgoing.every(e => e.direction === 'bidirectional');
        });

        const mediators = nodes.filter(id => !root_causes.includes(id) && !outcomes.includes(id));

        return {
            root_causes,
            mediators,
            outcomes
        };
    }
}
