const fs = require('fs');

let code = fs.readFileSync('src/server/core/huiv1/core/ValidationManager.ts', 'utf8');

code = code.replace(/import \{ TelemetryValidator \} from '\.\.\/validators\/TelemetryValidator\.js';/, 
`import { TelemetryValidator } from '../validators/TelemetryValidator.js';
import { CIAPValidator } from '../validators/CIAPValidator.js';`);

code = code.replace(/const results = \{\};/, 
`const results = {
            ciap: new CIAPValidator().detect('./src/server/core')
        };`);

fs.writeFileSync('src/server/core/huiv1/core/ValidationManager.ts', code);
