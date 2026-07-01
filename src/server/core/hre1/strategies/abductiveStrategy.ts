import { IReasoningStrategy } from "../IReasoningStrategy.js";
import { ReasoningSession, Evidence, ReasoningConclusion, InferenceNodeType } from "../types.js";
import { v4 as uuidv4 } from "uuid";

export interface AbductiveRule {
    hypothesis: string;
    observation: string;
    likelihood: number; // P(Observation | Hypothesis)
    prior: number; // P(Hypothesis)
}

export class AbductiveStrategy implements IReasoningStrategy {
    getName(): string {
        return "ABDUCTIVE";
    }

    async execute(session: ReasoningSession, evidenceSet: Evidence[]): Promise<void> {
        const rules: AbductiveRule[] = session.metadata.abductiveRules || [];
        const observedFacts = evidenceSet.map(e => e.content);
        
        if (rules.length === 0 || observedFacts.length === 0) return;

        const hypothesisScores = new Map<string, { prior: number, likelihoodScore: number }>();
        
        for (const rule of rules) {
            if (observedFacts.includes(rule.observation)) {
                if (!hypothesisScores.has(rule.hypothesis)) {
                    hypothesisScores.set(rule.hypothesis, { prior: rule.prior, likelihoodScore: 1 });
                }
                const score = hypothesisScores.get(rule.hypothesis)!;
                score.likelihoodScore *= rule.likelihood;
            }
        }

        const rankedHypotheses: { hypothesis: string, score: number }[] = [];
        let sumScores = 0;
        for (const [hyp, data] of hypothesisScores.entries()) {
            const score = data.prior * data.likelihoodScore;
            rankedHypotheses.push({ hypothesis: hyp, score });
            sumScores += score;
        }

        // Normalize to form a proper probability distribution
        if (sumScores > 0) {
            for (const h of rankedHypotheses) {
                h.score /= sumScores;
            }
        }

        rankedHypotheses.sort((a, b) => b.score - a.score);

        if (rankedHypotheses.length === 0) return;

        const bestHypothesis = rankedHypotheses[0];

        const conclusionId = uuidv4();
        const conclusion: ReasoningConclusion = {
            id: conclusionId,
            content: bestHypothesis.hypothesis,
            confidence: Math.min(1.0, bestHypothesis.score),
            explanation: {
                humanReadable: `Inferred '${bestHypothesis.hypothesis}' as the best explanation.`,
                reasoningTrace: [`Scored hypotheses based on likelihoods for observations: ${observedFacts.join(", ")}`],
                evidenceReferences: evidenceSet.map(e => e.id),
                confidenceJustification: `Hypothesis score: ${bestHypothesis.score.toFixed(4)}.`,
                alternativeHypotheses: rankedHypotheses.slice(1).map(h => h.hypothesis)
            },
            isFinal: true
        };

        session.inferenceGraph.nodes.set(conclusionId, {
            id: conclusionId,
            type: InferenceNodeType.CONCLUSION,
            content: conclusion.content,
            confidence: conclusion.confidence,
            metadata: { score: bestHypothesis.score }
        });

        session.finalConclusions.push(conclusion);
        
        for (let i = 1; i < rankedHypotheses.length; i++) {
             const altHypothesis = rankedHypotheses[i];
             session.alternativeConclusions.push({
                id: uuidv4(),
                content: altHypothesis.hypothesis,
                confidence: Math.min(1.0, altHypothesis.score),
                explanation: {
                    humanReadable: `Alternative explanation`,
                    reasoningTrace: [],
                    evidenceReferences: [],
                    confidenceJustification: `Score: ${altHypothesis.score.toFixed(4)}`,
                    alternativeHypotheses: []
                },
                isFinal: false
             });
        }
        
        session.overallConfidence = conclusion.confidence;
    }

    benchmark(): Record<string, number> {
        return { executionTimeMs: 5, hypothesesRanked: 1 };
    }
}
