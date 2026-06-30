import { GoogleGenAI } from "@google/genai";
import { EvolutionNarrative, EvolutionEvent } from "./memoryTypes.js";
import { MemoryEventBus, MemoryEvents } from "./memoryEvents.js";
import { v4 as uuidv4 } from "uuid";
import { generateWithRetry, cleanJSON } from "../../../engines.js";

export class NarrativeGenerator {
    private eventBus = MemoryEventBus.getInstance();

    public async generateNarrative(ai: GoogleGenAI, topic: string, events: EvolutionEvent[]): Promise<EvolutionNarrative> {
        const prompt = `Generate an explainable history narrative for the given topic based on these evolution events.
Topic: ${topic}
Events: ${JSON.stringify(events.map(e => ({ type: e.type, timestamp: e.timestamp })))}

Return JSON:
{
  "content": "A well-structured narrative explaining the history of this topic."
}`;
        let content = "Mock narrative content";

        try {
            const res = await generateWithRetry(ai, {
                model: "gemini-2.5-flash",
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            const parsed = await cleanJSON(res?.text || "{}", ai);
            content = parsed.content || content;
        } catch (e) {
            console.error("NarrativeGenerator failed:", e);
        }

        const narrative: EvolutionNarrative = {
            narrative_id: uuidv4(),
            topic,
            timestamp: Date.now(),
            content,
            audience: 'HUMAN',
            source_events: events.map(e => e.event_id)
        };

        this.eventBus.publish(MemoryEvents.NARRATIVE_GENERATED, narrative);
        return narrative;
    }
}
