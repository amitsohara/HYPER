const fs = require('fs');
const dir = 'src/server/core/hpe1/planners';

fs.readdirSync(dir).forEach(file => {
    const p = dir + '/' + file;
    let code = fs.readFileSync(p, 'utf8');
    // Change goal.name to goal.description for the fallback_trigger check
    code = code.replace(/goal\.name\.includes\("fallback_trigger"\)/g, 'goal.description.includes("fallback_trigger")');
    fs.writeFileSync(p, code);
});
console.log("Patched planners");
