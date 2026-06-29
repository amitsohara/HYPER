import { PrincipleCandidate } from "./principle_candidate.js";
import { PrincipleModel } from "./principle_model.js";
import { PrincipleStatus } from "./principle_types.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class PrincipleGeneralizer {
    static generateCandidates(abstractions: any[]): PrincipleCandidate[] {
        return abstractions.map(abs => ({
            candidate_id: uuidv4(),
            source_mechanisms: abs.mechanisms,
            abstraction_logic: abs.logic,
            confidence_score: 50, // Initial confidence
            proposed_principle: {
                principle_id: uuidv4(),
                name: "Generated Principle",
                description: abs.logic,
                domains: [],
                status: PrincipleStatus.CANDIDATE,
                created_at: Date.now(),
                updated_at: Date.now()
            }
        }));
    }
}
