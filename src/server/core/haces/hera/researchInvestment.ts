import { ResearchInvestment, ResearchInitiative } from "./researchTypes.js";

export class ResearchInvestmentEngine {
    public evaluateInvestment(initiative: ResearchInitiative): ResearchInvestment {
        const expected_capability_gain = initiative.expected_impact;
        const strategic_importance = 80;
        const mission_frequency = 60;
        const engineering_cost = initiative.hypothesis.estimated_cost.engineering_effort;
        const research_cost = initiative.hypothesis.estimated_cost.time_days * 10;
        const risk = 30;
        const long_term_value = 90;
        const compute_cost = initiative.hypothesis.estimated_cost.compute;
        
        // ROI Calculation: (Value * Gain) / (Cost * Risk)
        const totalValue = (expected_capability_gain * 0.4 + strategic_importance * 0.3 + long_term_value * 0.3);
        const totalCost = (engineering_cost + research_cost + compute_cost) * Math.max(risk, 1) / 100;
        
        const roi = totalCost > 0 ? (totalValue / totalCost) * 100 : 0;
        
        return {
            initiative_id: initiative.initiative_id,
            expected_capability_gain,
            strategic_importance,
            mission_frequency,
            engineering_cost,
            research_cost,
            risk,
            long_term_value,
            compute_cost,
            roi
        };
    }
}
