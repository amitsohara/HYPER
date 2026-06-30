import { v4 as uuidv4 } from "uuid";

export enum StrategyTimeframe {
    SHORT_TERM = "1_GENERATION",
    MEDIUM_TERM = "5_GENERATIONS",
    LONG_TERM = "10_GENERATIONS",
    VERY_LONG_TERM = "25_GENERATIONS",
    CIVILIZATION = "100_GENERATIONS"
}

export enum StrategicPriority {
    CRITICAL = "CRITICAL",
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW"
}

export interface StrategicObjective {
    objective_id: string;
    description: string;
    target_timeframe: StrategyTimeframe;
    expected_intelligence_gain: number;
    priority: StrategicPriority;
    status: 'PLANNED' | 'ACTIVE' | 'ACHIEVED' | 'ABANDONED';
}

export interface EvolutionRoadmap {
    roadmap_id: string;
    version: string;
    timeframe: StrategyTimeframe;
    objectives: StrategicObjective[];
    dependencies: string[];
    risk_analysis: string;
    review_schedule: number;
    timestamp: number;
}

export interface StrategicInitiative {
    initiative_id: string;
    name: string;
    description: string;
    required_investment: number;
    expected_return: number;
    status: 'PROPOSED' | 'APPROVED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export interface InvestmentPortfolio {
    portfolio_id: string;
    timestamp: number;
    allocations: Record<string, number>; // e.g. { 'REASONING': 30, 'RESEARCH': 20 }
    total_budget: number;
}

export interface FutureScenario {
    scenario_id: string;
    name: string;
    description: string;
    assumptions: string[];
    projected_outcomes: string[];
    probability: number;
    timestamp: number;
}

export interface StrategicOpportunity {
    opportunity_id: string;
    category: 'TECHNOLOGY' | 'RESEARCH' | 'ARCHITECTURE' | 'ENGINEERING' | 'CROSS_DOMAIN';
    description: string;
    potential_value: number;
    confidence: number;
    timestamp: number;
}

export interface StrategicRisk {
    risk_id: string;
    category: 'TECHNICAL' | 'RESEARCH' | 'SAFETY' | 'ARCHITECTURAL' | 'RESOURCE' | 'STRATEGIC' | 'EMERGENT_BEHAVIOR';
    description: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    mitigation_strategy: string;
    timestamp: number;
}

export interface CapabilityInvestment {
    capability_name: string;
    expected_roi: number;
    risk_level: number;
    recommended_allocation: number;
}

export interface StrategyRecommendation {
    recommendation_id: string;
    action: 'CONTINUE' | 'INCREASE_RESEARCH' | 'NEW_ARCHITECTURE' | 'EXPAND_ENGINEERING' | 'NEW_BENCHMARK' | 'RETIRE_CAPABILITY' | 'MERGE_PROGRAMS' | 'DELAY_EVOLUTION' | 'ESCALATE';
    description: string;
    evidence: string[];
    expected_value: number;
    risk: number;
    confidence: number;
    resource_estimate: number;
    timestamp: number;
}

export interface ExecutiveDashboard {
    dashboard_id: string;
    timestamp: number;
    current_intelligence_profile: any;
    evolution_velocity: number;
    research_productivity: number;
    engineering_productivity: number;
    long_term_risks: string[];
    strategic_priorities: string[];
}

export interface CivilizationForecast {
    forecast_id: string;
    timestamp: number;
    decades_ahead: number;
    capability_growth_projection: number;
    infrastructure_requirements: string;
    human_collaboration_model: string;
    sustainability_rating: number;
}

export interface StrategyReport {
    report_id: string;
    type: 'ANNUAL' | 'QUARTERLY' | 'FORECAST' | 'EXECUTIVE_SUMMARY';
    content: string;
    recommendations: string[];
    timestamp: number;
}

export interface EvolutionGrandStrategy {
    strategy_id: string;
    timestamp: number;
    roadmap: EvolutionRoadmap;
    portfolio: InvestmentPortfolio;
    top_recommendations: StrategyRecommendation[];
    civilization_forecast: CivilizationForecast;
}
