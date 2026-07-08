const fs = require('fs');

let path = 'src/server/core/hpe1/engines/goalDecompositionEngine.ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
    'try { require("fs").appendFileSync("hpe_error.log", "Gemini error: " + e.stack + "\\n"); } catch(ex){} ',
    'console.error("Gemini error in GoalDecompositionEngine:", e.stack);'
);

fs.writeFileSync(path, code);
