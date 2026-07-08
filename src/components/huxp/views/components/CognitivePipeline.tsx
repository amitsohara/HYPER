import React from "react";
import { Check, Loader2 } from "lucide-react";

export function CognitivePipeline() {
  const pipeline = [
    { id: "obs", label: "Observation", status: "complete", latency: "12ms" },
    { id: "wm", label: "World Model", status: "complete", latency: "45ms" },
    { id: "concept", label: "Concept Formation", status: "active", latency: "running" },
    { id: "attention", label: "Attention", status: "pending", latency: "-" },
    { id: "thought", label: "Thought Gen", status: "pending", latency: "-" },
    { id: "reason", label: "Reasoning", status: "pending", latency: "-" },
    { id: "plan", label: "Planning", status: "pending", latency: "-" },
    { id: "sim", label: "Simulation", status: "pending", latency: "-" },
    { id: "decide", label: "Decision", status: "pending", latency: "-" },
    { id: "exec", label: "Execution", status: "pending", latency: "-" },
    { id: "learn", label: "Learning", status: "pending", latency: "-" },
  ];

  return (
    <div className="space-y-4">
      {pipeline.map((step, idx) => (
        <div key={step.id} className="relative flex items-start space-x-3 group">
          {/* Connector Line */}
          {idx < pipeline.length - 1 && (
            <div className={`absolute top-6 left-3 w-0.5 h-full -ml-px ${
              step.status === 'complete' ? 'bg-emerald-500/50' : 'bg-zinc-800'
            }`} />
          )}
          
          {/* Icon */}
          <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2
            ${step.status === 'complete' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 
              step.status === 'active' ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' :
              'bg-zinc-900 border-zinc-700 text-zinc-600'}`}
          >
            {step.status === 'complete' && <Check className="w-3 h-3" />}
            {step.status === 'active' && <Loader2 className="w-3 h-3 animate-spin" />}
            {step.status === 'pending' && <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />}
          </div>
          
          {/* Content */}
          <div className="flex-1 pb-4">
            <div className={`text-sm font-medium ${
              step.status === 'complete' ? 'text-zinc-200' : 
              step.status === 'active' ? 'text-indigo-400' : 
              'text-zinc-500'
            }`}>
              {step.label}
            </div>
            {step.status !== 'pending' && (
              <div className="text-xs text-zinc-500 font-mono mt-0.5">
                {step.latency}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
