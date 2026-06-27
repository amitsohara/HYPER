import { GoogleGenAI } from "@google/genai";
import { generateWithRetry } from "../../engines.js";

export class ContextCompressor {
  static async compress(ai: GoogleGenAI, context: any, maxTokens: number): Promise<string> {
    const stringified = JSON.stringify(context);
    
    // Crude estimation: 1 token ~ 4 chars
    if (stringified.length / 4 <= maxTokens) {
      return stringified;
    }

    const prompt = `Compress the following JSON context into a highly dense structured summary (under ${maxTokens} words) preserving crucial entities, decisions, metrics, and relationships.

Context:
${stringified.substring(0, 30000)} // Truncating if extremely large to avoid prompt explosion
`;

    try {
      const response = await generateWithRetry(ai, {
        model: "gemini-2.5-flash",
        contents: prompt
      });
      return response?.text || "Compression failed.";
    } catch (e) {
      console.warn("Context compression failed", e);
      return stringified.substring(0, maxTokens * 4);
    }
  }
}
