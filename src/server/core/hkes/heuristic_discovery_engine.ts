import { GoogleGenAI } from "@google/genai";
import { PatternAbstraction, HeuristicAbstraction } from "./abstraction_types.js";
import { HeuristicGenerator } from "./heuristic_generator.js";
import { HeuristicValidator } from "./heuristic_validator.js";
import { HeuristicMerger } from "./heuristic_merger.js";

export class HeuristicDiscoveryEngine {
    static async discover(ai: GoogleGenAI, patterns: PatternAbstraction[]): Promise<HeuristicAbstraction[]> {
        if (!patterns || patterns.length === 0) return [];

        // 1. Generate candidate heuristics
        const candidates = await HeuristicGenerator.generate(ai, patterns);
        const discovered: HeuristicAbstraction[] = [];

        for (const heuristic of candidates) {
            // 2. Validate
            if (HeuristicValidator.validate(heuristic)) {
                // 3. Merge & Store
                const finalHeuristic = HeuristicMerger.merge(heuristic);
                discovered.push(finalHeuristic);
            }
        }

        return discovered;
    }
}
