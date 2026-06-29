import { DiagnosticKnowledgeBase } from "./diagnosticKnowledgeBase.js";
import { FailureGenomeRepository } from "./failureGenome.js";
import { SuccessGenomeRepository } from "./successGenome.js";

export class DiagnosticMetricsCollector {
    public static collectMetrics(
        kb: DiagnosticKnowledgeBase,
        failures: FailureGenomeRepository,
        successes: SuccessGenomeRepository
    ) {
        return {
            total_reports: kb.getAllReports().length,
            total_failures_analyzed: failures.getAll().length,
            total_successes_analyzed: successes.getAll().length,
            causal_graphs_generated: kb.getCausalGraphs().length
        };
    }
}
