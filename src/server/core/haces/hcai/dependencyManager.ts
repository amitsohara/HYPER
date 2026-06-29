import { DependencyGraph } from "./architectureTypes.js";
import { ArchitectureEventBus, ArchitectureEvents } from "./architectureEvents.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class DependencyManager {
    private graph: DependencyGraph = {
        graph_id: uuidv4(),
        nodes: [],
        edges: [],
        version_compatibility: {}
    };
    private eventBus = ArchitectureEventBus.getInstance();

    public addNode(node: string) {
        if (!this.graph.nodes.includes(node)) {
            this.graph.nodes.push(node);
        }
    }

    public addEdge(source: string, target: string, type: "REQUIRED" | "OPTIONAL" | "CONFLICT") {
        this.graph.edges.push({ source, target, type });
        this.eventBus.publish(ArchitectureEvents.DEPENDENCY_UPDATED, { edge: { source, target, type } });
    }

    public getGraph(): DependencyGraph {
        return this.graph;
    }
}
