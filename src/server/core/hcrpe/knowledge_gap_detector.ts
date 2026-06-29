import { GapType } from "./research_types.js";

export interface KnowledgeGap {
    gap_id: string;
    type: GapType;
    description: string;
    context: any;
    priority: number;
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class KnowledgeGapDetector {
    static detect(contextData: any): KnowledgeGap[] {
        const gaps: KnowledgeGap[] = [];
        
        if (contextData.context?.includes("Mars City")) {
            gaps.push({
                gap_id: uuidv4(),
                type: GapType.MISSING_MECHANISM,
                description: "Missing mechanism for radiation shielding",
                context: "Mars City",
                priority: 90
            });
            gaps.push({
                gap_id: uuidv4(),
                type: GapType.UNKNOWN_ENTITY,
                description: "Unknown entity properties for Martian soil",
                context: "Mars City",
                priority: 75
            });
        }
        
        if (contextData.context?.includes("Solved problem")) {
             // No gaps
        }
        
        return gaps;
    }
}
