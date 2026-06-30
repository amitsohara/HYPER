import { v4 as uuidv4 } from "uuid";
import { InvestmentPortfolio } from "./strategyTypes.js";
import { StrategyEventBus, StrategyEvents } from "./strategyEvents.js";
import { StrategyPolicies } from "./strategyPolicies.js";

export class IntelligencePortfolioManager {
    private eventBus = StrategyEventBus.getInstance();
    private currentPortfolio: InvestmentPortfolio | null = null;

    public rebalancePortfolio(allocations: Record<string, number>, total_budget: number = 100): InvestmentPortfolio {
        // Enforce policies
        const adjustedAllocations = { ...allocations };
        if (adjustedAllocations['RESEARCH'] < StrategyPolicies.MIN_RESEARCH_INVESTMENT * total_budget) {
            adjustedAllocations['RESEARCH'] = StrategyPolicies.MIN_RESEARCH_INVESTMENT * total_budget;
        }

        const portfolio: InvestmentPortfolio = {
            portfolio_id: uuidv4(),
            timestamp: Date.now(),
            allocations: adjustedAllocations,
            total_budget
        };

        this.currentPortfolio = portfolio;
        this.eventBus.publish(StrategyEvents.INVESTMENT_REBALANCED, portfolio);
        
        return portfolio;
    }

    public getPortfolio(): InvestmentPortfolio | null {
        return this.currentPortfolio;
    }
}
