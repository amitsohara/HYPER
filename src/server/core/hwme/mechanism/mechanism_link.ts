import { MechanismLinkType } from "./mechanism_types.js";

export interface MechanismLink {
    link_id: string;
    source_node_id: string;
    target_node_id: string;
    type: MechanismLinkType;
    strength: number;
    description: string;
}
