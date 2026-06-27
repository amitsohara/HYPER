export enum AbstractionType {
    LESSON = 'LESSON',
    PATTERN = 'PATTERN',
    SKILL = 'SKILL',
    STRATEGY = 'STRATEGY',
    PRINCIPLE = 'PRINCIPLE',
    MENTAL_MODEL = 'MENTAL_MODEL',
    CONCEPT = 'CONCEPT'
}

export interface Abstraction {
    abstraction_id: string;
    abstraction_type: AbstractionType;
    title: string;
    description: string;
    source_experience_ids: string[];
    source_domains: string[];
    confidence: number;
    support_count: number;
    contradiction_count: number;
    transferability: number;
    evidence_strength: number;
    created_at: number;
    updated_at: number;
    version: number;
}
