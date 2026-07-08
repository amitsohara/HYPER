import React, { useMemo } from "react";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { useHyperMindStore } from "../../../../store/useHyperMindStore";

const PIPELINE_STAGES = [
  { id: "obs", label: "Observation", triggers: ["WORLD_OBSERVATION"] },
  { id: "wm", label: "World Model", triggers: ["WORLD_MODEL_UPDATED", "SOCIETY_STATE_TRANSITION"] },
  { id: "concept", label: "Concept Formation", triggers: ["CONCEPT"] },
  { id: "attention", label: "Attention", triggers: ["ATTENTION_SHIFTED", "ATTENTION_INTERRUPTED"] },
  { id: "thought", label: "Thought Gen", triggers: ["THOUGHT_GENERATED"] },
  { id: "reason", label: "Reasoning", triggers: ["CONCLUSION_GENERATED", "PLAN_EVALUATED"] },
  { id: "plan", label: "Planning", triggers: ["PLAN_CREATED"] },
  { id: "sim", label: "Simulation", triggers: ["SIMULATION_STARTED", "SIMULATION_COMPLETED"] },
  { id: "decide", label: "Decision", triggers: ["ACTION_AUTHORIZED", "ACTION_REJECTED"] },
  { id: "exec", label: "Execution", triggers: ["PLAN_EXECUTE", "ACTION_COMPLETED", "ACTION_FAILED"] },
  { id: "learn", label: "Learning", triggers: ["PLUGIN_LOADED", "MEMORY_CONSOLIDATED"] },
];

export function CognitivePipeline() {
  const { events } = useHyperMindStore();

  const pipelineStatus = useMemo(() => {
    const statusMap: Record<string, any> = {};
    
    // Initialize default state
    PIPELINE_STAGES.forEach(stage => {
      statusMap[stage.id] = { ...stage, status: "pending", latency: "-", confidence: null, error: false };
    });

    if (!events || events.length === 0) return Object.values(statusMap);

    let highestActiveIndex = -1;

    for (let i = events.length - 1; i >= 0; i--) {
      const ev = events[i];
      const type = ev.type;
      
      for (let j = 0; j < PIPELINE_STAGES.length; j++) {
        const stage = PIPELINE_STAGES[j];
        if (stage.triggers.includes(type) && statusMap[stage.id].status === "pending") {
          statusMap[stage.id].status = "complete";
          
          if (j > highestActiveIndex) highestActiveIndex = j;

          let latency = ev.payload?.executionTimeMs || ev.payload?.latency || "-";
          if (latency !== "-" && typeof latency === "number") latency = `${latency}ms`;
          
          let confidence = ev.payload?.confidence || ev.confidence || null;
          
          let isError = ev.level === "ERROR" || type.includes("FAILED") || type.includes("REJECTED");

          statusMap[stage.id].latency = latency;
          statusMap[stage.id].confidence = confidence;
          statusMap[stage.id].error = isError;
        }
      }
    }

    const sorted = PIPELINE_STAGES.map(s => statusMap[s.id]);
    
    if (highestActiveIndex >= 0) {
       if (!sorted[highestActiveIndex].error) {
           sorted[highestActiveIndex].status = "active";
       }
    }

    return sorted;
  }, [events]);

  return (
    <div className="space-y-4">
      {pipelineStatus.map((step, idx) => (
        <div key={step.id} className="relative flex items-start space-x-3 group cursor-pointer hover:bg-zinc-800/30 p-1 rounded-lg transition-colors">
          {/* Connector Line */}
          {idx < pipelineStatus.length - 1 && (
            <div className={`absolute top-7 left-4 w-0.5 h-full -ml-px ${
              step.status === 'complete' ? 'bg-emerald-500/50' : 'bg-zinc-800'
            }`} />
          )}
          
          {/* Icon */}
          <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 mt-0.5
            ${step.error ? 'bg-red-500/20 border-red-500 text-red-400' : 
              step.status === 'complete' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 
              step.status === 'active' ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' :
              'bg-zinc-900 border-zinc-700 text-zinc-600'}`}
          >
            {step.error ? <AlertCircle className="w-3 h-3" /> :
             step.status === 'complete' ? <Check className="w-3 h-3" /> :
             step.status === 'active' ? <Loader2 className="w-3 h-3 animate-spin" /> :
             <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />}
          </div>
          
          {/* Content */}
          <div className="flex-1 pb-4">
            <div className="flex items-center justify-between">
                <div className={`text-sm font-medium ${
                step.error ? 'text-red-400' :
                step.status === 'complete' ? 'text-zinc-200' : 
                step.status === 'active' ? 'text-indigo-400' : 
                'text-zinc-500'
                }`}>
                {step.label}
                </div>
                {step.confidence !== null && step.status !== 'pending' && (
                    <div className="text-xs text-zinc-500 font-mono">
                        Conf: {(step.confidence * 100).toFixed(0)}%
                    </div>
                )}
            </div>
            {step.status !== 'pending' && (
              <div className="text-xs text-zinc-500 font-mono mt-0.5">
                {step.error ? 'Error' : step.status === 'active' ? 'Running...' : step.latency}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
