import { v4 as uuidv4 } from "uuid";
import { GoogleGenAI } from "@google/genai";
import { VerificationReport, ApprovalDecision } from "./verificationTypes.js";
import { VerificationEventBus, VerificationEvents } from "./verificationEvents.js";
import { TraceabilityVerifier } from "./traceabilityVerifier.js";
import { FunctionalVerifier } from "./functionalVerifier.js";
import { ArchitectureCompliance } from "./architectureCompliance.js";
import { ScientificValidator } from "./scientificValidator.js";
import { SecurityVerifier } from "./securityVerifier.js";
import { PerformanceVerifier } from "./performanceVerifier.js";
import { RegressionVerifier } from "./regressionVerifier.js";
import { ReliabilityVerifier } from "./reliabilityVerifier.js";
import { DocumentationValidator } from "./documentationValidator.js";
import { ConfidenceCertificationEngine } from "./confidenceCertification.js";
import { ReleaseApprovalBoard } from "./releaseApprovalBoard.js";
import { VerificationMetrics } from "./verificationMetrics.js";

export class HyperMindVerificationValidationInstitute {
    private eventBus = VerificationEventBus.getInstance();
    
    private traceability = new TraceabilityVerifier();
    private functional = new FunctionalVerifier();
    private architecture = new ArchitectureCompliance();
    private scientific = new ScientificValidator();
    private security = new SecurityVerifier();
    private performance = new PerformanceVerifier();
    private regression = new RegressionVerifier();
    private reliability = new ReliabilityVerifier();
    private documentation = new DocumentationValidator();
    private certEngine = new ConfidenceCertificationEngine();
    private approvalBoard = new ReleaseApprovalBoard();

    public async verifyAndValidate(ai: GoogleGenAI, payload: any): Promise<{ report: VerificationReport, decision: ApprovalDecision }> {
        this.eventBus.publish(VerificationEvents.VERIFICATION_STARTED, { payload_id: payload.id });

        const [
            traceResult,
            funcResult,
            archResult,
            sciResult,
            secResult,
            perfResult,
            regResult,
            relResult,
            docResult
        ] = await Promise.all([
            this.traceability.verifyTraceability(ai, payload),
            this.functional.verifyFunctionality(ai, payload),
            this.architecture.checkCompliance(ai, payload.implementation, payload.blueprint),
            this.scientific.validateScience(ai, payload.implementation, payload.research),
            this.security.verifySecurity(ai, payload.sourceCode || ""),
            this.performance.verifyPerformance(ai, payload.telemetry),
            this.regression.verifyRegression(ai, payload.currentVersion, payload.previousVersion),
            this.reliability.verifyReliability(ai, payload.systemBehavior),
            this.documentation.validateDocs(ai, payload.sourceCode || "", payload.docs || "")
        ]);

        const report: VerificationReport = {
            report_id: uuidv4(),
            engineering_id: payload.id || "unknown",
            timestamp: Date.now(),
            traceability: traceResult,
            functional: funcResult,
            architecture: archResult,
            scientific: sciResult,
            security: secResult,
            performance: perfResult,
            regression: regResult,
            reliability: relResult,
            documentation: docResult
        };

        this.eventBus.publish(VerificationEvents.VERIFICATION_COMPLETED, report);

        const certification = this.certEngine.generateCertification(report);
        const decision = await this.approvalBoard.reviewRelease(ai, certification, report);

        VerificationMetrics.update(report, decision);

        return { report, decision };
    }
}
