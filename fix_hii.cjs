const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
`  app.get("/api/hml/hii", async (req, res) => {
      res.json({ hii: 980, maxHii: 1000 });
  });`,
`  app.get("/api/hml/hii", async (req, res) => {
      try {
          const obs = CognitiveObservatory.getInstance();
          const hii = HIICalculator.calculate(obs.getTelemetry(), obs.getMetrics());
          res.json(hii);
      } catch (e: any) {
          res.status(500).json({ error: e.message });
      }
  });`
);

// We also need to add the imports.
if (!code.includes('CognitiveObservatory')) {
    code = `import { CognitiveObservatory } from "./src/server/core/hco1/core/CognitiveObservatory.js";
import { HIICalculator } from "./src/server/core/hco1/metrics/HII_Calculator.js";
` + code;
}

fs.writeFileSync('server.ts', code);
