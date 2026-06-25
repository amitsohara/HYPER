import React from "react";
import { BrainCircuit, Activity, RefreshCw, AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";

export function EvolutionDashboard({ mission }: any) {
  const evaluations = mission?.recursive_improvement || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-[#111] border border-slate-800 p-6 rounded-2xl">
        <div className="space-y-1">
          <h2 className="text-xl font-medium text-white flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-purple-500" />
            Supervised Recursive Improvement
          </h2>
          <p className="text-sm text-slate-400">
            Automatically analyze agent performance and suggest prompt upgrades.
          </p>
        </div>
      </div>

      {!mission ? (
         <div className="text-slate-500 py-12 text-center">Run a mission to evaluate agent performance.</div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {evaluations.length === 0 && <div className="text-slate-500 py-12 text-center col-span-full">No evaluations found.</div>}
        {evaluations.map((evalData: any, idx: number) => {
          
          const avgOverall = ((evalData.output_quality_score || 0) + (evalData.reasoning_score || 0) + (evalData.usefulness_score || 0)) / 3;
          const isWeak = avgOverall < 85;

          return (
            <div key={idx} className="bg-[#111] border border-slate-800 rounded-2xl p-6 space-y-4 relative overflow-hidden">
              {isWeak && (
                <div className="absolute top-0 right-0 bg-red-900/50 text-red-200 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-bl-lg border-b border-l border-red-900/50 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  Weak Agent
                </div>
              )}
              
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    {evalData.agent_name || "Unknown Agent"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Average Score: {avgOverall > 0 ? avgOverall.toFixed(1) + '%' : 'N/A'}</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                 <div className="grid grid-cols-3 gap-2">
                    <div className="bg-black/30 p-2 rounded-lg border border-slate-800 flex flex-col items-center justify-center">
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Quality</div>
                        <div className="text-sm font-mono text-blue-400">{evalData.output_quality_score || 0}%</div>
                    </div>
                    <div className="bg-black/30 p-2 rounded-lg border border-slate-800 flex flex-col items-center justify-center">
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Reasoning</div>
                        <div className="text-sm font-mono text-purple-400">{evalData.reasoning_score || 0}%</div>
                    </div>
                    <div className="bg-black/30 p-2 rounded-lg border border-slate-800 flex flex-col items-center justify-center">
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Usefulness</div>
                        <div className="text-sm font-mono text-emerald-400">{evalData.usefulness_score || 0}%</div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-800/50">
                   <div>
                     <h4 className="text-[10px] text-red-500 uppercase tracking-widest font-bold mb-1">Weakness Detected</h4>
                     <p className="text-xs text-slate-300 bg-black/40 p-2 rounded">
                       {evalData.weakness_detected || "None detected"}
                     </p>
                   </div>
                   <div>
                     <h4 className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold mb-1">Improvement Suggestion</h4>
                     <p className="text-xs text-slate-300 bg-black/40 p-2 rounded">
                       {evalData.improvement_suggestion || "None"}
                     </p>
                   </div>
                 </div>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
