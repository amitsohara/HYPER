const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/  \}\);\n        res\.json\(\{ success: true \}\);\n    \} catch \(e: any\) \{\n        res\.status\(500\)\.json\(\{ error: e\.message \}\);\n    \}\n  \}\);/g, '  });');

fs.writeFileSync('server.ts', code);
console.log("Fixed syntax");
