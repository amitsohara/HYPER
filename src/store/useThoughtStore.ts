import { create } from 'zustand';

export interface Thought {
    id: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
    confidence: number;
    content: string;
    evidence: string[];
    state: "ACTIVE" | "REJECTED";
}

interface ThoughtStore {
    thoughts: Thought[];
    addThought: (thought: Thought) => void;
    setThoughts: (thoughts: Thought[]) => void;
}

export const useThoughtStore = create<ThoughtStore>((set) => ({
    thoughts: [],
    addThought: (thought) => set((state) => ({ thoughts: [thought, ...state.thoughts].slice(0, 50) })),
    setThoughts: (thoughts) => set({ thoughts })
}));
