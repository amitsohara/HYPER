const fs = require('fs');

let path = 'src/server/core/hpe1/hpeSpecialist.ts';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes('import { HyperMindWorldModelEngine }')) {
    code = 'import { HyperMindWorldModelEngine } from "../hwme1/worldModelManager.js";\n' + code;
}

code = code.replace(
    'payload: { plan: plans[0], worldState: {} }',
    `payload: { 
                        plan: plans[0], 
                        worldState: {
                            entities: Array.from(HyperMindWorldModelEngine.getInstance().stateManager.getCanonicalWorld().entities.values()),
                            relationships: Array.from(HyperMindWorldModelEngine.getInstance().stateManager.getCanonicalWorld().relationships.values()),
                            context: HyperMindWorldModelEngine.getInstance().stateManager.getCanonicalWorld().context
                        } 
                    }`
);

fs.writeFileSync(path, code);
console.log("Patched HPE to include world state");
