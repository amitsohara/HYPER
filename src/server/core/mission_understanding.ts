import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../engines.js";

export class MissionUnderstanding {
    static async understand(ai: GoogleGenAI, mission: string) {
        const prompt = `You are the Mission Understanding module of the Meta-Cognition Engine.
Analyze the following mission to determine its core characteristics.

Mission: "${mission}"

Return a JSON object with:
{
  "mission_type": "The highly specific industry/domain classification (e.g. Aerospace Engineering, Planetary Settlement, Biotechnology, Quantum Computing). DO NOT use generic terms like 'strategic planning' or 'general'.",
  "mission_intent": "The underlying intent or true goal of the user",
  "primary_objective": "The main goal",
  "knowns": ["What do I already know based on the prompt?"],
  "unknowns": ["What information is currently missing to solve this?"],
  "reasoning_strategy": "How should I think about this? (e.g., First principles, lateral thinking, empirical analysis)",
  "confidence_score": 85,
  "confidence_reasoning": "Why am I this confident?",
  "secondary_objectives": ["List of secondary goals"],
  "constraints": ["List of implied or explicit constraints"],
  "expected_output": "The format and nature of the expected output",
  "uncertainty": "High/Medium/Low",
  "stakeholders": ["Who is affected by this mission?"],
  "time_horizon": "Short-term / Medium-term / Long-term",
  "difficulty": "1-10",
  "domains": ["List of broad domains involved (e.g. Climate, Business, Technology, Sociology)"]
}`;

        const res = await generateWithRetry(ai, {
            model: "gemini-1.5-flash",
            contents: prompt,
            bypassBudget: true,
            config: { responseMimeType: "application/json" }
        });

        return await cleanJSON(res?.text || "{}", ai);
    }
}
