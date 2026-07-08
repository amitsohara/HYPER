const fs = require('fs');
let code = fs.readFileSync('src/server/core/hpe1/hpeSpecialist.ts', 'utf8');

code = code.replace(
    'const plans = await this.planManager.createPlansForGoal(goal, {});',
    'fs.appendFileSync("hpe_debug.log", "Creating plans for goal: " + JSON.stringify(goal) + "\\n");\n            const plans = await this.planManager.createPlansForGoal(goal, {});\n            fs.appendFileSync("hpe_debug.log", "Plans created: " + plans.length + "\\n");'
);

fs.writeFileSync('src/server/core/hpe1/hpeSpecialist.ts', code);

let decompCode = fs.readFileSync('src/server/core/hpe1/engines/goalDecompositionEngine.ts', 'utf8');
decompCode = decompCode.replace(
    'console.error("Failed to decompose goal with Gemini:", e);',
    'console.error("Failed to decompose goal with Gemini:", e); fs.appendFileSync("hpe_debug.log", "Gemini error: " + e.stack + "\\n");'
);
decompCode = decompCode.replace(
    'const response = await ai.models.generateContent({',
    'fs.appendFileSync("hpe_debug.log", "Calling Gemini for decomp...\\n");\n            const response = await ai.models.generateContent({'
);
decompCode = decompCode.replace(
    'const parsed = JSON.parse(text);',
    'fs.appendFileSync("hpe_debug.log", "Gemini response text: " + text + "\\n");\n            const parsed = JSON.parse(text);'
);
fs.writeFileSync('src/server/core/hpe1/engines/goalDecompositionEngine.ts', decompCode);

console.log("Patched hpe for debugging");
