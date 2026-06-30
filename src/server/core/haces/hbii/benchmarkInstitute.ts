import { GoogleGenAI } from "@google/genai";
import { BenchmarkManager } from "./benchmarkManager.js";
import { IntelligenceEvaluationEngine } from "./intelligenceEvaluation.js";
import { BenchmarkSelectionEngine } from "./benchmarkSelection.js";
import { RegressionIntelligenceEngine } from "./regressionIntelligence.js";
import { IntelligencePassportSystem } from "./intelligencePassport.js";
import { BenchmarkGenomeSystem } from "./benchmarkGenome.js";
import { ComparativeIntelligenceAnalyzer } from "./comparativeAnalyzer.js";
import { StatisticalValidationOffice } from "./statisticalValidation.js";
import { GeneralizationAssessmentOffice } from "./generalizationAssessment.js";
import { BenchmarkRecommendationEngine } from "./benchmarkRecommendation.js";
import { IntelligenceTrendObservatory } from "./trendObservatory.js";
import { IntelligenceReportsGenerator } from "./intelligenceReports.js";
import { BenchmarkEventBus, BenchmarkEvents } from "./benchmarkEvents.js";
import { BenchmarkMetrics } from "./benchmarkMetrics.js";

export class HyperMindBenchmarkIntelligenceInstitute {
    private eventBus = BenchmarkEventBus.getInstance();

    public manager = new BenchmarkManager();
    public evaluator = new IntelligenceEvaluationEngine();
    public selection = new BenchmarkSelectionEngine(this.manager);
    public regression = new RegressionIntelligenceEngine();
    public passportSys = new IntelligencePassportSystem();
    public genomeSys = new BenchmarkGenomeSystem();
    public comparativeAnalyzer = new ComparativeIntelligenceAnalyzer();
    public statisticalOffice = new StatisticalValidationOffice();
    public generalizationOffice = new GeneralizationAssessmentOffice();
    public recommender = new BenchmarkRecommendationEngine();
    public trendObservatory = new IntelligenceTrendObservatory();
    public reportGen = new IntelligenceReportsGenerator();

    public async runFullEvaluation(ai: GoogleGenAI, currentVersion: string, previousProfile?: any, benchmarkResults: any[] = []): Promise<any> {
        this.eventBus.publish(BenchmarkEvents.BENCHMARK_STARTED, { version: currentVersion });
        
        // Evaluate raw results into a profile
        const profile = await this.evaluator.evaluateCapabilities(ai, benchmarkResults, currentVersion);
        
        // Assess generalization
        const generalization = await this.generalizationOffice.assessGeneralization(ai, profile);
        
        // Statistical validation
        const validation = this.statisticalOffice.validateResults(benchmarkResults);

        // Update overall Continuous Intelligence Index (CII)
        BenchmarkMetrics.updateCII(profile.continuous_intelligence_index);

        let regressionAnalysis = null;
        if (previousProfile) {
            regressionAnalysis = this.regression.analyzeRegressions(previousProfile, profile);
        }

        const safetyScore = 95; // Mock safety score
        const passport = this.passportSys.generatePassport(profile, safetyScore);
        
        this.trendObservatory.addProfile(profile);

        let report = null;
        if (regressionAnalysis) {
            report = this.reportGen.generateExecutiveReport(profile, regressionAnalysis, passport.passport_id);
        }

        this.eventBus.publish(BenchmarkEvents.BENCHMARK_COMPLETED, { version: currentVersion, cii: profile.continuous_intelligence_index });

        return {
            profile,
            generalization,
            validation,
            regressionAnalysis,
            passport,
            report
        };
    }
}
