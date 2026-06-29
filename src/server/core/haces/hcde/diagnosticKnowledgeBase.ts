import { DiagnosisReport, CausalGraph } from "./diagnosticTypes.js";
import { DiagnosticEventBus, DiagnosticEvents } from "./diagnosticEvents.js";

export class DiagnosticKnowledgeBase {
    private reports: Map<string, DiagnosisReport> = new Map();
    private eventBus = DiagnosticEventBus.getInstance();

    public storeReport(report: DiagnosisReport) {
        this.reports.set(report.report_id, report);
        this.eventBus.publish(DiagnosticEvents.DIAGNOSTIC_ARCHIVED, { report });
    }

    public getReport(id: string): DiagnosisReport | undefined {
        return this.reports.get(id);
    }

    public getAllReports(): DiagnosisReport[] {
        return Array.from(this.reports.values());
    }
    
    public getCausalGraphs(): CausalGraph[] {
        return this.getAllReports()
            .map(r => r.causal_graph)
            .filter(g => g !== undefined) as CausalGraph[];
    }
}
