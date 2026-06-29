import { RootCauseAnalyzer } from "./rootCauseAnalyzer.js";
import { SuccessAnalyzer } from "./successAnalyzer.js";
import { FailureAnalyzer } from "./failureAnalyzer.js";
import { CausalGraphBuilder } from "./causalGraphBuilder.js";
import { SystemicPatternAnalyzer } from "./systemicPatternAnalyzer.js";
import { CounterfactualAnalyzer } from "./counterfactualAnalyzer.js";
import { DiagnosticConfidenceEngine } from "./diagnosticConfidence.js";
import { RemediationEngine } from "./remediationEngine.js";
import { FailureGenomeRepository } from "./failureGenome.js";
import { SuccessGenomeRepository } from "./successGenome.js";
import { DiagnosticKnowledgeBase } from "./diagnosticKnowledgeBase.js";
import { CognitiveAutopsySystem } from "./cognitiveAutopsySystem.js";
import { DiagnosticMetricsCollector } from "./diagnosticMetrics.js";
import { DiagnosticEventBus, DiagnosticEvents } from "./diagnosticEvents.js";
import { DiagnosticPolicies } from "./diagnosticPolicies.js";
import { DiagnosisReport, DiagnosisType, DiagnosticEvidence } from "./diagnosticTypes.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class CognitiveDiagnosisEngine {
    public rootCauseAnalyzer = new RootCauseAnalyzer();
    public successAnalyzer = new SuccessAnalyzer();
    public failureAnalyzer = new FailureAnalyzer();
    public causalGraphBuilder = new CausalGraphBuilder();
    public patternAnalyzer = new SystemicPatternAnalyzer();
    public counterfactualAnalyzer = new CounterfactualAnalyzer();
    public confidenceEngine = new DiagnosticConfidenceEngine();
    public remediationEngine = new RemediationEngine();
    public failureGenome = new FailureGenomeRepository();
    public successGenome = new SuccessGenomeRepository();
    public knowledgeBase = new DiagnosticKnowledgeBase();
    public autopsySystem = new CognitiveAutopsySystem();
    private eventBus = DiagnosticEventBus.getInstance();

    public diagnoseMission(missionData: any, evidence: DiagnosticEvidence[]): DiagnosisReport {
        this.eventBus.publish(DiagnosticEvents.DIAGNOSIS_STARTED, { mission_id: missionData.mission_id });

        const reportId = uuidv4();
        const type = missionData.success ? DiagnosisType.SUCCESS : DiagnosisType.FAILURE;

        // 1. Root Cause Analysis
        const rootCause = this.rootCauseAnalyzer.analyze(evidence);
        const contributingFactors = this.rootCauseAnalyzer.findContributingFactors(evidence);

        // 2. Confidence Assessment
        const confidence = this.confidenceEngine.computeConfidence(evidence, rootCause);

        // 3. Causal Graph Generation
        const causalGraph = this.causalGraphBuilder.build(rootCause, contributingFactors, ["Mission Outcome"]);

        // 4. Success / Failure Generation
        let autopsy;
        if (type === DiagnosisType.SUCCESS) {
            const successRecord = this.successAnalyzer.analyze(missionData, confidence);
            this.successGenome.save(successRecord);
            if (DiagnosticPolicies.requiresAutopsy(missionData)) {
                autopsy = this.autopsySystem.performAutopsy(missionData, causalGraph);
            }
        } else {
            const failureRecord = this.failureAnalyzer.analyze(missionData, evidence, rootCause, contributingFactors, confidence);
            this.failureGenome.save(failureRecord);
            
            if (DiagnosticPolicies.requiresAutopsy(missionData)) {
                autopsy = this.autopsySystem.performAutopsy(missionData, causalGraph);
            }
            
            // Generate Counterfactuals for failures
            this.counterfactualAnalyzer.generate(missionData);
        }

        // 5. Remediation Recommendations
        const recommendations = this.remediationEngine.generateRecommendations(reportId, rootCause, confidence);

        // 6. Systemic Patterns Update
        this.patternAnalyzer.detectPatterns(this.knowledgeBase.getAllReports());

        const report: DiagnosisReport = {
            report_id: reportId,
            type,
            mission_id: missionData.mission_id || "unknown",
            autopsy,
            causal_graph: causalGraph,
            confidence,
            recommendations,
            timestamp: Date.now()
        };

        this.knowledgeBase.storeReport(report);
        this.eventBus.publish(DiagnosticEvents.DIAGNOSIS_COMPLETED, { report });

        return report;
    }

    public getMetrics() {
        return DiagnosticMetricsCollector.collectMetrics(
            this.knowledgeBase,
            this.failureGenome,
            this.successGenome
        );
    }
}
