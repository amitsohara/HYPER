import React from "react";
import { GitBranch, ShieldAlert, CheckCircle2, XCircle } from "lucide-react";

export function DecisionCenterView() {
  const decisions = [
    {
      id: "opt-A",
      action: "Reroute Traffic via Signal Override",
      utility: 85,
      risk: 15,
      status: "CHOSEN",
      reason: "Maximal throughput preservation with lowest collision risk."
    },
    {
      id: "opt-B",
      action: "Dispatch Tow Truck immediately",
      utility: 60,
      risk: 40,
      status: "REJECTED",
      reason: "High risk of secondary collision during dispatch."
    },
    {
      id: "opt-C",
      action: "Do Nothing",
      utility: -20,
      risk: 95,
      status: "REJECTED",
      reason: "Violates executive safety policy."
    }
  ];

  return (
    <div className="h-full flex flex-col space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-200">Decision Center</h2>
        <p className="text-sm text-slate-400">Action selection matrix and executive policies</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
         <div className="lg:col-span-2 space-y-4">
            <h3 className="font-medium text-slate-300 flex items-center gap-2"><GitBranch size={18}/> Decision Matrix</h3>
            <div className="space-y-4">
               {decisions.map(d => (
                 <div key={d.id} className={`bg-slate-900 border ${d.status === 'CHOSEN' ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-slate-800'} rounded-xl p-5`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className={`font-semibold text-lg ${d.status === 'CHOSEN' ? 'text-emerald-400' : 'text-slate-300'}`}>{d.action}</h4>
                        <div className="text-sm text-slate-500 mt-1">ID: {d.id}</div>
                      </div>
                      {d.status === 'CHOSEN' ? <CheckCircle2 className="text-emerald-500" size={24}/> : <XCircle className="text-slate-600" size={24}/>}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                       <div className="bg-slate-950 p-3 rounded border border-slate-800">
                          <div className="text-xs text-slate-500 mb-1">Expected Utility</div>
                          <div className="text-lg font-mono text-slate-200">{d.utility}</div>
                       </div>
                       <div className="bg-slate-950 p-3 rounded border border-slate-800">
                          <div className="text-xs text-slate-500 mb-1">Risk Factor</div>
                          <div className="text-lg font-mono text-slate-200">{d.risk}</div>
                       </div>
                    </div>
                    
                    <div className="bg-slate-950/50 p-3 rounded text-sm text-slate-400 border border-slate-800/50">
                       <span className="font-medium text-slate-300">Explanation:</span> {d.reason}
                    </div>
                 </div>
               ))}
            </div>
         </div>
         
         <div className="space-y-4">
            <h3 className="font-medium text-slate-300 flex items-center gap-2"><ShieldAlert size={18}/> Executive Policies</h3>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
               <div className="p-3 bg-slate-950 border-l-2 border-rose-500 rounded text-sm">
                  <div className="font-medium text-slate-200 mb-1">Policy: MIN_COLLISION_RISK</div>
                  <div className="text-slate-400 text-xs">Reject any option with collision risk &gt; 25%.</div>
               </div>
               <div className="p-3 bg-slate-950 border-l-2 border-amber-500 rounded text-sm">
                  <div className="font-medium text-slate-200 mb-1">Policy: MAX_THROUGHPUT</div>
                  <div className="text-slate-400 text-xs">Optimize for highest volume of safe passage.</div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
