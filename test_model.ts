import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

async function test(model) {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "dummy" });
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: "hi",
        });
        console.log(model, "Success");
    } catch(e: any) {
        console.error(model, "Error:", e.message || e);
    }
}

async function main() {
    await test("gemini-flash-latest");
    await test("gemini-2.0-flash-lite-001");
    await test("gemini-2.5-flash-lite");
    await test("gemini-flash-lite-latest");
}
main().catch(console.error);
