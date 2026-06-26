const fs = require('fs');
const path = require('path');

const dir = './src/server/core/knowledge';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const files = {
    'knowledge_planner.ts': `import { GoogleGenAI } from "@google/genai";
import { generateWithRetry } from "../../engines.js";

export async function planKnowledgeAcquisition(ai: GoogleGenAI, missionStatement: string) {
    const prompt = \`Analyze this mission and determine what specific knowledge needs to be acquired.
Mission: \${missionStatement}

Respond in JSON format:
{
  "knowledge_needs": [
    {
      "query": "string",
      "rationale": "string",
      "preferred_sources": ["web", "research_paper", "patent", "github", "news", "government"]
    }
  ]
}
\`;
    try {
        const res = await generateWithRetry(ai, {
            model: "gemini-flash-latest",
            contents: prompt,
            config: { responseMimeType: "application/json" }
        }, 3);
        return JSON.parse(res?.text || '{"knowledge_needs":[]}').knowledge_needs || [];
    } catch(e) {
        return [];
    }
}
`,
    'web_search_agent.ts': `export async function webSearch(query: string) {
    return [{
        source: "web",
        title: "Web result for " + query,
        url: "https://example.com/search?q=" + encodeURIComponent(query),
        date: new Date().toISOString(),
        author: "Web Author",
        summary: "This is a simulated web search result for the query.",
        relevance_score: 0,
        credibility_score: 0,
        freshness_score: 0,
        confidence_score: 0,
        citation: ""
    }];
}`,
    'research_paper_agent.ts': `export async function researchSearch(query: string) {
    return [{
        source: "research_paper",
        title: "Research paper on " + query,
        url: "https://arxiv.org/search?query=" + encodeURIComponent(query),
        date: new Date().toISOString(),
        author: "Researcher",
        summary: "This is a simulated research paper result.",
        relevance_score: 0,
        credibility_score: 0,
        freshness_score: 0,
        confidence_score: 0,
        citation: ""
    }];
}`,
    'patent_search_agent.ts': `export async function patentSearch(query: string) {
    return [{
        source: "patent",
        title: "Patent for " + query,
        url: "https://patents.google.com/?q=" + encodeURIComponent(query),
        date: new Date().toISOString(),
        author: "Inventor",
        summary: "This is a simulated patent result.",
        relevance_score: 0,
        credibility_score: 0,
        freshness_score: 0,
        confidence_score: 0,
        citation: ""
    }];
}`,
    'github_search_agent.ts': `export async function githubSearch(query: string) {
    return [{
        source: "github",
        title: "GitHub repo for " + query,
        url: "https://github.com/search?q=" + encodeURIComponent(query),
        date: new Date().toISOString(),
        author: "Developer",
        summary: "This is a simulated GitHub result.",
        relevance_score: 0,
        credibility_score: 0,
        freshness_score: 0,
        confidence_score: 0,
        citation: ""
    }];
}`,
    'news_search_agent.ts': `export async function newsSearch(query: string) {
    return [{
        source: "news",
        title: "News about " + query,
        url: "https://news.google.com/search?q=" + encodeURIComponent(query),
        date: new Date().toISOString(),
        author: "Journalist",
        summary: "This is a simulated news result.",
        relevance_score: 0,
        credibility_score: 0,
        freshness_score: 0,
        confidence_score: 0,
        citation: ""
    }];
}`,
    'government_data_agent.ts': `export async function governmentSearch(query: string) {
    return [{
        source: "government",
        title: "Gov data on " + query,
        url: "https://data.gov/search?q=" + encodeURIComponent(query),
        date: new Date().toISOString(),
        author: "Agency",
        summary: "This is a simulated government data result.",
        relevance_score: 0,
        credibility_score: 0,
        freshness_score: 0,
        confidence_score: 0,
        citation: ""
    }];
}`,
    'source_router.ts': `import { webSearch } from "./web_search_agent.js";
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
}`,
    'source_credibility_scorer.ts': `export function scoreCredibility(evidence: any) {
    let score = 50;
    if (evidence.source === "government") score = 95;
    else if (evidence.source === "research_paper") score = 90;
    else if (evidence.source === "patent") score = 85;
    else if (evidence.source === "github") score = 75;
    else if (evidence.source === "news") score = 70;
    else if (evidence.source === "web") score = 60;

    evidence.credibility_score = score;
    evidence.freshness_score = 80;
    return evidence;
}`,
    'citation_manager.ts': `export function generateCitation(evidence: any) {
    evidence.citation = \`[\${evidence.source.toUpperCase()}] \${evidence.title} - \${evidence.url} (\${evidence.date})\`;
    return evidence;
}`,
    'evidence_ranker.ts': `import { GoogleGenAI } from "@google/genai";
import { generateWithRetry } from "../../engines.js";

export async function rankEvidence(ai: GoogleGenAI, evidenceList: any[], mission: string) {
    if (!evidenceList || evidenceList.length === 0) return [];
    
    const prompt = \`Rank and score the following evidence items based on relevance to the mission.
Mission: \${mission}
Evidence:
\${JSON.stringify(evidenceList.map(e => ({ url: e.url, summary: e.summary })), null, 2)}

Respond with JSON:
{
  "ranked_evidence": [
    {
      "url": "string",
      "relevance_score": 85,
      "confidence_score": 90
    }
  ]
}
\`;
    try {
        const res = await generateWithRetry(ai, {
            model: "gemini-flash-latest",
            contents: prompt,
            config: { responseMimeType: "application/json" }
        }, 3);
        const rankings = JSON.parse(res?.text || '{"ranked_evidence":[]}').ranked_evidence || [];
        
        return evidenceList.map(ev => {
            const rank = rankings.find((r: any) => r.url === ev.url);
            if (rank) {
                ev.relevance_score = rank.relevance_score || 50;
                ev.confidence_score = rank.confidence_score || 50;
            } else {
                ev.relevance_score = 50;
                ev.confidence_score = 50;
            }
            return ev;
        }).sort((a, b) => (b.relevance_score + b.confidence_score + b.credibility_score) - (a.relevance_score + a.confidence_score + a.credibility_score));
    } catch(e) {
        return evidenceList;
    }
}`,
    'evidence_store.ts': `import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'evidence_store.json');

function ensureDb() {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, '[]');
}

export function saveEvidence(evidenceList: any[]) {
    ensureDb();
    const existing = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    existing.push(...evidenceList);
    fs.writeFileSync(DB_PATH, JSON.stringify(existing, null, 2));
}

export function getEvidence() {
    ensureDb();
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}`
};

for (const [filename, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(dir, filename), content);
}
console.log("Knowledge Acquisition files generated.");
