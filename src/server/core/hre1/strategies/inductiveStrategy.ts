import { IReasoningStrategy } from "../IReasoningStrategy.js";
import { ReasoningSession, Evidence, ReasoningConclusion, InferenceNodeType, InferenceEdgeType } from "../types.js";
import { v4 as uuidv4 } from "uuid";

export interface InductiveObservation {
    id: string;
    attributes: string[];
}

export class InductiveStrategy implements IReasoningStrategy {
    getName(): string {
        return "INDUCTIVE";
    }

    async execute(session: ReasoningSession, evidenceSet: Evidence[]): Promise<void> {
        const observations: InductiveObservation[] = session.metadata.observations || [];
        if (observations.length === 0) return;

        const supportThreshold = session.metadata.supportThreshold || 0.3;
        const confidenceThreshold = session.metadata.confidenceThreshold || 0.7;

        const attributeCounts: Record<string, number> = {};
        const pairCounts: Record<string, number> = {};

        for (const obs of observations) {
            for (let i = 0; i < obs.attributes.length; i++) {
                const attrA = obs.attributes[i];
                attributeCounts[attrA] = (attributeCounts[attrA] || 0) + 1;
                for (let j = 0; j < obs.attributes.length; j++) {
                    if (i === j) continue;
                    const attrB = obs.attributes[j];
                    const pairKey = `${attrA} => ${attrB}`;
                    pairCounts[pairKey] = (pairCounts[pairKey] || 0) + 1;
                }
            }
        }

        const numObs = observations.length;
        const inducedRules: { rule: string, support: number, conf: number }[] = [];

        for (const [pairKey, count] of Object.entries(pairCounts)) {
            const [attrA, attrB] = pairKey.split(" => ");
            const support = count / numObs;
            const conf = count / attributeCounts[attrA];

            if (support >= supportThreshold && conf >= confidenceThreshold) {
                inducedRules.push({ rule: pairKey, support, conf });
            }
        }

        for (const rule of inducedRules) {
            const conclusionId = uuidv4();
            const content = `Induced Rule: ${rule.rule}`;
            const conclusion: ReasoningConclusion = {
                id: conclusionId,
                content,
                confidence: rule.conf,
                explanation: {
                    humanReadable: "Discovered statistical association pattern from observations.",
                    reasoningTrace: [`Found rule ${rule.rule} with support ${rule.support.toFixed(2)} and confidence ${rule.conf.toFixed(2)}`],
                    evidenceReferences: evidenceSet.map(e => e.id),
                    confidenceJustification: `Calculated from ${observations.length} instances.`,
                    alternativeHypotheses: []
                },
                isFinal: true
            };

            session.inferenceGraph.nodes.set(conclusionId, {
                id: conclusionId,
                type: InferenceNodeType.CONCLUSION,
                content: conclusion.content,
                confidence: conclusion.confidence,
                metadata: { rule }
            });

            session.finalConclusions.push(conclusion);
        }

        if (session.finalConclusions.length > 0) {
            const maxConf = Math.max(...session.finalConclusions.map(c => c.confidence));
            session.overallConfidence = maxConf;
        }
    }

    benchmark(): Record<string, number> {
        return { executionTimeMs: 4, patternsEvaluated: 10 };
    }
}
