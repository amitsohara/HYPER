const fs = require('fs');
let code = fs.readFileSync('src/server/core/hmrc1/managers/MissionResultManager.ts', 'utf8');

const planLogic = `            case "PLAN_EVALUATED":
            case "PLAN_GENERATED":
                agg.confidenceBreakdown!.planning = Math.max(0.8, payload.confidence || 0.88);
                if (payload.plan && payload.plan.steps) {
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
                } else if (payload.plan?.name) {
                    if (!agg.recommendations) agg.recommendations = [];
                    agg.recommendations!.push({
                            id: \`rec-\${Date.now()}\`,
                            priority: 1,
                            description: \`Implement plan: \${payload.plan.name}\`,
                            expectedImprovement: "High",
                            estimatedCost: "Low",
                            implementationDifficulty: "Medium" as any
                    });
                }
                break;`;

code = code.replace(/            case "PLAN_EVALUATED":\s*agg\.confidenceBreakdown!\.planning = Math\.max\(0\.8, payload\.confidence \|\| 0\.88\);\s*break;/, planLogic);

const recLogic = `        // Build final recommendations dynamically based on reasoning
        let recommendations = agg.recommendations || [];
        if (recommendations.length === 0) {
            recommendations = [
                {
                    id: \`rec-\${Date.now()}\`,
                    priority: 1,
                    description: \`Implement validated plan for: \${agg.directive}\`,
                    expectedImprovement: "High",
                    estimatedCost: "Low",
                    implementationDifficulty: "Medium" as any
                }
            ];
        }`;

code = code.replace(/\s*\/\/ Build final recommendations dynamically based on reasoning\s*const recommendations = \[\s*\{\s*id: `rec-\$\{Date\.now\(\)\}`,\s*priority: 1,\s*description: `Implement validated plan for: \$\{agg\.directive\}`,\s*expectedImprovement: "High",\s*estimatedCost: "Low",\s*implementationDifficulty: "Medium" as any\s*\}\s*\];/, '\n' + recLogic);

fs.writeFileSync('src/server/core/hmrc1/managers/MissionResultManager.ts', code);
console.log("Updated recommendations extraction");
