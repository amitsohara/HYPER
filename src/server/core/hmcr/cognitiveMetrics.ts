export const CognitiveMetrics = {
    total_thinking_sessions: 0,
    total_decisions_made: 0,
    total_tools_requested: 0,
    total_tools_rejected: 0,
    average_confidence: 0,
    specialist_activations: {} as Record<string, number>,

    recordSession() {
        this.total_thinking_sessions++;
    },
    recordDecision(confidence: number) {
        this.total_decisions_made++;
        this.average_confidence = ((this.average_confidence * (this.total_decisions_made - 1)) + confidence) / this.total_decisions_made;
    },
    recordSpecialist(type: string) {
        if (!this.specialist_activations[type]) {
            this.specialist_activations[type] = 0;
        }
        this.specialist_activations[type]++;
    },
    recordToolRequest(rejected: boolean) {
        this.total_tools_requested++;
        if (rejected) this.total_tools_rejected++;
    },
    getSummary() {
        return {
            total_thinking_sessions: this.total_thinking_sessions,
            total_decisions_made: this.total_decisions_made,
            average_confidence: this.average_confidence,
            total_tools_requested: this.total_tools_requested,
            total_tools_rejected: this.total_tools_rejected,
            specialist_activations: this.specialist_activations
        };
    }
};
