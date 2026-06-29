import { HypothesisModel } from "./hypothesis_model.js";

export interface HypothesisCandidate {
    candidate_id: string;
    proposed_model: Partial<HypothesisModel>;
    generation_logic: string;
}
