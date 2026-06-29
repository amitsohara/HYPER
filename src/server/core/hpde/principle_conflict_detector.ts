import { PrincipleModel } from "./principle_model.js";

export class PrincipleConflictDetector {
    static detectConflicts(newPrinciple: PrincipleModel, existing: PrincipleModel[]): string[] {
        const conflicts: string[] = [];
        
        for (const p of existing) {
            if (p.description === newPrinciple.description && p.principle_id !== newPrinciple.principle_id) {
                conflicts.push(`Duplicate principle logic with ${p.principle_id}`);
            }
        }
        
        return conflicts;
    }
}
