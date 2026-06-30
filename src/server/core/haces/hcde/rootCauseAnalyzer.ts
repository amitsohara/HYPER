import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../../../engines.js";
import { RootCause, DiagnosticLayer, DiagnosticEvidence } from "./diagnosticTypes.js";
import { DiagnosticEventBus, DiagnosticEvents } from "./diagnosticEvents.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function parseLayer(layerString: string): DiagnosticLayer {
    const l = layerString?.toUpperCase();
    if (Object.values(DiagnosticLayer).includes(l as DiagnosticLayer)) {
        return l as DiagnosticLayer;
    }
    return DiagnosticLayer.ARCHITECTURE;
}

export class RootCauseAnalyzer {
    private eventBus = DiagnosticEventBus.getInstance();

    public async analyze(ai: GoogleGenAI, evidence: DiagnosticEvidence[]): Promise<RootCause> {
        const prompt = `Perform a Root Cause Analysis (RCA) on the following diagnostic evidence.
Evidence: ${JSON.stringify(evidence)}

Determine the PRIMARY root cause of any failures or anomalies.
Return a JSON object:
{
  "layer": "REASONING | PLANNING | MEMORY | LEARNING | WORLD_MODEL | SIMULATION | SCIENTIFIC_DISCOVERY | HYPOTHESIS_GENERATION | ENGINEERING | ARCHITECTURE | COORDINATION | COMMUNICATION | KNOWLEDGE | TOOL_USAGE | RESOURCE_MANAGEMENT",
  "description": "The main underlying cause",
  "confidence": 85
}`;
        let causeData: any = {};
        try {
            const res = await generateWithRetry(ai, {
                model: "gemini-2.5-flash",
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            causeData = await cleanJSON(res?.text || "{}", ai);
        } catch (e) {
            console.error("RootCauseAnalyzer failed:", e);
        }

        const rootCause: RootCause = {
            cause_id: uuidv4(),
            layer: parseLayer(causeData.layer),
            description: causeData.description || "Unknown root cause",
            is_root: true,
            confidence: causeData.confidence || 50,
            evidence_ids: evidence.map(e => e.evidence_id)
        };

        this.eventBus.publish(DiagnosticEvents.ROOT_CAUSE_DISCOVERED, { rootCause });
        return rootCause;
    }
    
    public async findContributingFactors(ai: GoogleGenAI, evidence: DiagnosticEvidence[]): Promise<RootCause[]> {
        const prompt = `Perform a Root Cause Analysis (RCA) on the following diagnostic evidence.
Evidence: ${JSON.stringify(evidence)}

Identify CONTRIBUTING factors (secondary issues).
Return a JSON array of objects:
[
  {
    "layer": "REASONING | PLANNING | MEMORY | LEARNING | WORLD_MODEL | SIMULATION | SCIENTIFIC_DISCOVERY | HYPOTHESIS_GENERATION | ENGINEERING | ARCHITECTURE | COORDINATION | COMMUNICATION | KNOWLEDGE | TOOL_USAGE | RESOURCE_MANAGEMENT",
    "description": "Contributing factor description",
    "confidence": 75
  }
]`;
        let factors: any[] = [];
        try {
            const res = await generateWithRetry(ai, {
                model: "gemini-2.5-flash",
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            factors = await cleanJSON(res?.text || "[]", ai);
            if (!Array.isArray(factors)) factors = [];
        } catch (e) {
            console.error("RootCauseAnalyzer (factors) failed:", e);
        }

        return factors.map(f => ({
            cause_id: uuidv4(),
            layer: parseLayer(f.layer),
            description: f.description || "Unknown contributing factor",
            is_root: false,
            confidence: f.confidence || 50,
            evidence_ids: evidence.map(e => e.evidence_id)
        }));
    }
}
