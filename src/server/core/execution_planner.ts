import { CognitiveScheduler } from "./cognitive_scheduler.js";
import { SelfReflectionPlanner } from "./self_reflection_planner.js";
import { GoogleGenAI } from "@google/genai";

export class ExecutionPlanner {
    static async plan(ai: GoogleGenAI, understanding: any, capabilities: any[], budgetMultiplier: number) {
        const threshold = 50 * budgetMultiplier;
        let selected = capabilities.filter(c => {
           const avg = ((c.relevance_score || 0) + (c.contribution_score || 0)) / 2;
           // Keep if average is above threshold, OR if it's highly relevant (> 70)
           return avg > threshold || (c.relevance_score || 0) > 70;
        });
        
        // Force core cycle modules to be selected
        const coreModules = ["imagination_engine", "strategic_decision", "world_model"];
        
        // Add them if they don't exist in capabilities
        for (const coreMod of coreModules) {
            if (!capabilities.find(c => c.module === coreMod)) {
                capabilities.push({
                    module: coreMod,
                    relevance_score: 100,
                    contribution_score: 100,
                    reasoning: "Core module required by Cognitive Cycle Engine",
                    expected_benefit: "Essential",
                    expected_cost: "High",
                    confidence: 100
                });
            }
        }

        for (const c of capabilities) {
            if (coreModules.includes(c.module) && !selected.includes(c)) {
                selected.push(c);
            }
        }
        
        let skipped = capabilities.filter(c => !selected.includes(c));

        const reflection = await SelfReflectionPlanner.reflect(ai, understanding, capabilities, selected, skipped);

        for (const add of reflection.final_additions || []) {
            const mod = skipped.find(m => m.module === add);
            if (mod) {
                skipped = skipped.filter(m => m.module !== add);
                selected.push(mod);
            }
        }
        for (const rem of reflection.final_removals || []) {
            const mod = selected.find(m => m.module === rem);
            if (mod) {
                selected = selected.filter(m => m.module !== rem);
                skipped.push(mod);
            }
        }

        const executionOrder = CognitiveScheduler.schedule(selected);

        return {
            selected_modules: selected,
            skipped_modules: skipped,
            execution_order: executionOrder,
            reflection
        };
    }
}
