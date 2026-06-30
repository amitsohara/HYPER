import { GoogleGenAI } from "@google/genai";
import { EvolutionRoadmapOffice } from "./roadmapOffice.js";
import { StrategicIntelligenceEngine } from "./strategicIntelligence.js";
import { IntelligencePortfolioManager } from "./portfolioManager.js";
import { FutureScenarioSimulator } from "./futureScenarioSimulator.js";
import { EvolutionOpportunityAnalyzer } from "./opportunityAnalyzer.js";
import { StrategicRiskOffice } from "./strategicRisk.js";
import { CapabilityInvestmentPlanner } from "./investmentPlanner.js";
import { EvolutionPolicyAdvisor } from "./policyAdvisor.js";
import { ExecutiveDecisionSupport } from "./executiveDashboard.js";
import { CivilizationPlanner } from "./civilizationPlanner.js";
import { StrategyRecommendationEngine } from "./strategyRecommendation.js";
import { StrategicReportsGenerator } from "./strategyReports.js";
import { EvolutionGrandStrategyEngine } from "./evolutionGrandStrategy.js";
import { StrategyEventBus, StrategyEvents } from "./strategyEvents.js";
import { StrategyMetrics } from "./strategyMetrics.js";
import { EvolutionGrandStrategy } from "./strategyTypes.js";

export class HyperMindEvolutionStrategyOffice {
    private eventBus = StrategyEventBus.getInstance();
    
    public roadmapOffice = new EvolutionRoadmapOffice();
    public intelligenceEngine = new StrategicIntelligenceEngine();
    public portfolioManager = new IntelligencePortfolioManager();
    public scenarioSimulator = new FutureScenarioSimulator();
    public opportunityAnalyzer = new EvolutionOpportunityAnalyzer();
    public riskOffice = new StrategicRiskOffice();
    public investmentPlanner = new CapabilityInvestmentPlanner();
    public policyAdvisor = new EvolutionPolicyAdvisor();
    public dashboardSupport = new ExecutiveDecisionSupport();
    public civilizationPlanner = new CivilizationPlanner();
    public recommendationEngine = new StrategyRecommendationEngine();
    public reportsGenerator = new StrategicReportsGenerator();
    
    public grandStrategyEngine = new EvolutionGrandStrategyEngine(
        this.roadmapOffice,
        this.portfolioManager,
        this.recommendationEngine,
        this.civilizationPlanner
    );

    public async performStrategicPlanning(ai: GoogleGenAI, systemContext: any): Promise<EvolutionGrandStrategy> {
        console.log("[HESO] Initiating Strategic Planning Cycle...");

        // Gather intelligence
        const intelligence = await this.intelligenceEngine.evaluateCurrentState(ai, systemContext);
        
        // Analyze risks and opportunities
        const risks = this.riskOffice.assessRisks(systemContext);
        const opportunities = this.opportunityAnalyzer.analyzeOpportunities(intelligence);
        
        // Simulate scenarios
        await this.scenarioSimulator.simulateScenarios(ai, systemContext, systemContext.hem);
        
        // Generate dashboard
        this.dashboardSupport.generateDashboard(intelligence, risks, ["Enhance Reasoning", "Scale Simulation"]);
        
        // Formulate grand strategy
        const strategy = await this.grandStrategyEngine.formulateGrandStrategy(ai, systemContext);

        return strategy;
    }
}
