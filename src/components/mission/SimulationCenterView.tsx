import React from "react";
import { Layers, Activity, Server, AlertTriangle, ArrowDown } from "lucide-react";
import { useSimulationStore } from "../../store/useSimulationStore";

export function SimulationCenterView() {
  const { twinId, scenarios } = useSimulationStore();

  return (
    <div className="space-y-6 h-full flex flex-col items-center overflow-y-auto pb-10">
      <div className="w-full max-w-4xl flex items-center justify-between">
         <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
            <Layers className="text-indigo-500" />
            Simulation Center
         </h2>
      </div>

      <div className="w-full max-w-4xl flex flex-col items-center">
         {/* Digital Twin */}
         <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 flex flex-col items-center w-64 shadow-lg">
             <Server size={32} className="text-indigo-400 mb-2" />
             <h3 className="font-bold text-slate-200">Digital Twin</h3>
             <span className="text-xs text-slate-500 font-mono mt-1">{twinId}</span>
         </div>
         
         {scenarios.length === 0 ? (
             <div className="mt-8 text-slate-500 italic flex items-center gap-2">
                <Activity size={16} className="animate-pulse" />
                Awaiting scenario generation...
             </div>
         ) : (
             <>
                 <div className="h-8 border-l-2 border-dashed border-slate-700 my-2"></div>
                 
                 {/* Scenarios Branching */}
                 <div className="flex gap-6 flex-wrap justify-center w-full">
                     {scenarios.map((s, idx) => (
                         <div key={s.scenarioId} className="flex flex-col items-center w-64">
                             <div className={`w-full bg-slate-900 border ${s.status === 'RUNNING' ? 'border-amber-500/50' : 'border-slate-800'} rounded-xl p-5 flex flex-col shadow-lg`}>
                                 <h4 className="text-slate-200 font-medium text-center mb-2">{s.scenarioName}</h4>
                                 <div className="text-xs text-slate-400 text-center mb-4">{s.narrative}</div>
                                 <div className="flex justify-center mb-2">
                                     <span className={`text-xs px-2 py-1 rounded-full font-medium ${s.status === 'RUNNING' ? 'bg-amber-500/10 text-amber-400' : s.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                                         {s.status}
                                     </span>
                                 </div>
                             </div>
                             
                             {s.status === 'COMPLETED' && s.metrics && (
                                 <>
                                     <div className="h-6 border-l-2 border-dashed border-slate-700 my-1"></div>
                                     <div className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-center shadow">
                                         <div className="text-xs text-slate-500 mb-1">Probability</div>
                                         <div className="text-lg text-emerald-400 font-mono">{(s.metrics.successProbability * 100).toFixed(1)}%</div>
                                     </div>
                                     <div className="h-6 border-l-2 border-dashed border-slate-700 my-1"></div>
                                     <div className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-center shadow">
                                         <div className="text-xs text-slate-500 mb-1 flex items-center justify-center gap-1">
                                            <AlertTriangle size={12} className="text-amber-500" /> Risk
                                         </div>
                                         <div className="text-lg text-amber-400 font-mono">{(s.metrics.risk * 100).toFixed(1)}%</div>
                                     </div>
                                 </>
                             )}
                         </div>
                     ))}
                 </div>
             </>
         )}
      </div>
    </div>
  );
}
