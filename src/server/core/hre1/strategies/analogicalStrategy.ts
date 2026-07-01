import { IReasoningStrategy } from "../IReasoningStrategy.js";
import { ReasoningSession, Evidence, ReasoningConclusion, InferenceNodeType } from "../types.js";
import { v4 as uuidv4 } from "uuid";

export interface ConceptStructure {
    name: string;
    properties: Record<string, any>;
    relations: Array<{ type: string, target: string }>;
}

export class AnalogicalStrategy implements IReasoningStrategy {
    getName(): string { return "ANALOGICAL"; }

    private calculateSimilarity(source: ConceptStructure, target: ConceptStructure): number {
        const sourceKeys = Object.keys(source.properties);
        const targetKeys = Object.keys(target.properties);
        
        const commonKeys = sourceKeys.filter(k => targetKeys.includes(k));
        let matchScore = 0;
        
        for (const key of commonKeys) {
            if (source.properties[key] === target.properties[key]) {
                matchScore++;
            }
        }

        const totalUniqueKeys = new Set([...sourceKeys, ...targetKeys]).size;
        if (totalUniqueKeys === 0) return 0;
        return matchScore / totalUniqueKeys;
    }

    async execute(session: ReasoningSession, evidenceSet: Evidence[]): Promise<void> {
        const sourceConcept: ConceptStructure = session.metadata.sourceConcept;
        const targetConcept: ConceptStructure = session.metadata.targetConcept;

        if (!sourceConcept || !targetConcept) return;

        const similarity = this.calculateSimilarity(sourceConcept, targetConcept);

        if (similarity > 0.5) { 
            const conclusionId = uuidv4();
            const content = `${targetConcept.name} is analogous to ${sourceConcept.name} with similarity ${similarity.toFixed(2)}`;
            const conclusion: ReasoningConclusion = {
                id: conclusionId,
                content,
                confidence: similarity,
                explanation: {
                    humanReadable: "Concepts share significant structural properties.",
                    reasoningTrace: [`Compared properties of ${sourceConcept.name} and ${targetConcept.name}`],
                    evidenceReferences: evidenceSet.map(e => e.id),
                    confidenceJustification: `Jaccard-like similarity score: ${similarity.toFixed(2)}`,
                    alternativeHypotheses: []
                },
                isFinal: true
            };
            session.inferenceGraph.nodes.set(conclusionId, {
                id: conclusionId,
                type: InferenceNodeType.CONCLUSION,
                content,
                confidence: similarity,
                metadata: { similarity }
            });
            session.finalConclusions.push(conclusion);
            session.overallConfidence = Math.max(session.overallConfidence || 0, similarity);
        }
    }

    benchmark(): Record<string, number> { return { executionTimeMs: 4 }; }
}
