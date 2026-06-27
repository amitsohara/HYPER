import { HeuristicAbstraction } from "./abstraction_types.js";
import { AbstractionStore } from "./abstraction_store.js";

export class HeuristicMerger {
    static merge(newHeuristic: HeuristicAbstraction): HeuristicAbstraction {
        const existingHeuristics = AbstractionStore.searchByType(newHeuristic.abstraction_type) as HeuristicAbstraction[];
        
        const similarHeuristic = existingHeuristics.find(h => 
            h.title.toLowerCase() === newHeuristic.title.toLowerCase() ||
            h.description.toLowerCase() === newHeuristic.description.toLowerCase()
        );

        if (similarHeuristic) {
            // merge source pattern IDs
            similarHeuristic.source_pattern_ids = Array.from(new Set([...similarHeuristic.source_pattern_ids, ...newHeuristic.source_pattern_ids]));
            
            // merge experience IDs
            const combinedIds = Array.from(new Set([...similarHeuristic.source_experience_ids, ...newHeuristic.source_experience_ids]));
            similarHeuristic.source_experience_ids = combinedIds;
            
            // update support_count
            similarHeuristic.support_count = combinedIds.length;
            
            // update confidence
            similarHeuristic.confidence = (similarHeuristic.confidence + newHeuristic.confidence) / 2;
            
            // increment version
            similarHeuristic.version += 1;
            similarHeuristic.updated_at = Date.now();
            
            AbstractionStore.updateAbstraction(similarHeuristic);
            return similarHeuristic;
        } else {
            AbstractionStore.storeAbstraction(newHeuristic);
            return newHeuristic;
        }
    }
}
