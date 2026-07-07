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
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 h-fit">
           <h3 className="font-medium text-slate-200 mb-4 border-b border-slate-800 pb-2">Cognitive Summary</h3>
           <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Total Thoughts</span>
                  <span className="text-slate-200 font-medium">{thoughts.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">High Priority</span>
                  <span className="text-rose-400 font-medium">{thoughts.filter(t => t.priority === 'HIGH').length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Active</span>
                  <span className="text-indigo-400 font-medium">{thoughts.filter(t => t.state === 'ACTIVE').length}</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
