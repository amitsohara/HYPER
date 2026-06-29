import { ResearchPortfolio } from "./researchPortfolio.js";
import { ResearchRoadmap } from "./researchRoadmap.js";
import { WeaknessDiscovery } from "./weaknessDiscovery.js";
import { FrontierExplorer } from "./frontierExplorer.js";
import { TechnologyRadar } from "./technologyRadar.js";
import { OpportunityScanner } from "./opportunityScanner.js";
import { GrandChallengeManager } from "./grandChallengeManager.js";
import { IntelligencePotentialMap } from "./intelligencePotentialMap.js";
import { ResearchInvestmentEngine } from "./researchInvestment.js";
import { ResearchRecommendationEngine } from "./researchRecommendation.js";
import { AnnualRoadmapGenerator } from "./annualRoadmap.js";
import { ResearchHypothesisPipeline } from "./researchHypothesisPipeline.js";
import { ResearchMetricsCollector } from "./researchMetrics.js";

export class AgendaManager {
    public portfolio = new ResearchPortfolio();
    public roadmap = new ResearchRoadmap();
    public weaknessDiscovery = new WeaknessDiscovery();
    public technologyRadar = new TechnologyRadar();
    public frontierExplorer = new FrontierExplorer(this.technologyRadar);
    public opportunityScanner = new OpportunityScanner();
    public grandChallenges = new GrandChallengeManager();
    public intelligenceMap = new IntelligencePotentialMap();
    public investmentEngine = new ResearchInvestmentEngine();
    public recommendationEngine = new ResearchRecommendationEngine();
    public annualRoadmap = new AnnualRoadmapGenerator();
    public hypothesisPipeline = new ResearchHypothesisPipeline();

    public runCycle() {
        // 1. Discover Weaknesses from recent missions (Normally driven by events)
        // 2. Explore Frontiers
        this.frontierExplorer.explore();
        // 3. Scan Opportunities
        this.opportunityScanner.scan();
        // 4. Update Intelligence Potential Map
        this.intelligenceMap.generateMap({
            REASONING: 80,
            PLANNING: 60,
            MEMORY: 90
        });

        // 5. Evaluate Investments & Recommendations for Active/Proposed Initiatives
        for (const initiative of this.portfolio.getAllInitiatives()) {
            const investment = this.investmentEngine.evaluateInvestment(initiative);
            this.recommendationEngine.generateRecommendation(initiative, investment);
        }
    }

    public generateAnnualReport() {
        return this.annualRoadmap.generateAnnualReport({
            profile: this.intelligenceMap.getProfile(),
            weaknesses: this.weaknessDiscovery.getWeaknesses(),
            opportunities: this.opportunityScanner.getOpportunities(),
            priorities: this.portfolio.getActiveInitiatives(),
            technologies: this.technologyRadar.getTechnologies(),
            milestones: this.roadmap.getAllItems(),
            recommendations: [] // Would collect from recommendation engine
        });
    }

    public getMetrics() {
        return ResearchMetricsCollector.collectMetrics(
            this.portfolio,
            this.weaknessDiscovery,
            this.grandChallenges
        );
    }
}
