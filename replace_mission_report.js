const fs = require('fs');
const file = 'src/server/core/hmrc1/managers/MissionResultManager.ts';
let code = fs.readFileSync(file, 'utf8');

const oldGen = `        try {
            const hila = HILASpecialist.getInstance();
            if (hila && hila.arbitrator) {
                const request = {
                    id: uuidv4(),
                    missionId: missionId,
                    domain: "SYSTEM",
                    task: "Summarize mission results",
                    context: { directive, objective, status },
                    priority: 5,
                    requiredConfidence: 0.8
                };
                
                const arbitration = await hila.arbitrator.arbitrate(request, 0.2);
                if (arbitration.useExternal) {
                    const prompt = \`Generate a highly detailed mission report for the following mission:
Directive: \${directive}
Objective: \${objective}
Status: \${status}

Return a JSON object containing:
- outcome: A short paragraph describing the outcome.
- rootCauses: An array of strings explaining underlying causes of the state.
- recommendations: An array of objects with { id, priority (number), description, expectedImprovement, estimatedCost, implementationDifficulty }.
- cognitiveReasoningSummary: A paragraph explaining the AI reasoning process.\`;

                    const response = await hila.arbitrator.executeExternal({...request, task: prompt}, arbitration);
                    if (response && response.content) {
                        try {
                            const match = response.content.match(/\`\`\`(?:json)?([\\s\\S]*?)\`\`\`/);
                            const cleanContent = match ? match[1].trim() : response.content.trim();
                            const parsed = JSON.parse(cleanContent);
                            if (parsed.outcome) outcomeText = parsed.outcome;
                            if (parsed.rootCauses) rootCauses = parsed.rootCauses;
                            if (parsed.recommendations) recommendations = parsed.recommendations as any[];
                            if (parsed.cognitiveReasoningSummary) cognitiveReasoningSummary = parsed.cognitiveReasoningSummary;
                        } catch(e) {}
                    }
                }
            }
        } catch(e) {
            // Suppress log
        }`;

const newGen = `        try {
            const hila = HILASpecialist.getInstance();
            if (hila && hila.arbitrator) {
                // Get cognitive trace from EventMesh
                const allEvents = await this.eventMesh.queryEvents({});
                const relevantEvents = allEvents.filter(e => 
                    e.type === "WORLD_OBSERVATION" || 
                    e.type === "THOUGHT_GENERATED" || 
                    e.type === "CONCLUSION_GENERATED" ||
                    e.type === "SIMULATION_COMPLETED" ||
                    e.type === "PLAN_EVALUATED" ||
                    e.type === "ACTION_COMPLETED" ||
                    e.type === "MISSION_CREATED"
                ).slice(-40);
                
                const traceSummary = relevantEvents.map(e => {
                    let desc = "";
                    if (e.type === "WORLD_OBSERVATION") desc = e.payload?.missionDirective || e.payload?.entity?.name || JSON.stringify(e.payload);
                    else if (e.type === "THOUGHT_GENERATED") desc = e.payload?.summary || e.payload?.content;
                    else if (e.type === "CONCLUSION_GENERATED") desc = e.payload?.content + " (" + e.payload?.strategy + ")";
                    else if (e.type === "SIMULATION_COMPLETED") desc = e.payload?.run?.outcome?.narrative || "Simulation ran.";
                    else if (e.type === "PLAN_EVALUATED") desc = "Plan evaluated with outcomes.";
                    else if (e.type === "MISSION_CREATED") desc = e.payload?.directive || e.payload?.mission?.name;
                    return \`[\${e.type}] \${desc}\`;
                }).join("\\n");

                const request = {
                    id: uuidv4(),
                    missionId: missionId,
                    domain: "SYSTEM",
                    task: "Summarize mission results",
                    context: { directive, objective, status },
                    priority: 5,
                    requiredConfidence: 0.8
                };
                
                const arbitration = await hila.arbitrator.arbitrate(request, 0.2);
                if (arbitration.useExternal) {
                    const prompt = \`Generate a highly detailed, realistic mission report for the following mission based strictly on the cognitive trace events provided.
Mission Directive: \${directive}
Objective: \${objective}
Status: \${status}

COGNITIVE TRACE LOGS:
\${traceSummary}

Based on the actual thoughts, conclusions, and simulations in the trace above, generate a factual summary.
Return a JSON object containing:
- outcome: A short paragraph describing the outcome and findings.
- rootCauses: An array of strings explaining underlying causes found in the trace.
- recommendations: An array of objects with { id, priority (number), description, expectedImprovement, estimatedCost, implementationDifficulty }.
- cognitiveReasoningSummary: A paragraph explaining the AI reasoning process that led to this result, referencing the specific trace events.\`;

                    const response = await hila.arbitrator.executeExternal({...request, task: prompt}, arbitration);
                    if (response && response.content) {
                        try {
                            const match = response.content.match(/\`\`\`(?:json)?([\\s\\S]*?)\`\`\`/);
                            const cleanContent = match ? match[1].trim() : response.content.trim();
                            const parsed = JSON.parse(cleanContent);
                            if (parsed.outcome) outcomeText = parsed.outcome;
                            if (parsed.rootCauses) rootCauses = parsed.rootCauses;
                            if (parsed.recommendations) recommendations = parsed.recommendations as any[];
                            if (parsed.cognitiveReasoningSummary) cognitiveReasoningSummary = parsed.cognitiveReasoningSummary;
                        } catch(e) {}
                    }
                }
            }
        } catch(e) {
            // Suppress log
        }`;

code = code.replace(oldGen, newGen);

fs.writeFileSync(file, code);
