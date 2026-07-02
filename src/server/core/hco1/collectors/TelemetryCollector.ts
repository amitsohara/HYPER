export class TelemetryCollector {
    private events: any[] = [];
    private state: any = {
        worldModel: { entities: [], relationships: [] },
        workingMemory: [],
        beliefs: [],
        decisionCandidates: [],
        missionStage: "IDLE",
        activeModules: []
    };

    public recordEvent(event: any) {
        this.events.push(event);
        this.updateState(event);
    }

    private updateState(event: any) {
        const type = event?.type || event?.data?.type;
        const data = event.data;

        if (type === 'WORLD_MODEL_UPDATED') {
            this.state.worldModel = data;
        } else if (type === 'WORKING_MEMORY_UPDATED') {
            this.state.workingMemory = data;
        } else if (type === 'BELIEFS_UPDATED') {
            this.state.beliefs = data;
        } else if (type === 'DECISION_CANDIDATES_GENERATED') {
            this.state.decisionCandidates = data;
        } else if (type === 'MISSION_STAGE_CHANGED') {
            this.state.missionStage = data;
        } else if (type === 'MODULE_ACTIVATED') {
            if (!this.state.activeModules.includes(data)) {
                this.state.activeModules.push(data);
            }
        }
    }

    public getState() {
        return this.state;
    }

    public getEvents() {
        return this.events;
    }
}
