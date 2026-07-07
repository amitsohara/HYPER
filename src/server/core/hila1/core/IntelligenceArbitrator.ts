import { CognitiveDomain } from "../../hcns01/types.js";
import { IntelligenceRequest, ArbitrationDecision, IntelligenceResponse, ProviderType } from "../types/index.js";
import { KnowledgeGapAnalyzer, NoveltyDetector, ConfidenceEvaluator, MissionCriticalityEvaluator } from "../engines/ArbitrationEngines.js";
import { ModelRouter } from "../engines/ModelRouter.js";
import { ProviderManager } from "../providers/ProviderManager.js";
import { HyperMindEventMesh } from "../../hcns01/eventMesh.js";
import { ContextAssembler } from "../engines/ContextAssembler.js";
import { ResultCache } from "../engines/ResultCache.js";
import { ResponseValidator } from "../validators/ResponseValidator.js";
import { TelemetryCollector, AuditLogger } from "../telemetry/TelemetryCollector.js";

export class IntelligenceArbitrator {
    private knowledgeGapAnalyzer = new KnowledgeGapAnalyzer();
    private noveltyDetector = new NoveltyDetector();
    private confidenceEvaluator = new ConfidenceEvaluator();
    private criticalityEvaluator = new MissionCriticalityEvaluator();
    
    private contextAssembler = new ContextAssembler();
    private resultCache = new ResultCache();
    private responseValidator = new ResponseValidator();
    public telemetry = new TelemetryCollector();
    public auditLogger = new AuditLogger();

    constructor(
        private providerManager: ProviderManager,
        private modelRouter: ModelRouter,
        private eventMesh: HyperMindEventMesh
    ) {}

    async arbitrate(request: IntelligenceRequest, internalConfidence: number): Promise<ArbitrationDecision> {
        const gap = this.knowledgeGapAnalyzer.analyze(request);
        const novelty = this.noveltyDetector.detect(request.context);
        const criticality = this.criticalityEvaluator.evaluate(request);
        
        let useExternal = false;
        let reason = "Internal confidence is sufficient.";

        // Arbitration Logic (LDP-001)
        if (internalConfidence < request.requiredConfidence) {
            useExternal = true;
            reason = `Internal confidence (${internalConfidence}) below required (${request.requiredConfidence}).`;
        } else if (gap > 0.7) {
            useExternal = true;
            reason = `High knowledge gap detected (${gap}).`;
        } else if (novelty > 0.8 && criticality > 0.6) {
            useExternal = true;
            reason = "High novelty in critical mission requires external consultation.";
        }

        if (request.domain === "SENSORIMOTOR" && internalConfidence > 0.2) {
            // Strict override for sensorimotor
            useExternal = false;
            reason = "Sensorimotor tasks strongly prefer internal execution.";
        }

        const decision: ArbitrationDecision = {
            useExternal,
            reason,
            confidence: useExternal ? 0.9 : internalConfidence
        };

        this.telemetry.recordArbitration(useExternal, decision.confidence);

        if (useExternal) {
            decision.selectedProvider = await this.modelRouter.route(request);
            this.eventMesh.publish({
                type: "INTELLIGENCE_REQUESTED",
                source: "HILA",
                domain: CognitiveDomain.SYSTEM, priority: 1, payload: { request, decision }
            });
            this.auditLogger.log("EXTERNAL_ROUTING", { requestId: request.id, provider: decision.selectedProvider, reason });
        } else {
            this.eventMesh.publish({
                type: "INTERNAL_REASONING_SELECTED",
                source: "HILA",
                domain: CognitiveDomain.SYSTEM, priority: 1, payload: { request, decision }
            });
            this.auditLogger.log("INTERNAL_ROUTING", { requestId: request.id, reason });
        }

        return decision;
    }

    async executeExternal(request: IntelligenceRequest, decision: ArbitrationDecision): Promise<IntelligenceResponse | null> {
        if (!decision.useExternal || !decision.selectedProvider) return null;

        const provider = this.providerManager.getProvider(decision.selectedProvider);
        if (!provider) throw new Error(`Provider ${decision.selectedProvider} not available.`);

        const assembledContext = this.contextAssembler.assembleContext(request);
        const prompt = `Task: ${request.task}`;

        // Check Cache
        const cachedResponse = this.resultCache.get(prompt, assembledContext);
        if (cachedResponse) {
            this.auditLogger.log("CACHE_HIT", { requestId: request.id });
            return cachedResponse;
        }

        this.eventMesh.publish({
            type: "MODEL_SELECTED",
            source: "HILA",
            domain: CognitiveDomain.SYSTEM,
            priority: 1,
            payload: { provider: decision.selectedProvider }
        });

        const response = await provider.generate(prompt, assembledContext);

        this.eventMesh.publish({
            type: "MODEL_RESPONSE_RECEIVED",
            source: "HILA",
            domain: CognitiveDomain.SYSTEM, priority: 1, payload: { response }
        });

        this.telemetry.recordExternalExecution(response.costEstimate, response.latencyMs);

        // Validate
        const validation = this.responseValidator.validateAll(response);
        response.wasValidated = true;
        response.validationDetails = validation;

        if (validation.valid) {
            this.resultCache.set(prompt, assembledContext, response);
            this.eventMesh.publish({ type: "RESPONSE_VALIDATED", source: "HILA", domain: CognitiveDomain.SYSTEM, priority: 1, payload: { responseId: response.id } });
            this.auditLogger.log("RESPONSE_VALIDATED", { requestId: request.id });
        } else {
            this.telemetry.recordValidationFailure();
            this.eventMesh.publish({ type: "RESPONSE_REJECTED", source: "HILA", domain: CognitiveDomain.SYSTEM, priority: 1, payload: { responseId: response.id, errors: validation.errors } });
            this.auditLogger.log("RESPONSE_REJECTED", { requestId: request.id, errors: validation.errors });
        }

        return response;
    }
}
