import { MechanismNode } from "./mechanism_node.js";
import { MechanismLink } from "./mechanism_link.js";

export class MechanismGraph {
    nodes: Map<string, MechanismNode> = new Map();
    links: Map<string, MechanismLink> = new Map();

    addNode(node: MechanismNode) {
        this.nodes.set(node.node_id, node);
    }

    addLink(link: MechanismLink) {
        this.links.set(link.link_id, link);
    }
}
