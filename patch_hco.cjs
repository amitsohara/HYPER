const fs = require('fs');
const path = 'src/server/core/hco1/core/CognitiveObservatory.ts';
let code = fs.readFileSync(path, 'utf8');

const target = `            const eventPayload = {
                id: crypto.randomUUID(),
                type: eventType,
                timestamp: Date.now(),
                data: data
            };`;
const replacement = `            const eventPayload = {
                id: crypto.randomUUID(),
                type: event.type || "UNKNOWN",
                timestamp: event.timestamp || Date.now(),
                data: event.payload || event.data || event
            };`;

if(code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync(path, code);
    console.log("Patched HCO");
}
