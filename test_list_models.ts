import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

async function main() {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "dummy" });
        const models = await ai.models.list();
        for await (const m of models) {
            console.log(m.name);
        }
    } catch(e: any) {
        console.error("Error:", e.message || e);
    }
}
main().catch(console.error);
