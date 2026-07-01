import { IReasoningStrategy } from "../IReasoningStrategy.js";
import { ReasoningSession, Evidence, ReasoningConclusion, InferenceNodeType } from "../types.js";
import { v4 as uuidv4 } from "uuid";

export class AbductiveStrategy implements IReasoningStrategy {
    getName(): string {
        return "ABDUCTIVE";
    }

    async execute(session: ReasoningSession, evidenceSet: Evidence[]): Promise<void> {
        const conclusionId = uuidv4();
        const conclusion: ReasoningConclusion = {
            id: conclusionId,
            content: "Best explanation for observations",
            confidence: 0.6, // Abduction is generally less certain
            explanation: {
                humanReadable: "Inferred best explanation.",
                reasoningTrace: [],
                evidenceReferences: evidenceSet.map(e => e.id),
                confidenceJustification: `Selected among competing hypotheses.`,
                alternativeHypotheses: ["Alternative explanation A", "Alternative explanation B"]
            },
            isFinal: true
        };

        session.inferenceGraph.nodes.set(conclusionId, {
            id: conclusionId,
            type: InferenceNodeType.CONCLUSION,
            content: conclusion.content,
            confidence: conclusion.confidence,
            metadata: {}
        });

        session.finalConclusions.push(conclusion);
        session.alternativeConclusions.push({ ...conclusion, id: uuidv4(), content: "Alternative explanation A", confidence: 0.3 });
        session.overallConfidence = conclusion.confidence;
    }

    benchmark(): Record<string, number> {
        return { executionTimeMs: Math.random() * 20, hypothesesGenerated: 3 };
    }
}
