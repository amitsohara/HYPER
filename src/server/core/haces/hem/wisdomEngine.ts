import { GoogleGenAI } from "@google/genai";
import { EvolutionEvent, EvolutionLesson } from "./memoryTypes.js";
import { InstitutionalKnowledgeBase } from "./institutionalKnowledge.js";
import { v4 as uuidv4 } from "uuid";
import { generateWithRetry, cleanJSON } from "../../../engines.js";

export class WisdomEngine {
    constructor(private knowledgeBase: InstitutionalKnowledgeBase) {}

    public async extractWisdom(ai: GoogleGenAI, events: EvolutionEvent[]): Promise<EvolutionLesson[]> {
        if (events.length === 0) return [];

        const prompt = `Extract higher-level knowledge and reusable wisdom from the following evolutionary events.
Events: ${JSON.stringify(events.map(e => ({ type: e.type, meta: e.metadata, id: e.event_id })))}

Identify:
- Successful patterns
- Common failure modes
- Reliable principles

Return JSON as an array of lessons:
{
  "lessons": [
    {
      "type": "SUCCESS",
      "description": "Short description of the pattern",
      "context": "When this pattern is applicable",
      "causal_chain_ids": ["event_id_1"]
    }
  ]
}`;
        let extractedLessons: any[] = [];
        try {
            const res = await generateWithRetry(ai, {
                model: "gemini-2.5-flash",
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            const parsed = await cleanJSON(res?.text || "{}", ai);
            extractedLessons = parsed.lessons || [];
        } catch (e) {
            console.error("WisdomEngine failed to extract wisdom:", e);
        }

        const lessons: EvolutionLesson[] = extractedLessons.map(l => ({
            lesson_id: uuidv4(),
            type: l.type || 'PRINCIPLE',
            description: l.description,
            context: l.context,
            causal_chain_ids: l.causal_chain_ids || [],
            timestamp: Date.now()
        }));

        for (const lesson of lessons) {
            this.knowledgeBase.addLesson(lesson);
        }

        return lessons;
    }
}
