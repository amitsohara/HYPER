import { create } from 'zustand';

export interface ReasoningPremise {
    id: string;
    content: string;
}

export interface ReasoningRule {
    id: string;
    content: string;
}

export interface ReasoningConclusion {
    id: string;
    confidence: number;
    content: string;
    isMain: boolean;
    explanation?: string;
    strategy?: string;
    executionTimeMs?: number;
    alternativeHypotheses?: string[];
}

interface ReasoningStore {
    premises: ReasoningPremise[];
    rules: ReasoningRule[];
    conclusions: ReasoningConclusion[];
    strategy: string;
    executionTimeMs: number;
    addPremise: (premise: ReasoningPremise) => void;
    addRule: (rule: ReasoningRule) => void;
    addConclusion: (conclusion: ReasoningConclusion) => void;
    setReasoningData: (data: { premises?: ReasoningPremise[], rules?: ReasoningRule[], conclusions?: ReasoningConclusion[], strategy?: string, executionTimeMs?: number }) => void;
}

export const useReasoningStore = create<ReasoningStore>((set) => ({
    premises: [],
    rules: [],
    conclusions: [],
    strategy: "DEDUCTIVE",
    executionTimeMs: 0,
    addPremise: (premise) => set((state) => {
        if (state.premises.find(p => p.content === premise.content)) return state;
        return { premises: [premise, ...state.premises].slice(0, 20) };
    }),
    addRule: (rule) => set((state) => {
        if (state.rules.find(r => r.content === rule.content)) return state;
        return { rules: [rule, ...state.rules].slice(0, 20) };
    }),
    addConclusion: (conclusion) => set((state) => {
        if (state.conclusions.find(c => c.content === conclusion.content)) return state;
        return { 
            conclusions: [conclusion, ...state.conclusions].slice(0, 20),
            strategy: conclusion.strategy || state.strategy,
            executionTimeMs: conclusion.executionTimeMs || state.executionTimeMs
        };
    }),
    setReasoningData: (data) => set((state) => ({ ...state, ...data }))
}));
