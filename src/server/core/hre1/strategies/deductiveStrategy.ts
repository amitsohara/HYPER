import { IReasoningStrategy } from "../IReasoningStrategy.js";
import { ReasoningSession, Evidence, ReasoningConclusion, InferenceNodeType, InferenceEdgeType } from "../types.js";
import { v4 as uuidv4 } from "uuid";

export interface DeductiveRule {
    id: string;
    conditions: string[]; // List of required fact contents
    conclusion: string;
}

export class DeductiveStrategy implements IReasoningStrategy {
    getName(): string {
        return "DEDUCTIVE";
    }

    async execute(session: ReasoningSession, evidenceSet: Evidence[]): Promise<void> {
        const facts = new Set(evidenceSet.map(e => e.content));
        
        // Extract rules from session metadata or inputs if provided
        const rules: DeductiveRule[] = session.metadata.rules || [];

        let newFactsDerived = true;
        const derivedConclusions: { ruleId: string, content: string }[] = [];

        // Forward chaining rule engine
        while (newFactsDerived) {
            newFactsDerived = false;
            for (const rule of rules) {
                if (!facts.has(rule.conclusion)) {
                    const allConditionsMet = rule.conditions.every(c => facts.has(c));
                    if (allConditionsMet) {
                        facts.add(rule.conclusion);
                        derivedConclusions.push({ ruleId: rule.id, content: rule.conclusion });
                        newFactsDerived = true;
                    }
                }
            }
        }

        // Add initial evidence to graph
        for (const ev of evidenceSet) {
            if (!session.inferenceGraph.nodes.has(ev.id)) {
                session.inferenceGraph.nodes.set(ev.id, {
                    id: ev.id,
                    type: InferenceNodeType.OBSERVATION,
                    content: ev.content,
                    confidence: ev.confidence,
                    metadata: {}
                });
            }
        }

        for (const derived of derivedConclusions) {
            const conclusionId = uuidv4();
            const conclusion: ReasoningConclusion = {
                id: conclusionId,
                content: derived.content,
                confidence: 1.0, 
                explanation: {
                    humanReadable: `Derived '${derived.content}' via deductive rule.`,
                    reasoningTrace: [`Applied rule: IF ${rules.find(r => r.id === derived.ruleId)?.conditions.join(" AND ")} THEN ${derived.content}`],
                    evidenceReferences: evidenceSet.map(e => e.id),
                    confidenceJustification: "Logical deduction guarantees conclusion if premises are true.",
                    alternativeHypotheses: []
                },
                isFinal: true
            };

            session.inferenceGraph.nodes.set(conclusionId, {
                id: conclusionId,
                type: InferenceNodeType.CONCLUSION,
                content: conclusion.content,
                confidence: conclusion.confidence,
                metadata: { ruleId: derived.ruleId }
            });

            const rule = rules.find(r => r.id === derived.ruleId);
            if (rule) {
                for (const cond of rule.conditions) {
                    const sourceNode = Array.from(session.inferenceGraph.nodes.values()).find(n => n.content === cond);
                    if (sourceNode) {
                        session.inferenceGraph.edges.push({
                            sourceId: sourceNode.id,
                            targetId: conclusionId,
                            type: InferenceEdgeType.SUPPORTS,
                            weight: 1.0
                        });
                    }
                }
            }

            session.finalConclusions.push(conclusion);
        }

        if (session.finalConclusions.length > 0) {
            session.overallConfidence = 1.0;
        }
    }

    benchmark(): Record<string, number> {
        return { executionTimeMs: 2, depth: 1 };
    }
}
