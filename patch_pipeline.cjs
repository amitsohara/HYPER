const fs = require('fs');

const path = 'src/components/mission/LiveCognitivePipelineView.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
    /\/\/ Let's also randomly trigger some nodes[\s\S]*?updated = true;\n        \}/,
    ''
);

fs.writeFileSync(path, code);
