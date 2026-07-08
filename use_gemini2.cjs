const fs = require('fs');
let code = fs.readFileSync('src/server/core/hre1/hreSpecialist.ts', 'utf8');

code = code.replace(
    'console.error("Gemini Reasoning failed:", e);',
    'console.error("Gemini Reasoning failed:", e); fs.appendFileSync("hre_debug.log", "Gemini error: " + e.stack + "\\n");'
);

fs.writeFileSync('src/server/core/hre1/hreSpecialist.ts', code);
