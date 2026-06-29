import { GapClassifier } from "./gapClassifier.js";
import { CapabilityGraph } from "./capabilityGraph.js";
import { CapabilityReuseEngine } from "./capabilityReuseEngine.js";
import { CapabilityInnovationEngine } from "./capabilityInnovationEngine.js";
import { CapabilityGenomeRepository } from "./capabilityGenome.js";
import { ImpactSimulator } from "./impactSimulator.js";
import { DependencyAnalyzer } from "./dependencyAnalyzer.js";
import { RecommendationEngine } from "./recommendationEngine.js";
import { RoadmapGenerator } from "./roadmapGenerator.js";
import { GapMetricsCollector } from "./gapMetrics.js";
import { GapAssessment, AnyGap, EvolutionRecommendation, CapabilityProposal } from "./gapTypes.js";
import { GapEventBus, GapEvents } from "./gapEvents.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class CognitiveCapabilityGapDiscovery {
    public gapClassifier = new GapClassifier();
    public capabilityGraph = new CapabilityGraph();
    public reuseEngine = new CapabilityReuseEngine(this.capabilityGraph);
    public impactSimulator = new ImpactSimulator();
    public innovationEngine = new CapabilityInnovationEngine(this.impactSimulator);
    public genomeRepository = new CapabilityGenomeRepository();
    public dependencyAnalyzer = new DependencyAnalyzer(this.capabilityGraph);
    public recommendationEngine = new RecommendationEngine();
    public roadmapGenerator = new RoadmapGenerator();
    private eventBus = GapEventBus.getInstance();

    private allGaps: AnyGap[] = [];
    private allRecommendations: EvolutionRecommendation[] = [];

    public analyzeDiagnostics(diagnosticReports: any[]): EvolutionRecommendation[] {
        const evidence = diagnosticReports.flatMap(r => r.causal_graph ? r.causal_graph.nodes.map((n:any) => ({ description: n.description })) : []);
        
        // 1. Identify Gaps
        const gaps = this.gapClassifier.classifyEvidence(evidence);
        this.allGaps.push(...gaps);

        const assessmentId = uuidv4();
        const recommendations: EvolutionRecommendation[] = [];

        for (const gap of gaps) {
            this.eventBus.publish(GapEvents.GAP_DETECTED, { gap });

            // 2. CEDM Interventions
            let reusedCap = this.reuseEngine.findReusableCapability(gap);
            let proposal: CapabilityProposal | undefined = undefined;

            if (!reusedCap && (gap.type === "CAPABILITY" || gap.type === "ALGORITHM" || gap.type === "ARCHITECTURE")) {
                proposal = this.innovationEngine.proposeNewCapability(gap);
                const depCheck = this.dependencyAnalyzer.analyzeDependencies(proposal.dependencies);
                if (!depCheck.valid) {
                    proposal = undefined; // Reject if invalid dependencies
                }
            }

            // 3. Evaluation
            const rec = this.recommendationEngine.generateRecommendation(gap, assessmentId, proposal, reusedCap?.capability_id);
            if (rec) {
                recommendations.push(rec);
                this.allRecommendations.push(rec);
            }
        }

        // 4. Update Roadmap
        this.roadmapGenerator.generateRoadmap(this.allRecommendations);

        return recommendations;
    }

    public getMetrics() {
        return GapMetricsCollector.collectMetrics(this.allGaps, this.allRecommendations);
    }
}
