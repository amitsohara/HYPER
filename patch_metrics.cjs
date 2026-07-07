const fs = require('fs');
let code = fs.readFileSync('src/server/core/hco1/metrics/MetricsEngine.ts', 'utf8');
const lines = code.split('\n');
console.log(lines.slice(100, 115).join('\n'));
