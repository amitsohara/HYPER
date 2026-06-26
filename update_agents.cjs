const fs = require('fs');
const path = require('path');

const agents = [
    { file: "research_paper_agent.ts", name: "researchSearch", source: "research_paper", desc: "research papers and academic publications" },
    { file: "patent_search_agent.ts", name: "patentSearch", source: "patent", desc: "patents and intellectual property" },
    { file: "github_search_agent.ts", name: "githubSearch", source: "github", desc: "GitHub repositories, open source code, and developer discussions" },
    { file: "news_search_agent.ts", name: "newsSearch", source: "news", desc: "recent news articles and current events" },
    { file: "government_data_agent.ts", name: "governmentSearch", source: "government", desc: "government data, statistics, and official reports" }
];

agents.forEach(agent => {
    const content = `import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../../engines.js";

export async function ${agent.name}(ai: GoogleGenAI, query: string) {
    const prompt = \`Use the Google Search tool to perform a real, up-to-date web search specifically focusing on ${agent.desc} for: "\${query}".
You MUST use the search tool to find factual, real-world data and URLs. Do NOT hallucinate or make up URLs.
Summarize the actual real findings and extract the most relevant information.

Return the response STRICTLY as a JSON array of objects.
Do not include any markdown formatting or text outside the JSON array.
Use this format:
[
  {
    "source": "${agent.source}",
    "title": "Real Title of the finding",
    "url": "https://actual-real-url.com/source",
    "date": "2024-01-01",
    "author": "Author or Organization if available",
    "summary": "Detailed summary of the finding based on the actual search results."
  }
]\`;

    try {
        const res = await generateWithRetry(ai, {
            model: "gemini-flash-lite-latest",
            contents: prompt,
            tools: [{ googleSearch: {} }]
        }, 3);
        const text = res?.text || "[]";
        let results = await cleanJSON(text, ai);
        if (!Array.isArray(results)) results = [results];
        return results.map((r: any) => ({
            ...r,
            source: "${agent.source}",
            relevance_score: 0,
            credibility_score: 0,
            freshness_score: 0,
            confidence_score: 0,
            citation: ""
        }));
    } catch(e) {
        console.warn('${agent.name} error:', e);
        return [];
    }
}
`;
    fs.writeFileSync(path.join('./src/server/core/knowledge', agent.file), content);
});

console.log("Agents updated.");
