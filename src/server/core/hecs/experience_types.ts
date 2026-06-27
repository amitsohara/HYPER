export interface Experience {
    experience_id: string;
    mission_id: string;
    mission: string;
    mission_domain: string;
    mission_type: string;
    mission_complexity: number;
    timestamp: number;
    context: any;
    modules_used: string[];
    reasoning_summary: string;
    imagined_world_summary: string;
    evidence_summary: any;
    decision_summary: string;
    action_summary: string;
    predicted_outcome: string;
    actual_outcome: string;
    prediction_error: number;
    confidence: number;
    uncertainty: number;
    success_score: number;
    usefulness_score: number;
    novelty_score: number;
    quality_score?: number;
    reflection_result?: any;
    domain_tags: string[];
    lessons: string[];
    mistakes: string[];
    strengths: string[];
    weaknesses: string[];
    reusable_patterns: string[];
    transferable_skills: string[];
    related_experiences: string[];
    // HCW provenance
    workspace_id?: string;
    snapshot_id?: string;
    relevant_subgraph_ids?: string[];
}

export interface HECSSkill {
    skill_id: string;
    skill_name: string;
    domain: string;
    description: string;
    trigger_conditions: string[];
    steps: string[];
    source_experience_ids: string[];
    success_rate: number;
    confidence: number;
    version: number;
    last_updated: number;
}

export interface HECSStrategy {
    strategy_id: string;
    strategy_name: string;
    domain: string;
    mission_types: string[];
    description: string;
    steps: string[];
    required_capabilities: string[];
    known_risks: string[];
    best_for: string[];
    avoid_when: string[];
    source_experience_ids: string[];
    success_rate: number;
    confidence: number;
    version: number;
}

export interface ExperienceMetrics {
    total_experiences: number;
    successful_experiences: number;
    failed_experiences: number;
    average_confidence: number;
    average_success: number;
    average_novelty: number;
    transferability_score: number;
    competence_coverage: number;
}

export interface ExperienceTransfer {
    transfer_id: string;
    source_experience_id: string;
    target_mission_id: string;
    source_domain: string;
    target_domain: string;
    analogy: string;
    transferable_patterns: string[];
    non_transferable_patterns: string[];
    transferability_score: number;
    risk_of_negative_transfer: number;
    confidence: number;
    reasoning: string;
}
