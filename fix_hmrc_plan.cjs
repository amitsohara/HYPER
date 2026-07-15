const fs = require('fs');
let code = fs.readFileSync('src/server/core/hmrc1/managers/MissionResultManager.ts', 'utf8');

const planLogic = `            case "PLAN_CREATED":
            case "PLAN_EVALUATED":
            case "PLAN_GENERATED":
                agg.confidenceBreakdown!.planning = Math.max(0.8, payload.confidence || payload.plan?.confidence || 0.88);
                if (payload.plan && payload.plan.atomicTasks) {
                    if (!agg.recommendations) agg.recommendations = [];
                    const tasks = Object.values(payload.plan.atomicTasks) as any[];
                    tasks.forEach((step: any, idx: number) => {
                        agg.recommendations!.push({
                            id: \`rec-\${Date.now()}-\${idx}\`,
                            priority: idx + 1,
                            description: step.description || step.name || \`Execute task \${idx + 1}\`,
                            expectedImprovement: "High",
                            estimatedCost: "Low",
                            implementationDifficulty: "Medium" as any
                        });
                    });
                } else if (payload.plan?.steps) {
                    if (!agg.recommendations) agg.recommendations = [];
                    payload.plan.steps.forEach((step: any, idx: number) => {
                        agg.recommendations!.push({
                            id: \`rec-\${Date.now()}-\${idx}\`,
                            priority: step.priority || (idx + 1),
                            description: step.description || step.action || \`Execute step \${idx + 1}\`,
                            expectedImprovement: step.expectedImprovement || "Moderate",
                            estimatedCost: step.estimatedCost || "Low",
                            implementationDifficulty: (step.difficulty || "Medium") as any
                        });
                    });
                } else if (payload.plan?.name || payload.plan?.explainability) {
                    if (!agg.recommendations) agg.recommendations = [];
                    agg.recommendations!.push({
                            id: \`rec-\${Date.now()}\`,
                            priority: 1,
                            description: \`Implement plan: \${payload.plan.name || payload.plan.explainability}\`,
                            expectedImprovement: "High",
                            estimatedCost: "Low",
                            implementationDifficulty: "Medium" as any
                    });
                }
                break;`;

code = code.replace(/            case "PLAN_EVALUATED":[\s\S]*?case "PLAN_GENERATED":[\s\S]*?break;/, planLogic);

fs.writeFileSync('src/server/core/hmrc1/managers/MissionResultManager.ts', code);
console.log("Updated recommendations extraction for PLAN_CREATED");
