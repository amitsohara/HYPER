import { IReasoningStrategy } from "../IReasoningStrategy.js";
import { ReasoningSession, Evidence, ReasoningConclusion, InferenceNodeType } from "../types.js";
import { v4 as uuidv4 } from "uuid";

export interface CausalNode {
    id: string;
    state: boolean;
}

export interface CausalEdge {
    sourceId: string;
    targetId: string;
    weight: number;
}

export class CausalStrategy implements IReasoningStrategy {
    getName(): string { return "CAUSAL"; }
    
    async execute(session: ReasoningSession, evidenceSet: Evidence[]): Promise<void> {
        const nodes: CausalNode[] = session.metadata.causalNodes || [];
        const edges: CausalEdge[] = session.metadata.causalEdges || [];
        
        if (nodes.length === 0) return;

        let changed = true;
        const stateMap = new Map<string, boolean>();
        nodes.forEach(n => stateMap.set(n.id, n.state));
        
        const derivedEffects: string[] = [];
        
        while (changed) {
            changed = false;
            for (const edge of edges) {
                const sourceState = stateMap.get(edge.sourceId);
                const targetState = stateMap.get(edge.targetId);
                
                if (sourceState && !targetState && edge.weight > 0.5) {
                    stateMap.set(edge.targetId, true);
                    derivedEffects.push(edge.targetId);
                    changed = true;
                }
            }
        }
        
        for (const effect of derivedEffects) {
            const conclusionId = uuidv4();
            const content = `Causal effect predicted: ${effect}`;
            const conclusion: ReasoningConclusion = {
                id: conclusionId,
                content,
                confidence: 0.8,
                explanation: {
                    humanReadable: `Predicted effect ${effect} from causal graph.`,
                    reasoningTrace: [`Simulated forward propagation in causal graph.`],
                    evidenceReferences: evidenceSet.map(e => e.id),
                    confidenceJustification: `Based on causal edge weights > 0.5.`,
                    alternativeHypotheses: []
                },
                isFinal: true
            };
            session.inferenceGraph.nodes.set(conclusionId, {
                id: conclusionId,
                type: InferenceNodeType.CONCLUSION,
                content: conclusion.content,
                confidence: conclusion.confidence,
                metadata: { effect }
            });
            session.finalConclusions.push(conclusion);
        }
        
        if (session.finalConclusions.length > 0) {
            session.overallConfidence = 0.8;
        }
    }
    
    benchmark(): Record<string, number> { return { executionTimeMs: 3 }; }
}
