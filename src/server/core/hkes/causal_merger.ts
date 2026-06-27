import { CausalModelAbstraction } from "./abstraction_types.js";
import { AbstractionStore } from "./abstraction_store.js";

export class CausalMerger {
    static merge(newModel: CausalModelAbstraction): CausalModelAbstraction {
        const existingModels = AbstractionStore.searchByType(newModel.abstraction_type) as CausalModelAbstraction[];
        
        // Find a model with highly overlapping nodes or exact title
        const similarModel = existingModels.find(m => 
            m.title.toLowerCase() === newModel.title.toLowerCase() ||
            this.calculateOverlap(m.causal_nodes.map(n => n.id), newModel.causal_nodes.map(n => n.id)) > 0.8
        );

        if (similarModel) {
            // merge source pattern IDs and heuristic IDs
            similarModel.source_pattern_ids = Array.from(new Set([...similarModel.source_pattern_ids, ...newModel.source_pattern_ids]));
            similarModel.source_heuristic_ids = Array.from(new Set([...similarModel.source_heuristic_ids, ...newModel.source_heuristic_ids]));
            
            // merge experience IDs
            const combinedIds = Array.from(new Set([...similarModel.source_experience_ids, ...newModel.source_experience_ids]));
            similarModel.source_experience_ids = combinedIds;
            
            // update support_count
            similarModel.support_count = combinedIds.length;
            
            // update confidence
            similarModel.confidence = (similarModel.confidence + newModel.confidence) / 2;
            
            // increment version
            similarModel.version += 1;
            similarModel.updated_at = Date.now();
            
            // For a robust system, we would merge graph nodes and edges here as well
            
            AbstractionStore.updateAbstraction(similarModel);
            return similarModel;
        } else {
            AbstractionStore.storeAbstraction(newModel);
            return newModel;
        }
    }

    private static calculateOverlap(arr1: string[], arr2: string[]): number {
        if (arr1.length === 0 || arr2.length === 0) return 0;
        const set1 = new Set(arr1);
        const intersection = arr2.filter(x => set1.has(x));
        return intersection.length / Math.max(arr1.length, arr2.length);
    }
}
