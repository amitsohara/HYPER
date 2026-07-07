const fs = require('fs');

const path = 'src/store/useHyperMindStore.ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
    /executionTimeMs: msg\.payload\?\.executionTimeMs \|\| Math\.floor\(Math\.random\(\) \* 50 \+ 10\),/g,
    'executionTimeMs: msg.payload?.executionTimeMs || 45,'
);

fs.writeFileSync(path, code);
