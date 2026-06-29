import { PrincipleStatus, PrincipleMetricsData } from "./principle_types.js";
import { PrincipleEvidence } from "./principle_evidence.js";

export interface PrincipleModel {
    principle_id: string;
    name: string;
    description: string;
    domains: string[];
    confidence: number;
    status: PrincipleStatus;
    
    supporting_mechanisms: string[];
    supporting_processes: string[];
    supporting_experiences: string[];
    supporting_patterns: string[];
    
    evidence: PrincipleEvidence[];
    counter_examples: PrincipleEvidence[];
    
    applicability_boundaries: string[];
    assumptions: string[];

    metrics: PrincipleMetricsData;

    created_at: number;
    updated_at: number;
}
