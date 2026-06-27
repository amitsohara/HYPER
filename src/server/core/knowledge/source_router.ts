import { GoogleGenAI } from "@google/genai";
import { webSearch } from "./web_search_agent.js";
import { researchSearch } from "./research_paper_agent.js";
import { patentSearch } from "./patent_search_agent.js";
import { githubSearch } from "./github_search_agent.js";
import { newsSearch } from "./news_search_agent.js";
import { governmentSearch } from "./government_data_agent.js";

export async function routeAndAcquire(ai: GoogleGenAI, need: any) {
    const results = [];
    const sources = need.preferred_sources || ["web"];
    for (const source of sources) {
        try {
            let res;
            switch (source) {
                case "web": res = await webSearch(ai, need.query); break;
                case "research_paper": res = await researchSearch(ai, need.query); break;
                case "patent": res = await patentSearch(ai, need.query); break;
                case "github": res = await githubSearch(ai, need.query); break;
                case "news": res = await newsSearch(ai, need.query); break;
                case "government": res = await governmentSearch(ai, need.query); break;
                default: res = await webSearch(ai, need.query); break;
            }
            if (res) results.push(...res);
        } catch (e) {
            console.warn("Failed to acquire from source", source, e);
        }
    }
    return results;
}