import { webSearch } from "./web_search_agent.js";
import { researchSearch } from "./research_paper_agent.js";
import { patentSearch } from "./patent_search_agent.js";
import { githubSearch } from "./github_search_agent.js";
import { newsSearch } from "./news_search_agent.js";
import { governmentSearch } from "./government_data_agent.js";

export async function routeAndAcquire(need: any) {
    const promises = [];
    const sources = need.preferred_sources || ["web"];
    for (const source of sources) {
        switch (source) {
            case "web": promises.push(webSearch(need.query)); break;
            case "research_paper": promises.push(researchSearch(need.query)); break;
            case "patent": promises.push(patentSearch(need.query)); break;
            case "github": promises.push(githubSearch(need.query)); break;
            case "news": promises.push(newsSearch(need.query)); break;
            case "government": promises.push(governmentSearch(need.query)); break;
            default: promises.push(webSearch(need.query)); break;
        }
    }
    const results = await Promise.allSettled(promises);
    return results.filter(r => r.status === "fulfilled").flatMap((r: any) => r.value);
}