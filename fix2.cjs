const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(/        res\.status\(500\)\.json\(\{ error: e\.message \}\);\napp\.get\("\/api\/hml\/dashboard", async \(req, res\) => \{/,
`        res.status(500).json({ error: e.message });
    }
});
app.get("/api/hml/dashboard", async (req, res) => {`);
// Also remove the extra }})}}} at the end
code = code.replace(/startServer\(\);\n\}\)\n\}\n\}/, 'startServer();\n');
fs.writeFileSync('server.ts', code);
