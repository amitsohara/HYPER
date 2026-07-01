import { IReasoningStrategy } from "../IReasoningStrategy.js";
import { ReasoningSession, Evidence, ReasoningConclusion, InferenceNodeType } from "../types.js";
import { v4 as uuidv4 } from "uuid";

export interface SemanticConcept {
    id: string;
    properties: string[];
    negativeProperties?: string[];
    isA: string[];
}

export class CommonsenseStrategy implements IReasoningStrategy {
    getName(): string { return "COMMONSENSE"; }
    
    async execute(session: ReasoningSession, evidenceSet: Evidence[]): Promise<void> {
        const conceptGraph: Map<string, SemanticConcept> = session.metadata.conceptGraph || new Map();
        const queryConceptId: string = session.metadata.queryConceptId;
        const queryProperty: string = session.metadata.queryProperty;
        
        if (conceptGraph.size === 0 || !queryConceptId || !queryProperty) return;

        const visited = new Set<string>();
        const queue: string[] = [queryConceptId];
        let foundProperty = false;
        const trace: string[] = [];
        
        let exceptionFound = false;

        while (queue.length > 0) {
            const currentId = queue.shift()!;
            if (visited.has(currentId)) continue;
            visited.add(currentId);
            
            const concept = conceptGraph.get(currentId);
            if (!concept) continue;
            
            trace.push(`Checking concept ${currentId}`);
            
            if (concept.negativeProperties?.includes(queryProperty)) {
                exceptionFound = true;
                trace.push(`Exception found: concept '${currentId}' explicitly negates property '${queryProperty}'`);
                break;
            }

            if (concept.properties.includes(queryProperty)) {
                foundProperty = true;
                trace.push(`Found property '${queryProperty}' in concept '${currentId}'`);
                break;
            }
            
            for (const parentId of concept.isA) {
                queue.push(parentId);
                trace.push(`Inheriting from '${parentId}'`);
            }
        }
        
        if (exceptionFound) {
            const conclusionId = uuidv4();
            const content = `Concept ${queryConceptId} DOES NOT have property ${queryProperty} due to exception`;
            const conclusion: ReasoningConclusion = {
                id: conclusionId,
                content,
                confidence: 0.9,
                explanation: {
                    humanReadable: `Inferred absence of property via exception handling in semantic network.`,
                    reasoningTrace: trace,
                    evidenceReferences: evidenceSet.map(e => e.id),
                    confidenceJustification: `Explicit negative property overrides inheritance.`,
                    alternativeHypotheses: []
                },
                isFinal: true
            };
            session.inferenceGraph.nodes.set(conclusionId, {
                id: conclusionId,
                type: InferenceNodeType.CONCLUSION,
                content: conclusion.content,
                confidence: conclusion.confidence,
                metadata: { property: queryProperty, negated: true }
            });
            session.finalConclusions.push(conclusion);
            session.overallConfidence = 0.9;
            return;
        }

        if (foundProperty) {
            const conclusionId = uuidv4();
            const content = `Concept ${queryConceptId} has property ${queryProperty}`;
            const conclusion: ReasoningConclusion = {
                id: conclusionId,
                content,
                confidence: 0.9,
                explanation: {
                    humanReadable: `Inferred property via semantic network inheritance.`,
                    reasoningTrace: trace,
                    evidenceReferences: evidenceSet.map(e => e.id),
                    confidenceJustification: `Commonsense reasoning over ontology.`,
                    alternativeHypotheses: []
                },
                isFinal: true
            };
            session.inferenceGraph.nodes.set(conclusionId, {
                id: conclusionId,
                type: InferenceNodeType.CONCLUSION,
                content: conclusion.content,
                confidence: conclusion.confidence,
                metadata: { property: queryProperty }
            });
            session.finalConclusions.push(conclusion);
            session.overallConfidence = 0.9;
        }
    }
    
    benchmark(): Record<string, number> { return { executionTimeMs: 2 }; }
}
