import { GoogleGenAI } from "@google/genai";
import { ReflectionReport, EvolutionEvent } from "./memoryTypes.js";
import { MemoryEventBus, MemoryEvents } from "./memoryEvents.js";
import { MemoryMetrics } from "./memoryMetrics.js";
import { v4 as uuidv4 } from "uuid";
import { generateWithRetry, cleanJSON } from "../../../engines.js";

export class ReflectionEngine {
    private eventBus = MemoryEventBus.getInstance();

    public async generateReflection(ai: GoogleGenAI, cycle_id: string, events: EvolutionEvent[]): Promise<ReflectionReport> {
        const prompt = `Generate a reflection report for the completed evolution cycle.
Events: ${JSON.stringify(events.map(e => ({ type: e.type, data: e.payload })))}

Return JSON:
{
  "what_happened": "Summary of events",
  "why": "The driving reasons",
  "what_worked": "Successful elements",
  "what_failed": "Failed elements",
  "unexpected_outcomes": "Surprises",
  "lessons_learned": ["Lesson 1"],
  "recommendations": ["Recommendation 1"],
  "future_research_questions": ["Question 1"]
}`;
        let result: any = {
            what_happened: "Mock summary",
            why: "Mock reason",
            what_worked: "Mock successes",
            what_failed: "Mock failures",
            unexpected_outcomes: "None",
            lessons_learned: [],
            recommendations: [],
            future_research_questions: []
        };

        try {
            const res = await generateWithRetry(ai, {
                model: "gemini-2.5-flash",
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            result = await cleanJSON(res?.text || "{}", ai);
        } catch (e) {
            console.error("ReflectionEngine failed:", e);
        }

        const report: ReflectionReport = {
            report_id: uuidv4(),
            timestamp: Date.now(),
            cycle_id,
            what_happened: result.what_happened || "",
            why: result.why || "",
            what_worked: result.what_worked || "",
            what_failed: result.what_failed || "",
            unexpected_outcomes: result.unexpected_outcomes || "",
            lessons_learned: result.lessons_learned || [],
            recommendations: result.recommendations || [],
            future_research_questions: result.future_research_questions || []
        };

        MemoryMetrics.reflections_generated++;
        this.eventBus.publish(MemoryEvents.REFLECTION_GENERATED, report);

        return report;
    }
}
