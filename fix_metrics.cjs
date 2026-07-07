const fs = require('fs');
let code = fs.readFileSync('src/server/core/hco1/metrics/MetricsEngine.ts', 'utf8');
code = code.replace(/this\.metrics\.engineStatus = engines;/g, '(this.metrics as any).engines = engines;\nthis.metrics.engineStatus = "OPTIMAL";');
code = code.replace(/import os from "os";/g, 'import * as os from "os";');
fs.writeFileSync('src/server/core/hco1/metrics/MetricsEngine.ts', code);
