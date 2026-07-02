import { create } from 'zustand';

export interface SimulationOutcome {
    scenarioId: string;
    scenarioName: string;
    metrics: {
        successProbability: number;
        risk: number;
        utility: number;
        confidence: number;
        cost: number;
    };
    narrative: string;
    status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
}

interface SimulationStore {
    twinId: string;
    scenarios: SimulationOutcome[];
    addScenario: (scenario: SimulationOutcome) => void;
    updateScenarioStatus: (scenarioId: string, status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED', outcome?: any) => void;
    setScenarios: (scenarios: SimulationOutcome[]) => void;
    setTwinId: (id: string) => void;
}

export const useSimulationStore = create<SimulationStore>((set) => ({
    twinId: 'twin-canonical-001',
    scenarios: [],
    addScenario: (scenario) => set((state) => {
        if (state.scenarios.find(s => s.scenarioId === scenario.scenarioId)) return state;
        return { scenarios: [...state.scenarios, scenario] };
    }),
    updateScenarioStatus: (scenarioId, status, outcome) => set((state) => {
        return {
            scenarios: state.scenarios.map(s => {
                if (s.scenarioId === scenarioId) {
                    return {
                        ...s,
                        status,
                        metrics: outcome?.metrics || s.metrics,
                        narrative: outcome?.narrative || s.narrative
                    };
                }
                return s;
            })
        };
    }),
    setScenarios: (scenarios) => set({ scenarios }),
    setTwinId: (id) => set({ twinId: id })
}));
