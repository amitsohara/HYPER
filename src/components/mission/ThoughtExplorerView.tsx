import React from "react";
import { FileText, AlertCircle, ArrowRight, BrainCircuit } from "lucide-react";
import { useThoughtStore } from "../../store/useThoughtStore";

export function ThoughtExplorerView({ diagnostics }: any) {
  const thoughts = useThoughtStore((state) => state.thoughts);

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-200">Thought Explorer</h2>
          <p className="text-sm text-slate-400">Real-time working memory and active cognition</p>
        </div>
      </div>
      
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto">
        <div className="lg:col-span-2 space-y-4">
           {thoughts.map(t => (
             <div key={t.id} className={`bg-slate-900 border ${t.state === 'REJECTED' ? 'border-slate-800 opacity-60' : 'border-indigo-500/30'} rounded-xl p-5 shadow-sm`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <BrainCircuit size={18} className={t.state === 'REJECTED' ? 'text-slate-600' : 'text-indigo-400'} />
                    <span className="font-mono text-xs text-slate-500">{t.id}</span>
                  </div>
                  <div className="flex gap-2">
                     <span className={`text-xs px-2 py-1 rounded font-medium ${t.priority === 'HIGH' ? 'bg-rose-500/10 text-rose-400' : t.priority === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>{t.priority} PRIORITY</span>
                     <span className="text-xs px-2 py-1 bg-slate-800 text-slate-300 rounded font-medium">CONF: {(t.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
                
                <p className="text-slate-200 text-lg font-medium mb-4">{t.content}</p>
                
                <div className="bg-slate-950 rounded p-3 text-sm">
                  <div className="text-slate-500 mb-2 font-medium flex items-center gap-2"><AlertCircle size={14}/> Evidence</div>
                  <ul className="list-disc list-inside text-slate-400 space-y-1">
                    {t.evidence.map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                </div>
             </div>
           ))}
           {thoughts.length === 0 && (
               <div className="text-slate-500 italic p-4">Awaiting cognitive events...</div>
           )}
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
           <h3 className="font-medium text-slate-200 mb-4 border-b border-slate-800 pb-2">Cognitive Lifecycle</h3>
           <div className="relative pl-4 space-y-6">
              <div className="absolute left-1.5 top-2 bottom-2 w-px bg-slate-800"></div>
              
              <div className="relative">
                <div className="absolute -left-5 top-1 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <div className="text-sm font-medium text-emerald-400">Formation</div>
                <div className="text-xs text-slate-500 mt-1">12ms ago from Perception Stream</div>
              </div>
              
              <div className="relative">
                <div className="absolute -left-5 top-1 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                <div className="text-sm font-medium text-indigo-400">Validation</div>
                <div className="text-xs text-slate-500 mt-1">Cross-referenced World Model</div>
              </div>
              
              <div className="relative">
                <div className="absolute -left-5 top-1 w-2 h-2 rounded-full bg-slate-700"></div>
                <div className="text-sm font-medium text-slate-400">Action Binding</div>
                <div className="text-xs text-slate-600 mt-1">Awaiting decision matrix...</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
