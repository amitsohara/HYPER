const fs = require('fs');

let serverCode = fs.readFileSync('server.ts', 'utf8');

// Remove all GoogleGenAI imports and instantiations
serverCode = serverCode.replace(/import \{ GoogleGenAI \} from "@google\/genai";\n/g, '');
serverCode = serverCode.replace(/const ai = process\.env\.GEMINI_API_KEY[^;]+;\n/g, '');
serverCode = serverCode.replace(/const ai = new GoogleGenAI\(\{ apiKey: process\.env\.GEMINI_API_KEY \}\);\n/g, '');
serverCode = serverCode.replace(/const ai = new GoogleGenAI\(\{ apiKey: process\.env\.GEMINI_API_KEY \|\| 'stub' \}\);\n/g, '');
serverCode = serverCode.replace(/const \{ GoogleGenAI \} = await import\("@google\/genai"\);\n/g, '');

// Strip problematic routes that use missing files
const endpointsToRemove = [
    "/api/learning/evaluate-mission",
    "/api/learning/run",
    "/api/knowledge/plan",
    "/society/negotiate",
    "/discovery/run",
    "/api/hwme/world"
];

endpointsToRemove.forEach(endpoint => {
    const regex = new RegExp(`app\\.(post|get)\\("${endpoint.replace(/\//g, '\\/')}", async \\(req, res\\) => \\{[\\s\\S]*?\\}\\);\\n`, 'g');
    serverCode = serverCode.replace(regex, '');
});

fs.writeFileSync('server.ts', serverCode);
