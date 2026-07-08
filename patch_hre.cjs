const fs = require('fs');
let code = fs.readFileSync('src/server/core/hre1/hreSpecialist.ts', 'utf8');

// We will inject HILASpecialist directly into hreSpecialist to do the reasoning.
const hilaImport = `import { HILASpecialist } from "../hila1/hilaSpecialist.js";\nimport { HyperMindEventMesh }`;
code = code.replace('import { HyperMindEventMesh }', hilaImport);

const replacement = `    public async handleEvent(event: any): Promise<void> {
        if (event.type === "THOUGHT_GENERATED" && event.payload) {
            const thoughtContext = event.payload.summary || event.payload.content || "Generated from thought";
            const evidence = [{
                id: uuidv4(),
                type: "OBSERVATION",
                content: thoughtContext,
                confidence: 0.9,
                source: "THOUGHT_GENERATED",
                timestamp: Date.now(), provenance: "HRE"
            }];
            
            try {
                // Initialize session via manager
                const session = await this.manager.executeReasoning(
                    \`Reasoning for Thought \${event.payload.thoughtId}\`,
                    [thoughtContext],
                    "DEDUCTIVE",
                    evidence
                );

                const hila = HILASpecialist.getInstance();
                let llmConclusions = [];
                if (hila && hila.arbitrator) {
                    const prompt = \`Perform deep reasoning on the following thought context: "\${thoughtContext}".
You must perform and explicitly label the following types of reasoning:
1. Knowledge graph traversal
2. Inference
3. Causal reasoning
4. Abductive reasoning
5. Commonsense reasoning

Return a JSON array of conclusion objects. Each object must have:
- "content": A string describing the conclusion (prefix it with the reasoning type, e.g. "[Causal] The congestion is caused by...").
- "explanation": A string detailing the reasoning trace.
- "confidence": A number between 0 and 1.
Do not wrap in markdown \`\`\`json blocks. Just return the raw JSON array.\`;
                    
                    const request = {
                        id: uuidv4(),
                        missionId: "SYSTEM",
                        domain: "REASONING",
                        task: prompt,
                        context: { evidence: [thoughtContext] },
                        priority: 5,
                        requiredConfidence: 0.8
                    };
                    const arbitration = await hila.arbitrator.arbitrate(request, 0.4);
                    if (arbitration.useExternal) {
                        const response = await hila.arbitrator.executeExternal(request, arbitration);
                        if (response && response.content) {
                            let text = response.content.trim();
                            if (text.startsWith('\`\`\`json')) {
                                text = text.replace(/^\`\`\`json\\s*/, '').replace(/\\s*\`\`\`$/, '');
                            } else if (text.startsWith('\`\`\`')) {
                                text = text.replace(/^\`\`\`\\s*/, '').replace(/\\s*\`\`\`$/, '');
                            }
                            try {
                                llmConclusions = JSON.parse(text);
                            } catch(e) {
                                console.error("Failed to parse LLM reasoning response:", text);
                            }
                        }
                    }
                }

                if (llmConclusions.length > 0) {
                    for (const conc of llmConclusions) {
                        HyperMindEventMesh.getInstance().publish({
                            type: "CONCLUSION_GENERATED",
                            domain: CognitiveDomain.SYSTEM,
                            priority: 1,
                            source: "HRE-01",
                            payload: {
                                thoughtId: event.payload.thoughtId,
                                conclusionId: uuidv4(),
                                content: conc.content,
                                explanation: { humanReadable: conc.explanation, reasoningTrace: [conc.explanation] },
                                confidence: conc.confidence || 0.9,
                                strategy: "OMNI_REASONING",
                                executionTimeMs: session.executionMetrics?.executionTimeMs || 150,
                                alternativeHypotheses: []
                            }
                        });
                    }
                } else if (session.finalConclusions && session.finalConclusions.length > 0) {
                    for (const conclusion of session.finalConclusions) {
                        HyperMindEventMesh.getInstance().publish({
                            type: "CONCLUSION_GENERATED",
                            domain: CognitiveDomain.SYSTEM,
                            priority: 1,
                            source: "HRE-01",
                            payload: {
                                thoughtId: event.payload.thoughtId,
                                conclusionId: conclusion.id,
                                content: conclusion.content,
                                explanation: conclusion.explanation,
                                confidence: conclusion.confidence,
                                strategy: session.selectedStrategy,
                                executionTimeMs: session.executionMetrics?.executionTimeMs || 45,
                                alternativeHypotheses: (conclusion as any).alternativeHypotheses || []
                            }
                        });
                    }
                } else {
                    // Fallback to ensure pipeline continues
                    HyperMindEventMesh.getInstance().publish({
                        type: "CONCLUSION_GENERATED",
                        domain: CognitiveDomain.SYSTEM,
                        priority: 1,
                        source: "HRE-01",
                        payload: {
                            thoughtId: event.payload.thoughtId,
                            conclusionId: uuidv4(),
                            content: "Fallback conclusion generated (no rules met)",
                            explanation: { humanReadable: "Fallback explanation" },
                            confidence: 0.5,
                            strategy: session.selectedStrategy || "FALLBACK",
                            executionTimeMs: session.executionMetrics?.executionTimeMs || 10,
                            alternativeHypotheses: []
                        }
                    });
                }
            } catch (e) {
                console.error("Reasoning execution failed", e);
            }
        }
    }`;

code = code.replace(/    public async handleEvent\(event: any\): Promise<void> \{[\s\S]*?    public getHealth\(\)/, replacement + '\n\n    public getHealth()');
fs.writeFileSync('src/server/core/hre1/hreSpecialist.ts', code);
console.log("Patched hreSpecialist.ts");
