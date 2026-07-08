const fs = require('fs');
let code = fs.readFileSync('src/server/core/hre1/hreSpecialist.ts', 'utf8');

code = code.replace(
    'console.error("Reasoning execution failed", e);',
    'console.error("Reasoning execution failed", e); fs.appendFileSync("hre_debug.log", "Error: " + e.stack + "\\n");'
);

code = code.replace(
    'console.error("Failed to parse LLM reasoning response:", text);',
    'console.error("Failed to parse LLM reasoning response:", text); fs.appendFileSync("hre_debug.log", "Parse error: " + text + "\\n");'
);

code = code.replace(
    'const hila = HILASpecialist.getInstance();',
    'fs.appendFileSync("hre_debug.log", "Starting HILA...\\n");\n                const hila = HILASpecialist.getInstance();\n                if (!hila) fs.appendFileSync("hre_debug.log", "HILA IS NULL\\n");\n                if (!hila.arbitrator) fs.appendFileSync("hre_debug.log", "ARBITRATOR IS NULL\\n");'
);

code = code.replace(
    'if (arbitration.useExternal) {',
    'fs.appendFileSync("hre_debug.log", "Arbitration: " + JSON.stringify(arbitration) + "\\n");\n                    if (arbitration.useExternal) {'
);

fs.writeFileSync('src/server/core/hre1/hreSpecialist.ts', code);
console.log("Patched for debugging");
