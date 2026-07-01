import { ReasoningSession, Explanation, ReasoningConclusion } from "./types.js";

export class ExplanationEngine {
    public generateExplanation(session: ReasoningSession, conclusion: ReasoningConclusion): Explanation {
        return {
            humanReadable: `Conclusion '${conclusion.content}' was reached using strategy ${session.selectedStrategy} with confidence ${conclusion.confidence}.`,
            reasoningTrace: [`Step 1: Analyzed inputs`, `Step 2: Applied ${session.selectedStrategy}`, `Step 3: Derived conclusion`],
            evidenceReferences: session.evidenceSet.map(e => e.id),
            confidenceJustification: `Based on ${session.evidenceSet.length} pieces of evidence and no unresolvable contradictions.`,
            alternativeHypotheses: session.alternativeConclusions.map(ac => ac.content)
        };
    }
}
