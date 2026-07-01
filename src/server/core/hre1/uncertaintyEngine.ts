import { ReasoningSession } from "./types.js";

export class UncertaintyEngine {
    public quantifyUncertainty(session: ReasoningSession): number {
        // A simple metric: 1.0 - overall confidence, modified by number of alternative conclusions
        const baseUncertainty = 1.0 - session.overallConfidence;
        const alternativesFactor = (session.alternativeConclusions.length * 0.1);
        return Math.min(1.0, Math.max(0.0, baseUncertainty + alternativesFactor));
    }
}
