import { create } from 'zustand';
import { useThoughtStore } from './useThoughtStore';
import { useReasoningStore } from './useReasoningStore';
import { useSimulationStore } from './useSimulationStore';

interface HyperMindState {
  metrics: any;
  hii: any;
  missions: any[];
  missionResults: any[];
  diagnostics: any;
  worldState: any;
  events: any[];
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  fetchMissionResults: () => Promise<void>;
}

export const useHyperMindStore = create<HyperMindState>((set, get) => ({
  metrics: null,
  hii: null,
  missions: [],
  missionResults: [],
  diagnostics: null,
  worldState: null,
  events: [],
  isConnected: false,
  fetchMissionResults: async () => {
    try {
      const res = await fetch("/api/hmrc/results");
      const data = await res.json();
      if (Array.isArray(data)) {
        set({ missionResults: data });
      }
    } catch (e) {
      console.error(e);
    }
  },
  connect: () => {
    if (get().isConnected) return;
    
    // Fetch initial state while WS connects
    fetch("/api/hml/dashboard").then(r => r.text().then(t => { try { return JSON.parse(t); } catch(e) { return {}; } })).then(data => set({ metrics: data })).catch(() => {});
    fetch("/api/hml/hii").then(r => r.text().then(t => { try { return JSON.parse(t); } catch(e) { return {}; } })).then(data => set({ hii: data })).catch(() => {});
    fetch("/api/hml/missions").then(r => r.text().then(t => { try { return JSON.parse(t); } catch(e) { return {}; } })).then(data => set({ missions: data })).catch(() => {});
    fetch("/api/hml/diagnostics").then(r => r.text().then(t => { try { return JSON.parse(t); } catch(e) { return {}; } })).then(data => {
        set({ diagnostics: data });
        if (data?.workingMemory) {
            const thoughts = data.workingMemory.map((mem: any, i: number) => {
                let contentStr = typeof mem === 'string' ? mem : JSON.stringify(mem);
                let confidence = 0.9;
                if (typeof mem === 'object' && mem.content) {
                    contentStr = mem.content;
                    confidence = mem.confidence || confidence;
                }
                return {
                    id: `th-${i}`,
                    priority: confidence > 0.8 ? "HIGH" : "MEDIUM",
                    confidence: confidence,
                    content: contentStr,
                    evidence: ["Extracted from active cognitive cycle"],
                    state: "ACTIVE"
                };
            });
            useThoughtStore.getState().setThoughts(thoughts);
        }
    }).catch(() => {});

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/hml/stream`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      set({ isConnected: true });
    };

    ws.onmessage = (event) => {
      try {
        let msg;
        try {
            msg = JSON.parse(event.data);
        } catch(e) {
            console.error("Invalid WS message:", event.data);
            return;
        }
        
        if (msg.type === "GLOBAL_STATE_SYNC") {
           set({
             metrics: msg.data.metrics,
             hii: msg.data.hii,
             missions: msg.data.missions,
             diagnostics: msg.data.diagnostics
           });
           
           if (msg.data.diagnostics?.workingMemory) {
               // Optional: sync workingMemory to thoughts, but since we append, maybe we don't want to override unless empty
               if (useThoughtStore.getState().thoughts.length === 0) {
                   const thoughts = msg.data.diagnostics.workingMemory.map((mem: any, i: number) => {
                        let contentStr = typeof mem === 'string' ? mem : JSON.stringify(mem);
                        let confidence = 0.9;
                        if (typeof mem === 'object' && mem.content) {
                            contentStr = mem.content;
                            confidence = mem.confidence || confidence;
                        }
                        return {
                            id: `th-${i}`,
                            priority: confidence > 0.8 ? "HIGH" : "MEDIUM",
                            confidence: confidence,
                            content: contentStr,
                            evidence: ["Extracted from active cognitive cycle"],
                            state: "ACTIVE"
                        };
                   });
                   useThoughtStore.getState().setThoughts(thoughts);
               }
           }
        } else if (msg.type === "THOUGHT_GENERATED") {
           useThoughtStore.getState().addThought({
               id: msg.payload?.thoughtId || `th-${Date.now()}`,
               priority: msg.priority === 1 ? "HIGH" : "MEDIUM",
               confidence: 0.9,
               content: msg.payload?.summary || "New thought generated",
               evidence: ["Extracted from HTGE via HCNS"],
               state: "ACTIVE"
           });
           useReasoningStore.getState().addPremise({
               id: `P-${msg.payload?.thoughtId || Date.now()}`,
               content: msg.payload?.summary || "New thought generated"
           });
           set((state) => ({
               events: [...state.events, msg].slice(-1000)
           }));
        } else if (msg.type === "CONCLUSION_GENERATED") {
           useReasoningStore.getState().addConclusion({
               id: msg.payload?.conclusionId || `C-${Date.now()}`,
               confidence: msg.payload?.confidence || 0.9,
               content: msg.payload?.content || "Conclusion generated",
               isMain: true,
               explanation: msg.payload?.explanation?.humanReadable || JSON.stringify(msg.payload?.explanation),
               strategy: msg.payload?.strategy || "DEDUCTIVE",
               executionTimeMs: msg.payload?.executionTimeMs || 45,
               alternativeHypotheses: msg.payload?.alternativeHypotheses || []
           });
           
           if (msg.payload?.explanation?.reasoningTrace) {
               msg.payload.explanation.reasoningTrace.forEach((trace: string, idx: number) => {
                   if (trace.startsWith("Applied rule:") || trace.includes("Rule")) {
                       useReasoningStore.getState().addRule({
                           id: `R-${Date.now()}-${idx}`,
                           content: trace
                       });
                   }
               });
           }
           
           set((state) => ({
               events: [...state.events, msg].slice(-1000)
           }));
        } else if (msg.type === "SIMULATION_STARTED") { useSimulationStore.getState().addScenario({ scenarioId: msg.payload?.scenarioId || "sim-"+Date.now(), scenarioName: msg.payload?.scenarioName || "Simulated Scenario", metrics: { successProbability: 0, risk: 0, utility: 0, confidence: 0, cost: 0 }, narrative: "Initializing simulation...", status: 'RUNNING' }); set((state) => ({ events: [...state.events, msg].slice(-1000) })); } else if (msg.type === "SIMULATION_COMPLETED") { if (msg.payload?.run) { const run = msg.payload.run; useSimulationStore.getState().updateScenarioStatus(run.scenarioId, run.status, run.outcome); if (run.outcome) { useSimulationStore.getState().addScenario({ scenarioId: run.scenarioId, scenarioName: run.outcome.narrative || "Simulated Scenario", metrics: run.outcome.metrics || { successProbability: 0, risk: 0, utility: 0, confidence: 0, cost: 0 }, narrative: run.outcome.narrative || "Simulation completed.", status: run.status }); } } set((state) => ({ events: [...state.events, msg].slice(-1000) })); } else if (msg.type === "PLAN_EVALUATED") { if (msg.payload?.outcomes) { msg.payload.outcomes.forEach((outcome: any) => { useSimulationStore.getState().addScenario({ scenarioId: outcome.scenarioId || "sim-"+Date.now(), scenarioName: outcome.narrative || "Simulated Scenario", metrics: outcome.metrics || { successProbability: 0, risk: 0, utility: 0, confidence: 0, cost: 0 }, narrative: outcome.narrative || "Simulation completed.", status: 'COMPLETED' }); }); } set((state) => ({ events: [...state.events, msg].slice(-1000) })); } else if (msg.type === "MISSION_RESULT_READY") { set((state) => { const newResult = msg.payload?.result || msg.data?.result; if (!newResult) return state; const results = [...state.missionResults]; const idx = results.findIndex(r => r.missionId === newResult.missionId); if (idx >= 0) results[idx] = newResult; else results.unshift(newResult); return { missionResults: results, events: [...state.events, msg].slice(-1000) }; }); } else {
           // Push other events to historystory
           set((state) => ({
               events: [...state.events, msg].slice(-1000)
           }));
        }
      } catch (err) {
        console.error("WS Parse Error", err);
      }
    };

    ws.onclose = () => {
      set({ isConnected: false });
      // Reconnect logic
      setTimeout(() => {
        get().connect();
      }, 5000);
    };

    (window as any).hm_ws = ws;
  },

  disconnect: () => {
    if ((window as any).hm_ws) {
      (window as any).hm_ws.close();
      (window as any).hm_ws = null;
    }
    set({ isConnected: false });
  }
}));
