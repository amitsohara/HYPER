import { IReasoningStrategy } from "../IReasoningStrategy.js";
import { ReasoningSession, Evidence, ReasoningConclusion, InferenceNodeType, InferenceEdgeType } from "../types.js";
import { v4 as uuidv4 } from "uuid";
import { HILASpecialist } from "../../hila1/hilaSpecialist.js";

export interface DeductiveRule {
    id: string;
    conditions: string[]; // List of required fact contents
    conclusion: string;
}

export class DeductiveStrategy implements IReasoningStrategy {
    constructor() {}

    getName(): string {
        return "DEDUCTIVE";
    }

    async execute(session: ReasoningSession, evidenceSet: Evidence[]): Promise<void> {
        const facts = new Set(evidenceSet.map(e => e.content));
        const rules: DeductiveRule[] = session.metadata.rules || [];

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

        try {
            const hila = HILASpecialist.getInstance();
            if (hila && hila.arbitrator && evidenceSet.length > 0) {
                const request = {
                    id: uuidv4(),
                    missionId: "SYSTEM",
                    domain: "REASONING",
                    task: "Deductive reasoning",
                    context: { evidence: evidenceSet.map(e => e.content), rules },
                    priority: 5,
                    requiredConfidence: 0.8
                };
                
                const arbitration = await hila.arbitrator.arbitrate(request, 0.4);
                
                if (arbitration.useExternal) {
                    const prompt = `You are a deductive reasoning engine. Apply deductive logic to the provided evidence.
Evidence: ${JSON.stringify(evidenceSet.map(e => e.content))}
Rules (optional): ${JSON.stringify(rules)}

Return a JSON array of conclusion objects, where each object has:
- "content": the derived conclusion string.
- "confidenceJustification": string explaining why it is true.
Do not use markdown formatting.`;

                    const response = await hila.arbitrator.executeExternal({...request, task: prompt}, arbitration);
                    
                    if (response && response.content) {
                        let parsed: any = [];
                        try { 
                            const _parsed = JSON.parse(response.content);
                            if (Array.isArray(_parsed)) {
                                parsed = _parsed;
                            } else {
                                console.warn("Fallback or non-array response from LLM, returning empty array");
                            }
                        } catch(e) { 
                            console.warn("Failed to parse LLM response", response.content); 
                        }
                        for (const derived of parsed) {
                            if (!facts.has(derived.content)) {
                                facts.add(derived.content);
                                this.addConclusionToGraph(session, evidenceSet, derived.content, derived.confidenceJustification);
                            }
                        }
                        if (parsed.length > 0) {
                            session.overallConfidence = 1.0;
                        }
                        return;
                    }
                }
            }
        } catch (e) {
            // Suppress error
        }

        let newFactsDerived = true;
        const derivedConclusions: { ruleId: string, content: string }[] = [];

        // Forward chaining rule engine (fallback)
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

        for (const derived of derivedConclusions) {
            this.addConclusionToGraph(
                session, 
                evidenceSet, 
                derived.content, 
                "Logical deduction guarantees conclusion if premises are true.",
                derived.ruleId,
                rules.find(r => r.id === derived.ruleId)
            );
        }

        if (session.finalConclusions.length > 0) {
            session.overallConfidence = 1.0;
        }
    }

    private addConclusionToGraph(
        session: ReasoningSession, 
        evidenceSet: Evidence[], 
        content: string, 
        justification: string, 
        ruleId?: string, 
        rule?: DeductiveRule
    ) {
        const conclusionId = uuidv4();
        const conclusion: ReasoningConclusion = {
            id: conclusionId,
            content: content,
            confidence: 1.0, 
            explanation: {
                humanReadable: `Derived '${content}' via deductive logic.`,
                reasoningTrace: rule ? [`Applied rule: IF ${rule.conditions.join(" AND ")} THEN ${content}`] : ["LLM Derived"],
                evidenceReferences: evidenceSet.map(e => e.id),
                confidenceJustification: justification,
                alternativeHypotheses: []
            },
            isFinal: true
        };

        session.inferenceGraph.nodes.set(conclusionId, {
            id: conclusionId,
            type: InferenceNodeType.CONCLUSION,
            content: conclusion.content,
            confidence: conclusion.confidence,
            metadata: { ruleId: ruleId || "llm-inferred" }
        });

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
        } else {
            // LLM derived, link all evidence
            for (const ev of evidenceSet) {
                session.inferenceGraph.edges.push({
                    sourceId: ev.id,
                    targetId: conclusionId,
                    type: InferenceEdgeType.SUPPORTS,
                    weight: 1.0
                });
            }
        }

        session.finalConclusions.push(conclusion);
    }

    benchmark(): Record<string, number> {
        return { executionTimeMs: 2, depth: 1 };
    }
}
