import React from "react";
import { Network, FileSearch, HelpCircle, FastForward } from "lucide-react";

export function ReasoningExplorerView({ diagnostics }: any) {
  let premises = [
    { id: "P1", content: "Stalled vehicle detected in Lane 2." },
    { id: "P2", content: "Traffic volume is exceeding 40 cars/min." }
  ];
  let rules = [
    { id: "R-Traffic-04", content: "IF (Stalled_Vehicle AND High_Volume) THEN (Congestion_Probability > 90%)" }
  ];
  let conclusions = [
    { id: "C1", confidence: 0.94, content: "Critical congestion is forming. Immediate mitigation required.", isMain: true },
    { id: "Alt H1", confidence: 0.12, content: "Sensor anomaly. No action required.", isMain: false }
  ];

  if (diagnostics?.workingMemory?.length > 0) {
      premises = diagnostics.workingMemory.slice(0, 2).map((m: any, i: number) => ({
          id: `P${i+1}`,
          content: typeof m === 'string' ? m : (m.content || JSON.stringify(m))
      }));
  }
  
  if (diagnostics?.beliefs?.length > 0) {
      conclusions = diagnostics.beliefs.slice(0, 3).map((b: any, i: number) => ({
          id: `C${i+1}`,
          confidence: b.confidence || 0.9,
          content: b.statement || JSON.stringify(b),
          isMain: i === 0
      }));
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl h-full flex flex-col">
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg text-slate-200">Reasoning Inference Graph</h3>
          <p className="text-sm text-slate-400">Execution Time: {diagnostics?.trace?.latency || 45}ms | Strategy: Forward Chaining</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-indigo-900/30 text-indigo-400 border border-indigo-500/30 rounded-full text-sm font-medium">
           <FastForward size={14} /> Active Inference
        </div>
      </div>
      
      <div className="flex-1 p-6 flex flex-col lg:flex-row gap-8 overflow-auto bg-slate-950">
         {/* Premises */}
         <div className="flex-1 space-y-4">
            <h4 className="text-slate-500 text-sm font-medium mb-4 flex items-center gap-2"><FileSearch size={16}/> Premises & Evidence</h4>
            {premises.map(p => (
              <div key={p.id} className="p-4 bg-slate-900 border border-slate-800 rounded-lg shadow">
                 <div className="text-xs text-slate-500 mb-1">{p.id}</div>
                 <div className="text-sm text-slate-300">{p.content}</div>
              </div>
            ))}
         </div>
         
         {/* Rules */}
         <div className="flex-1 space-y-4 relative">
            <h4 className="text-slate-500 text-sm font-medium mb-4 flex items-center gap-2"><Network size={16}/> Applied Rules</h4>
            {rules.map(r => (
              <div key={r.id} className="p-4 bg-indigo-900/20 border border-indigo-500/30 rounded-lg shadow relative z-10">
                 <div className="text-xs text-indigo-400 mb-1">Rule: {r.id}</div>
                 <div className="text-sm text-indigo-200">{r.content}</div>
              </div>
            ))}
         </div>
         
         {/* Conclusions */}
         <div className="flex-1 space-y-4">
            <h4 className="text-slate-500 text-sm font-medium mb-4 flex items-center gap-2"><HelpCircle size={16}/> Conclusions</h4>
            {conclusions.map(c => (
                <div key={c.id} className={`p-4 rounded-lg shadow ${c.isMain ? 'bg-emerald-900/20 border border-emerald-500/30 shadow-emerald-900/20' : 'bg-slate-900 border border-slate-800 opacity-60'}`}>
                   <div className={`text-xs mb-1 ${c.isMain ? 'text-emerald-500' : 'text-slate-500'}`}>{c.id} (Confidence: {c.confidence})</div>
                   <div className={`text-sm ${c.isMain ? 'text-emerald-300 font-medium' : 'text-slate-400'}`}>{c.content}</div>
                </div>
            ))}
         </div>
      </div>
    </div>
  );
}
