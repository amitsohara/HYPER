export interface DiscoveryCandidate {
    candidate_id: string;
    source_branch_id: string;
    description: string;
    type: "STRATEGY" | "MECHANISM" | "COMBINATION" | "OPTIMIZATION";
    novelty_score: number;
    impact_score: number;
    created_at: number;
}
