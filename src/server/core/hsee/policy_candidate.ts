import { PolicyStatus, PolicyTarget, PerformanceMetrics } from "./evolution_types.js";

export interface PolicyCandidate {
    policy_id: string;
    version: number;
    target: PolicyTarget;
    description: string;
    changes: any; // The actual configuration changes
    status: PolicyStatus;
    validation_score?: number;
    benchmark_metrics?: PerformanceMetrics;
    created_at: number;
    updated_at: number;
    reason: string;
}
