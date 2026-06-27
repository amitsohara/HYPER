import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../../engines.js";

export async function githubSearch(ai: GoogleGenAI, query: string) {
    const prompt = `Use the Google Search tool to perform a real, up-to-date web search specifically focusing on GitHub repositories, open source code, and developer discussions for: "${query}".
You MUST use the search tool to find factual, real-world data and URLs. Do NOT hallucinate or make up URLs.
Summarize the actual real findings and extract the most relevant information.

Return the response STRICTLY as a JSON array of objects.
Do not include any markdown formatting or text outside the JSON array.
Use this format:
[
  {
    "source": "github",
    "title": "Real Title of the finding",
    "url": "https://actual-real-url.com/source",
    "date": "2024-01-01",
    "author": "Author or Organization if available",
    "summary": "Detailed summary of the finding based on the actual search results."
  }
]`;

    try {
        const res = await generateWithRetry(ai, {
            model: "gemini-2.5-flash",
            contents: prompt,
        bypassBudget: true,
            tools: [{ googleSearch: {} }]
        }, 3);
        const text = res?.text || "[]";
        let results = await cleanJSON(text, ai);
        if (!Array.isArray(results)) results = [results];
        return results.map((r: any) => ({
            ...r,
            source: "github",
            relevance_score: 0,
            credibility_score: 0,
            freshness_score: 0,
            confidence_score: 0,
            citation: ""
        }));
    } catch(e) {
        console.warn('githubSearch error:', e);
        return [];
    }
}
