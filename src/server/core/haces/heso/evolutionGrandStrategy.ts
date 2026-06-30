import { v4 as uuidv4 } from "uuid";
import { EvolutionGrandStrategy, StrategyTimeframe } from "./strategyTypes.js";
import { StrategyEventBus, StrategyEvents } from "./strategyEvents.js";
import { EvolutionRoadmapOffice } from "./roadmapOffice.js";
import { IntelligencePortfolioManager } from "./portfolioManager.js";
import { StrategyRecommendationEngine } from "./strategyRecommendation.js";
import { CivilizationPlanner } from "./civilizationPlanner.js";

export class EvolutionGrandStrategyEngine {
    private eventBus = StrategyEventBus.getInstance();

    constructor(
        private roadmapOffice: EvolutionRoadmapOffice,
        private portfolioManager: IntelligencePortfolioManager,
        private recommender: StrategyRecommendationEngine,
        private civPlanner: CivilizationPlanner
    ) {}

    public async formulateGrandStrategy(ai: any, context: any): Promise<EvolutionGrandStrategy> {
        
        const roadmap = this.roadmapOffice.createRoadmap(StrategyTimeframe.LONG_TERM, [], "v_next");
        const portfolio = this.portfolioManager.rebalancePortfolio({ RESEARCH: 30, ENGINEERING: 70 }, 100);
        const recommendations = this.recommender.generateRecommendations([], [], portfolio);
        const forecast = await this.civPlanner.forecastCivilization(ai, 1, context);

        const strategy: EvolutionGrandStrategy = {
            strategy_id: uuidv4(),
            timestamp: Date.now(),
            roadmap,
            portfolio,
            top_recommendations: recommendations,
            civilization_forecast: forecast
        };

        this.eventBus.publish(StrategyEvents.GRAND_STRATEGY_FORMULATED, strategy);
        this.eventBus.publish(StrategyEvents.GOVERNANCE_PROPOSAL_PREPARED, strategy);

        return strategy;
    }
}
