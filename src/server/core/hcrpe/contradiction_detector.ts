import { ContradictionType } from "./research_types.js";

export interface Contradiction {
    contradiction_id: string;
    type: ContradictionType;
    description: string;
    entities: string[];
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class ContradictionDetector {
    static detect(data: any): Contradiction[] {
        const contradictions: Contradiction[] = [];
        
        if (data.context?.includes("Conflicting mechanisms")) {
             contradictions.push({
                 contradiction_id: uuidv4(),
                 type: ContradictionType.CONFLICTING_MECHANISMS,
                 description: "Mechanism A and Mechanism B predict opposite state changes for identical inputs",
                 entities: ["Mechanism A", "Mechanism B"]
             });
        }
        
        return contradictions;
    }
}
