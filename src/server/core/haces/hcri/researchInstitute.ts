import { ResearchQuestionManager } from "./researchQuestionManager.ts";
import { HypothesisManager } from "./hypothesisManager.ts";
import { LiteratureIntelligenceEngine } from "./literatureIntelligence.ts";
import { CognitiveTheoryEngine } from "./cognitiveTheoryEngine.ts";
import { AutonomousExperimentationFramework } from "./autonomousExperimentation.ts";
import { ExperimentPortfolio } from "./experimentPortfolio.ts";
import { AlgorithmDiscoveryEngine } from "./algorithmDiscovery.ts";
import { TechnologyRadar } from "./technologyRadar.ts";
import { ResearchKnowledgeGraph } from "./researchKnowledgeGraph.ts";
import { ImpactAssessmentEngine } from "./impactAssessment.ts";
import { ScientificRecommendationEngine } from "./scientificRecommendation.ts";
import { ResearchReportGenerator } from "./researchReports.ts";
import { ResearchMetricsCollector } from "./researchMetrics.ts";
import { SDPSession } from "./researchTypes.ts";
import { ResearchEventBus, ResearchEvents } from "./researchEvents.ts";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class ResearchInstitute {
    public questions = new ResearchQuestionManager();
    public hypotheses = new HypothesisManager();
    public literature = new LiteratureIntelligenceEngine();
    public theories = new CognitiveTheoryEngine();
    public experimentation = new AutonomousExperimentationFramework();
    public portfolio = new ExperimentPortfolio();
    public algorithmDiscovery = new AlgorithmDiscoveryEngine();
    public technologyRadar = new TechnologyRadar();
    public knowledgeGraph = new ResearchKnowledgeGraph();
    public impactAssessment = new ImpactAssessmentEngine();
    public recommendationEngine = new ScientificRecommendationEngine();
    public reports = new ResearchReportGenerator();
    private eventBus = ResearchEventBus.getInstance();

    // Scientific Discovery Pipeline (SDP)
    public runScientificDiscoveryPipeline(objective: string): SDPSession {
        const session: SDPSession = {
            session_id: uuidv4(),
            question_id: "",
            stage: "OBSERVATION"
        };
        
        // 1. Observation -> Question
        const q = this.questions.createQuestion({
            objective,
            motivation: "Observed performance gap",
            priority: 90,
            dependencies: [],
            expected_impact: 80,
            measurable_success_criteria: ["10% improvement"]
        });
        session.question_id = q.question_id;
        session.stage = "QUESTION";

        // 2. Hypothesis
        const h = this.hypotheses.createHypothesis({
            question_id: q.question_id,
            statement: "Applying X will improve Y",
            supporting_evidence: [],
            competing_hypotheses: [],
            expected_outcome: "Performance improves",
            evaluation_plan: "Run benchmark A",
            success_metrics: ["Accuracy"],
            confidence: 50
        });
        session.hypothesis_id = h.hypothesis_id;
        session.stage = "HYPOTHESIS";

        // 3. Literature Review
        const evidence = this.literature.search("Applying X");
        session.stage = "LITERATURE_REVIEW";

        // 4. Experiment Design
        const exp = this.experimentation.designExperiment(h.hypothesis_id);
        this.portfolio.addExperiment(exp);
        session.experiment_id = exp.experiment_id;
        session.stage = "EXPERIMENT_DESIGN";

        // 5. Simulation & Execution
        session.stage = "EXECUTION";
        const result = this.experimentation.executeExperiment(exp);
        this.portfolio.addResult(result);
        session.result_id = result.result_id;
        
        // 6. Analysis & Algorithm Discovery
        session.stage = "ANALYSIS";
        this.algorithmDiscovery.evaluateResult(result);

        // 7. Peer Review
        session.stage = "PEER_REVIEW";
        const feedback = this.experimentation.peerReview(session, result);

        // 8. Conclusion & Theory Update
        session.stage = "CONCLUSION";
        const theory = this.theories.createOrUpdateTheory(`Theory of ${objective}`, h.statement, result.evidence_collected[0]?.evidence_id || "");
        session.final_conclusion = result.conclusion;

        // 9. Recommendation
        session.stage = "RECOMMENDATION";
        const impact = this.impactAssessment.assess(h, result);
        const rec = this.recommendationEngine.generateRecommendation(h, impact);

        // Update Graph
        this.knowledgeGraph.addNode(q.question_id, "Question", q);
        this.knowledgeGraph.addNode(h.hypothesis_id, "Hypothesis", h);
        this.knowledgeGraph.addEdge(q.question_id, h.hypothesis_id, "EXPLORED_BY");

        this.eventBus.publish(ResearchEvents.PIPELINE_STAGE_CHANGED, { session });

        return session;
    }

    public getMetrics() {
        return ResearchMetricsCollector.collectMetrics(
            this.questions,
            this.hypotheses,
            this.portfolio,
            this.theories
        );
    }
}
