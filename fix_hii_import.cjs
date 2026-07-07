const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
`          const obs = CognitiveObservatory.getInstance();`,
`          const { CognitiveObservatory } = await import("./src/server/core/hco1/core/CognitiveObservatory.js");
          const obs = CognitiveObservatory.getInstance();`
);

fs.writeFileSync('server.ts', code);
