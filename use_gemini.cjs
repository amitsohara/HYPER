const fs = require('fs');
let code = fs.readFileSync('src/server/core/hre1/hreSpecialist.ts', 'utf8');

const geminiImport = `import { GoogleGenAI } from "@google/genai";\nimport { HyperMindEventMesh }`;
code = code.replace('import { HyperMindEventMesh }', geminiImport);

code = code.replace(/const hila = HILASpecialist\.getInstance\(\);[\s\S]*?if \(llmConclusions\.length > 0\) {/, 
`                let llmConclusions = [];
                try {
                    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
                    const prompt = \`Perform deep reasoning on the following thought context: "\${thoughtContext}".
You must perform and explicitly label the following types of reasoning:
1. Knowledge graph traversal
2. Inference
3. Causal reasoning
4. Abductive reasoning
5. Commonsense reasoning

Return a JSON array of conclusion objects. Each object must have:
- "content": A string describing the conclusion (prefix it with the reasoning type, e.g. "[Causal] The congestion is caused by...").
- "explanation": A string detailing the reasoning trace.
- "confidence": A number between 0 and 1.
Do not wrap in markdown \\\`\\\`\\\`json blocks. Just return the raw JSON array.\`;
                    const response = await ai.models.generateContent({
                        model: "gemini-2.5-flash",
                        contents: prompt
                    });
                    
                    let text = response.text || "";
                    if (text.startsWith('\`\`\`json')) {
                        text = text.replace(/^\`\`\`json\\s*/, '').replace(/\\s*\`\`\`$/, '');
                    } else if (text.startsWith('\`\`\`')) {
                        text = text.replace(/^\`\`\`\\s*/, '').replace(/\\s*\`\`\`$/, '');
                    }
                    llmConclusions = JSON.parse(text);
                } catch(e) {
                    console.error("Gemini Reasoning failed:", e);
                }
                if (llmConclusions.length > 0) {`);

fs.writeFileSync('src/server/core/hre1/hreSpecialist.ts', code);
console.log("Patched to use Gemini directly");
