import { GoogleGenAI } from "@google/genai";
import { ExperienceStore } from "../hecs/experience_store.js";
import { AbstractionStore } from "./abstraction_store.js";
import { Abstraction, AbstractionType } from "./abstraction_types.js";
import { PatternDiscoveryEngine } from "./pattern_discovery_engine.js";
import { HeuristicDiscoveryEngine } from "./heuristic_discovery_engine.js";
import { CausalDiscoveryEngine } from "./causal_discovery_engine.js";
import { generateWithRetry, cleanJSON } from "../../engines.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class KnowledgeEvolutionEngine {
    static async evolve(ai: GoogleGenAI): Promise<Abstraction[]> {
        // Run Pattern Discovery Engine
        const discoveredPatterns = await PatternDiscoveryEngine.discoverPatterns(ai);
        
        // Run Heuristic Discovery Engine
        const discoveredHeuristics = await HeuristicDiscoveryEngine.discover(ai, discoveredPatterns);
        
        // Run Causal Discovery Engine
        const allExperiences = ExperienceStore.getAll();
        const discoveredCausalModels = await CausalDiscoveryEngine.discover(ai, allExperiences, discoveredPatterns, discoveredHeuristics);
        
        // Return the newly discovered abstractions
        return [...discoveredPatterns, ...discoveredHeuristics, ...discoveredCausalModels];
    }
}

