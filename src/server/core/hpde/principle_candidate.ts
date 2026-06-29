import { PrincipleModel } from "./principle_model.js";

export interface PrincipleCandidate {
    candidate_id: string;
    source_mechanisms: string[];
    proposed_principle: Partial<PrincipleModel>;
    abstraction_logic: string;
    confidence_score: number;
}
