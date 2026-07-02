import React from "react";
import { Network, FileSearch, HelpCircle, FastForward } from "lucide-react";
import { useReasoningStore } from "../../store/useReasoningStore";

export function ReasoningExplorerView({ diagnostics }: any) {
  const { premises, rules, conclusions, strategy, executionTimeMs } = useReasoningStore();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl h-full flex flex-col">
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg text-slate-200">Reasoning Inference Graph</h3>
          <p className="text-sm text-slate-400">Execution Time: {executionTimeMs || 45}ms | Strategy: {strategy || "Forward Chaining"}</p>
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
            {premises.length === 0 && <div className="text-slate-600 italic">No premises found.</div>}
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
            {rules.length === 0 && <div className="text-slate-600 italic">No rules applied.</div>}
         </div>
         
         {/* Conclusions */}
         <div className="flex-1 space-y-4">
            <h4 className="text-slate-500 text-sm font-medium mb-4 flex items-center gap-2"><HelpCircle size={16}/> Conclusions & Hypotheses</h4>
            {conclusions.map(c => (
                <div key={c.id} className={`p-4 rounded-lg shadow ${c.isMain ? 'bg-emerald-900/20 border border-emerald-500/30 shadow-emerald-900/20' : 'bg-slate-900 border border-slate-800 opacity-60'}`}>
                   <div className={`text-xs mb-1 ${c.isMain ? 'text-emerald-500' : 'text-slate-500'}`}>{c.id} (Confidence: {(c.confidence * 100).toFixed(0)}%)</div>
                   <div className={`text-sm mb-2 ${c.isMain ? 'text-emerald-300 font-medium' : 'text-slate-400'}`}>{c.content}</div>
                   {c.explanation && <div className="text-xs text-slate-500 mt-2 border-t border-slate-800 pt-2">Reasoning: {c.explanation}</div>}
                   {c.alternativeHypotheses && c.alternativeHypotheses.length > 0 && (
                       <div className="mt-2 text-xs text-slate-400">
                           <span className="font-semibold text-slate-500">Alternatives:</span>
                           <ul className="list-disc pl-4 mt-1">
                               {c.alternativeHypotheses.map((alt, idx) => <li key={idx}>{alt}</li>)}
                           </ul>
                       </div>
                   )}
                </div>
            ))}
            {conclusions.length === 0 && <div className="text-slate-600 italic">No conclusions reached.</div>}
         </div>
      </div>
    </div>
  );
}
