import { HypothesisStatus, Prediction } from "./hypothesis_types.js";

export interface Evidence {
    evidence_id: string;
    description: string;
    supports: boolean;
    strength: number; // 0-100
}

export interface HypothesisModel {
    hypothesis_id: string;
    title: string;
    description: string;
    origin: string;
    
    supporting_evidence: Evidence[];
    supporting_mechanisms: string[];
    supporting_principles: string[];
    
    predictions: Prediction[];
    assumptions: string[];
    limitations: string[];
    
    confidence: number;
    status: HypothesisStatus;
    
    counter_examples: Evidence[];
    
    created_at: number;
    updated_at: number;
}
