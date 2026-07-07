const fs = require('fs');
let code = fs.readFileSync('src/store/useHyperMindStore.ts', 'utf8');

code = code.replace(
`        const msg = JSON.parse(event.data);`,
`        let msg;
        try {
            msg = JSON.parse(event.data);
        } catch(e) {
            console.error("Invalid WS message:", event.data);
            return;
        }`
);

fs.writeFileSync('src/store/useHyperMindStore.ts', code);
