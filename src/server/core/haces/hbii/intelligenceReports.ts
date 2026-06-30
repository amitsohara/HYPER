import { v4 as uuidv4 } from "uuid";
import { ExecutiveBenchmarkReport, IntelligenceProfile, RegressionAnalysis } from "./benchmarkTypes.js";
import { BenchmarkEventBus, BenchmarkEvents } from "./benchmarkEvents.js";

export class IntelligenceReportsGenerator {
    private eventBus = BenchmarkEventBus.getInstance();

    public generateExecutiveReport(profile: IntelligenceProfile, regressionAnalysis: RegressionAnalysis, passport_id: string): ExecutiveBenchmarkReport {
        const report: ExecutiveBenchmarkReport = {
            report_id: uuidv4(),
            timestamp: Date.now(),
            version: profile.version,
            cii_score: profile.continuous_intelligence_index,
            key_improvements: regressionAnalysis.improvements_detected.map(i => i.description),
            key_regressions: regressionAnalysis.regressions_detected.map(r => r.description),
            passport_id,
            summary: `Executive summary for version ${profile.version}: CII Score ${profile.continuous_intelligence_index}. Detected ${regressionAnalysis.improvements_detected.length} improvements and ${regressionAnalysis.regressions_detected.length} regressions.`
        };

        this.eventBus.publish(BenchmarkEvents.EXECUTIVE_REPORT_GENERATED, report);
        return report;
    }
}
