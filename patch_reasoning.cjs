const fs = require('fs');

const path = 'src/components/mission/ReasoningExplorerView.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
    /Execution Time: \{executionTimeMs \|\| 45\}ms \| Strategy: \{strategy \|\| "Forward Chaining"\}/,
    'Execution Time: {executionTimeMs || "-"}ms | Strategy: {strategy || "-"}'
);

fs.writeFileSync(path, code);
