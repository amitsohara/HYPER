import { CapabilityGraph } from "./capabilityGraph.js";

export class DependencyAnalyzer {
    private graph: CapabilityGraph;

    constructor(graph: CapabilityGraph) {
        this.graph = graph;
    }

    public analyzeDependencies(proposalDependencies: string[]): { valid: boolean; conflicts: number } {
        let conflicts = 0;
        
        for (const depId of proposalDependencies) {
            const deps = this.graph.getDependencies(depId);
            for (const d of deps) {
                if (d.relationship === "CONFLICTS_WITH") {
                    conflicts++;
                }
            }
        }
        
        return {
            valid: conflicts === 0,
            conflicts
        };
    }
}
