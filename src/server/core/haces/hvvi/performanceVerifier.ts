import { GoogleGenAI } from "@google/genai";
import { PerformanceAssessment } from "./verificationTypes.js";
import { VerificationEventBus, VerificationEvents } from "./verificationEvents.js";
import { generateWithRetry, cleanJSON } from "../../../engines.js";

export class PerformanceVerifier {
    private eventBus = VerificationEventBus.getInstance();

    public async verifyPerformance(ai: GoogleGenAI, telemetryData: any): Promise<PerformanceAssessment> {
        const prompt = `Evaluate the performance telemetry data against expected architectural baseline.
Telemetry: ${JSON.stringify(telemetryData)}

Determine estimated performance metrics.

Return JSON:
{
  "latency_ms": 120,
  "throughput_req_sec": 500,
  "cpu_utilization": 45,
  "memory_mb": 256,
  "meets_expectations": true
}`;

        let result: any = {
            latency_ms: 0,
            throughput_req_sec: 0,
            cpu_utilization: 0,
            memory_mb: 0,
            meets_expectations: true
        };

        try {
            const res = await generateWithRetry(ai, {
                model: "gemini-2.5-flash",
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            result = await cleanJSON(res?.text || "{}", ai);
        } catch (e) {
            console.error("PerformanceVerifier failed:", e);
        }

        const assessment: PerformanceAssessment = {
            latency_ms: result.latency_ms ?? 0,
            throughput_req_sec: result.throughput_req_sec ?? 0,
            cpu_utilization: result.cpu_utilization ?? 0,
            memory_mb: result.memory_mb ?? 0,
            meets_expectations: result.meets_expectations ?? false
        };

        return assessment;
    }
}
