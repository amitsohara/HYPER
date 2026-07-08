const fs = require('fs');

let path = 'src/server/core/hpe1/planManager.ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
    'import { CandidatePlanGenerator } from "./engines/candidatePlanGenerator.js";',
    'import { PlannerOrchestrator } from "./engines/PlannerOrchestrator.js";'
);
code = code.replace(
    'import { GoalDecompositionEngine } from "./engines/goalDecompositionEngine.js";\n',
    ''
);

code = code.replace(
    'public candidatePlanGenerator: CandidatePlanGenerator;',
    'public plannerOrchestrator: PlannerOrchestrator;'
);
code = code.replace(
    'public goalDecompositionEngine: GoalDecompositionEngine;\n',
    ''
);

code = code.replace(
    'this.candidatePlanGenerator = new CandidatePlanGenerator();',
    'this.plannerOrchestrator = new PlannerOrchestrator();'
);
code = code.replace(
    'this.goalDecompositionEngine = new GoalDecompositionEngine();\n',
    ''
);

code = code.replace(
    /        \/\/ Register default strategies[\s\S]*?this\.candidatePlanGenerator\.registerStrategy\(new GraphPlanningStrategy\(this\.goalDecompositionEngine\)\);/,
    ''
);

code = code.replace(
    'const candidates = await this.candidatePlanGenerator.generateCandidates(goal, context);',
    'const candidates = await this.plannerOrchestrator.orchestrate(goal, context);'
);

// Remove old imports
code = code.replace('import { HTNStrategy } from "./strategies/htnStrategy.js";\n', '');
code = code.replace('import { UtilityBasedStrategy } from "./strategies/utilityBasedStrategy.js";\n', '');
code = code.replace('import { GraphPlanningStrategy } from "./strategies/graphPlanningStrategy.js";\n', '');
code = code.replace('import { GoalDecompositionEngine } from "./engines/goalDecompositionEngine.js";\n', '');

fs.writeFileSync(path, code);
console.log("Patched PlanManager");
