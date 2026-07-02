import { DecisionOption, DecisionContext, Decision } from "../types.js";
import { v4 as uuidv4 } from "uuid";

export class DecisionFusionEngine {
    fuse(planEvaluatedPayload: any, context: DecisionContext): Decision {
        const options: DecisionOption[] = [];
        
        // Assuming payload has planId and outcomes (from HSTE)
        const option: DecisionOption = {
            id: `opt-${uuidv4()}`,
            planId: planEvaluatedPayload.planId,
            predictedOutcomes: planEvaluatedPayload.outcomes || [],
            confidence: {
                score: 0.8, // Default confidence, in reality would aggregate
                sources: [{ sourceId: "HSTE", confidence: 0.8 }]
            }
        };
        options.push(option);

        return {
            id: `dec-${uuidv4()}`,
            context,
            options,
            status: "PENDING" as any,
            traceId: `trc-${uuidv4()}`,
            timestamp: Date.now()
        };
    }
}
