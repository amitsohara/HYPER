import { SystemicPattern, DiagnosticLayer } from "./diagnosticTypes.js";
import { DiagnosticEventBus, DiagnosticEvents } from "./diagnosticEvents.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class SystemicPatternAnalyzer {
    private patterns: SystemicPattern[] = [];
    private eventBus = DiagnosticEventBus.getInstance();

    public detectPatterns(history: any[]): SystemicPattern[] {
        // Mock detection
        const detected: SystemicPattern = {
            pattern_id: uuidv4(),
            description: "Repeated planning timeouts when simulation depth exceeds 5.",
            occurrences: 12,
            affected_layers: [DiagnosticLayer.PLANNING, DiagnosticLayer.SIMULATION],
            severity: 85,
            detected_at: Date.now()
        };

        this.patterns.push(detected);
        this.eventBus.publish(DiagnosticEvents.SYSTEMIC_ISSUE_DETECTED, { pattern: detected });

        return [detected];
    }
    
    public getPatterns(): SystemicPattern[] {
        return this.patterns;
    }
}
