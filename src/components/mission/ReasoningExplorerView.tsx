import React from "react";
import { Network, FileSearch, HelpCircle, FastForward } from "lucide-react";

export function ReasoningExplorerView() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl h-full flex flex-col">
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg text-slate-200">Reasoning Inference Graph</h3>
          <p className="text-sm text-slate-400">Execution Time: 45ms | Strategy: Forward Chaining</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-indigo-900/30 text-indigo-400 border border-indigo-500/30 rounded-full text-sm font-medium">
           <FastForward size={14} /> Active Inference
        </div>
      </div>
      
      <div className="flex-1 p-6 flex flex-col lg:flex-row gap-8 overflow-auto bg-slate-950">
         {/* Premises */}
         <div className="flex-1 space-y-4">
            <h4 className="text-slate-500 text-sm font-medium mb-4 flex items-center gap-2"><FileSearch size={16}/> Premises & Evidence</h4>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg shadow">
               <div className="text-xs text-slate-500 mb-1">P1</div>
               <div className="text-sm text-slate-300">Stalled vehicle detected in Lane 2.</div>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg shadow">
               <div className="text-xs text-slate-500 mb-1">P2</div>
               <div className="text-sm text-slate-300">Traffic volume is exceeding 40 cars/min.</div>
            </div>
         </div>
         
         {/* Rules */}
         <div className="flex-1 space-y-4 relative">
            <h4 className="text-slate-500 text-sm font-medium mb-4 flex items-center gap-2"><Network size={16}/> Applied Rules</h4>
            <div className="p-4 bg-indigo-900/20 border border-indigo-500/30 rounded-lg shadow relative z-10">
               <div className="text-xs text-indigo-400 mb-1">Rule: R-Traffic-04</div>
               <div className="text-sm text-indigo-200">IF (Stalled_Vehicle AND High_Volume) THEN (Congestion_Probability &gt; 90%)</div>
            </div>
         </div>
         
         {/* Conclusions */}
         <div className="flex-1 space-y-4">
            <h4 className="text-slate-500 text-sm font-medium mb-4 flex items-center gap-2"><HelpCircle size={16}/> Conclusions</h4>
            <div className="p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg shadow shadow-emerald-900/20">
               <div className="text-xs text-emerald-500 mb-1">C1 (Confidence: 0.94)</div>
               <div className="text-sm text-emerald-300 font-medium">Critical congestion is forming. Immediate mitigation required.</div>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg shadow opacity-60">
               <div className="text-xs text-slate-500 mb-1">Alt H1 (Confidence: 0.12)</div>
               <div className="text-sm text-slate-400">Sensor anomaly. No action required.</div>
            </div>
         </div>
      </div>
    </div>
  );
}
