const fs = require('fs');

let serverCode = fs.readFileSync('server.ts', 'utf8');

// Replace dangling catch blocks that have no try
let prev;
do {
    prev = serverCode;
    serverCode = serverCode.replace(/\n\s*\}\s*catch\(e: any\) \{\n\s*res\.status\(500\)\.json\(\{ error: e\.message \|\| String\(e\) \}\);\n\s*\}\n\s*\}\);\n/g, '\n');
} while(prev !== serverCode);

do {
    prev = serverCode;
    serverCode = serverCode.replace(/\n\s*\}\n\s*\}\);\n\s*app\.get/g, '\napp.get');
} while (prev !== serverCode);

fs.writeFileSync('server.ts', serverCode);
