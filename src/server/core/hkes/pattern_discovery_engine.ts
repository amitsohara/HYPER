import { GoogleGenAI } from "@google/genai";
import { ExperienceStore } from "../hecs/experience_store.js";
import { ExperienceClusterer } from "./experience_clusterer.js";
import { CommonStructureExtractor } from "./common_structure_extractor.js";
import { SuccessPatternDetector } from "./success_pattern_detector.js";
import { FailurePatternDetector } from "./failure_pattern_detector.js";
import { PatternValidator } from "./pattern_validator.js";
import { PatternMerger } from "./pattern_merger.js";
import { PatternAbstraction } from "./abstraction_types.js";

export class PatternDiscoveryEngine {
    static async discoverPatterns(ai: GoogleGenAI): Promise<PatternAbstraction[]> {
        // 1. Get high quality experiences
        const allExperiences = ExperienceStore.getAll().filter(e => e.quality_score && e.quality_score >= 70);
        
        if (allExperiences.length < 3) return [];

        // 2. Cluster
        const clusters = ExperienceClusterer.clusterExperiences(allExperiences);
        const discoveredPatterns: PatternAbstraction[] = [];

        for (const cluster of clusters) {
            // 3. Extract common structure
            const structure = await CommonStructureExtractor.extract(ai, cluster);
            if (!structure) continue;

            // 4. Detect Success Patterns
            const successPatterns = await SuccessPatternDetector.detect(ai, cluster, structure);
            
            // 5. Detect Failure Patterns
            const failurePatterns = await FailurePatternDetector.detect(ai, cluster, structure);
            
            const allExtracted = [...successPatterns, ...failurePatterns];
            
            for (const pattern of allExtracted) {
                // 6. Validate
                if (PatternValidator.validate(pattern)) {
                    // 7. Merge & Store
                    const finalPattern = PatternMerger.merge(pattern);
                    discoveredPatterns.push(finalPattern);
                }
            }
        }

        return discoveredPatterns;
    }
}
