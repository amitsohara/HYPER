import { PatternAbstraction } from "./abstraction_types.js";
import { AbstractionStore } from "./abstraction_store.js";

export class PatternMerger {
    static merge(newPattern: PatternAbstraction): PatternAbstraction {
        // Find existing patterns with very similar titles
        // For a more advanced version, we could use embeddings or LLMs to detect similarity
        const existingPatterns = AbstractionStore.searchByType(newPattern.abstraction_type) as PatternAbstraction[];
        
        const similarPattern = existingPatterns.find(p => 
            p.title.toLowerCase() === newPattern.title.toLowerCase() ||
            p.description.toLowerCase() === newPattern.description.toLowerCase()
        );

        if (similarPattern) {
            // merge source experience IDs
            const combinedIds = Array.from(new Set([...similarPattern.source_experience_ids, ...newPattern.source_experience_ids]));
            similarPattern.source_experience_ids = combinedIds;
            
            // update support_count
            similarPattern.support_count = combinedIds.length;
            
            // update confidence (moving average or max)
            similarPattern.confidence = (similarPattern.confidence + newPattern.confidence) / 2;
            
            // increment version
            similarPattern.version += 1;
            
            // preserve history
            similarPattern.updated_at = Date.now();
            
            // Update other fields
            similarPattern.source_domains = Array.from(new Set([...similarPattern.source_domains, ...newPattern.source_domains]));
            similarPattern.source_mission_types = Array.from(new Set([...similarPattern.source_mission_types, ...newPattern.source_mission_types]));
            similarPattern.recurring_conditions = Array.from(new Set([...similarPattern.recurring_conditions, ...newPattern.recurring_conditions]));
            similarPattern.recurring_actions = Array.from(new Set([...similarPattern.recurring_actions, ...newPattern.recurring_actions]));
            similarPattern.recurring_outcomes = Array.from(new Set([...similarPattern.recurring_outcomes, ...newPattern.recurring_outcomes]));

            AbstractionStore.updateAbstraction(similarPattern);
            return similarPattern;
        } else {
            AbstractionStore.storeAbstraction(newPattern);
            return newPattern;
        }
    }
}
