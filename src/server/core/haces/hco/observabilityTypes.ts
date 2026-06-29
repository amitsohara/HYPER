export enum MetricCategory {
    REASONING = "REASONING",
    PLANNING = "PLANNING",
    MEMORY = "MEMORY",
    LEARNING = "LEARNING",
    WORLD_MODEL = "WORLD_MODEL",
    ENGINEERING = "ENGINEERING",
    RESEARCH = "RESEARCH"
}

export interface TelemetrySample {
    sample_id: string;
    category: MetricCategory;
    metric_name: string;
    value: number;
    timestamp: number;
    context?: any;
}

export interface HealthMetric {
    category: MetricCategory;
    current_value: number;
    historical_trend: "IMPROVING" | "STABLE" | "DEGRADING";
    confidence: number;
    contributing_factors: string[];
    recommended_actions: string[];
}

export interface CognitiveHealthProfile {
    profile_id: string;
    timestamp: number;
    metrics: Record<string, HealthMetric>;
    overall_health_score: number;
}

export interface PerformanceSnapshot {
    snapshot_id: string;
    timestamp: number;
    mission_success_rate: number;
    average_latency_ms: number;
    resource_efficiency: number;
    throughput: number;
    reliability: number;
}

export interface Bottleneck {
    bottleneck_id: string;
    category: MetricCategory;
    description: string;
    impact_score: number;
    detected_at: number;
    is_active: boolean;
}

export interface TrendAnalysis {
    trend_id: string;
    metric_name: string;
    direction: "UP" | "DOWN" | "FLAT";
    magnitude: number;
    significance: number;
    start_time: number;
    end_time: number;
}

export interface PredictiveForecast {
    forecast_id: string;
    target_metric: string;
    predicted_value: number;
    probability: number;
    timeframe_ms: number;
    risk_level: "LOW" | "MEDIUM" | "HIGH";
    created_at: number;
}

export interface EvolutionReadiness {
    readiness_score: number;
    evidence_quality: number;
    research_maturity: number;
    benchmark_confidence: number;
    risk_level: number;
    resource_availability: number;
    expected_capability_gain: number;
    is_ready: boolean;
    timestamp: number;
}

export interface CapabilityProfile {
    capabilities: Record<string, number>;
    timestamp: number;
}

export interface CognitiveGenome {
    genome_id: string;
    version: string;
    active_modules: string[];
    relationships: Array<{ source: string; target: string; type: string }>;
    data_flows: Array<{ source: string; target: string; description: string }>;
    dependency_graph: Record<string, string[]>;
    capability_graph: Record<string, string[]>;
    timestamp: number;
}

export interface DigitalTwinState {
    twin_id: string;
    timestamp: number;
    genome: CognitiveGenome;
    health_profile: CognitiveHealthProfile;
    capability_profile: CapabilityProfile;
    performance: PerformanceSnapshot;
    active_bottlenecks: Bottleneck[];
    evolution_readiness: EvolutionReadiness;
    active_missions: string[];
    research_priorities: string[];
}

export interface ObservatoryDashboard {
    dashboard_id: string;
    target_audience: "EEC" | "HERA" | "HCOS" | "ENGINEERING" | "RESEARCH" | "HUMAN";
    panels: Array<{
        title: string;
        type: "METRIC" | "CHART" | "LIST" | "GRAPH";
        data: any;
    }>;
    generated_at: number;
}
