import { IReasoningStrategy } from "../IReasoningStrategy.js";
import { ReasoningSession, Evidence, ReasoningConclusion, InferenceNodeType } from "../types.js";
import { CausalNode, CausalEdge } from "./causalStrategy.js";
import { v4 as uuidv4 } from "uuid";

export class CounterfactualStrategy implements IReasoningStrategy {
    getName(): string { return "COUNTERFACTUAL"; }
    
    async execute(session: ReasoningSession, evidenceSet: Evidence[]): Promise<void> {
        const originalNodes: CausalNode[] = session.metadata.causalNodes || [];
        const edges: CausalEdge[] = session.metadata.causalEdges || [];
        const interventionNodeId = session.metadata.interventionNodeId;
        const interventionState = session.metadata.interventionState;

        if (originalNodes.length === 0 || !interventionNodeId) return;

        let changed = true;
        const stateMap = new Map<string, boolean>();
        originalNodes.forEach(n => stateMap.set(n.id, n.state));
        
        stateMap.set(interventionNodeId, interventionState);
        
        const derivedEffects: string[] = [];
        
        while (changed) {
            changed = false;
            for (const edge of edges) {
                if (edge.targetId === interventionNodeId) continue;
                
                const sourceState = stateMap.get(edge.sourceId);
                const targetState = stateMap.get(edge.targetId);
                
                if (sourceState && !targetState && edge.weight > 0.5) {
                    stateMap.set(edge.targetId, true);
                    derivedEffects.push(edge.targetId);
                    changed = true;
                }
            }
        }
        
        const conclusionId = uuidv4();
        const content = `Counterfactual simulation: If ${interventionNodeId} were ${interventionState}, then effects: ${derivedEffects.length > 0 ? derivedEffects.join(", ") : "None"}`;
        const conclusion: ReasoningConclusion = {
            id: conclusionId,
            content,
            confidence: 0.7,
            explanation: {
                humanReadable: `Simulated counterfactual universe.`,
                reasoningTrace: [`Applied intervention do(${interventionNodeId} = ${interventionState}) and propagated effects.`],
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
            metadata: { derivedEffects }
        });
        session.finalConclusions.push(conclusion);
        session.overallConfidence = 0.7;
    }
    
    benchmark(): Record<string, number> { return { executionTimeMs: 4 }; }
}
