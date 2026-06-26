import { planKnowledgeAcquisition } from "./src/server/core/knowledge/knowledge_planner.ts";
import { routeAndAcquire } from "./src/server/core/knowledge/source_router.ts";
import { scoreCredibility } from "./src/server/core/knowledge/source_credibility_scorer.ts";
import { generateCitation } from "./src/server/core/knowledge/citation_manager.ts";
import { rankEvidence } from "./src/server/core/knowledge/evidence_ranker.ts";
import { saveEvidence, getEvidence } from "./src/server/core/knowledge/evidence_store.ts";
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "dummy" });
    const mission = "Investigate the feasibility of a startup building AI-powered coffee machines.";
    
    console.log("Planning...");
    const needs = await planKnowledgeAcquisition(ai, mission);
    console.log("Needs:", needs);
    
    let allEvidence = [];
    for (const need of needs) {
        console.log("Acquiring for:", need.query);
        const raw = await routeAndAcquire(ai, need);
        const scored = raw.map((e: any) => generateCitation(scoreCredibility(e)));
        allEvidence.push(...scored);
    }
    
    console.log("Ranking evidence...");
    const ranked = await rankEvidence(ai, allEvidence, mission);
    
    console.log("Saving evidence...");
    saveEvidence(ranked);
    
    console.log("Top Evidence:", ranked.slice(0, 2));
}

test().catch(console.error);
