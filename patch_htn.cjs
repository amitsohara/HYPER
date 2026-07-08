const fs = require('fs');
const p = 'src/server/core/hpe1/planners/HTNPlanner.ts';
let code = fs.readFileSync(p, 'utf8');

code = code.replace(/r\.match\(goal\.name\)/g, 'r.match(goal.name + " " + goal.description)');

fs.writeFileSync(p, code);
console.log("Patched HTNPlanner");
