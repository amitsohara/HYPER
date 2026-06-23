import React from "react";
import { BrainCircuit, Activity, RefreshCw, AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";

export function EvolutionDashboard({ agentVersions, agentPerformances, evolving, handleEvolve }: any) {
  
  // Group performances by agent
  const agentStats: Record<string, any[]> = {};
  Object.keys(agentVersions).forEach(agent => {
    agentStats[agent] = agentPerformances.filter((p: any) => p.agent_name === agent);
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-[#111] border border-slate-800 p-6 rounded-2xl">
        <div className="space-y-1">
          <h2 className="text-xl font-medium text-white flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-purple-500" />
            Agent Evolution Engine
          </h2>
          <p className="text-sm text-slate-400">
            Automatically analyze performance and upgrade system instructions to cure weak agents.
          </p>
        </div>
        <button
          onClick={handleEvolve}
          disabled={evolving}
          className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-medium flex items-center space-x-2 transition-colors shrink-0"
        >
          {evolving ? <Activity className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
          <span>{evolving ? "Evolving Agents..." : "Trigger Evolution"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.keys(agentStats).map((agentName) => {
          const perfs = agentStats[agentName];
          const latestPerf = perfs[0] || null;
          const versionData = agentVersions[agentName];
          
          let avgOverall = 0;
          if (perfs.length > 0) {
            const sumP = perfs.reduce((acc: number, p: any) => {
                return acc + ((p.output_quality_score || 0) + (p.reasoning_score || 0) + (p.usefulness_score || 0)) / 3;
            }, 0);
            avgOverall = sumP / perfs.length;
          }

          const isWeak = perfs.length > 0 && avgOverall < 85;

          return (
            <div key={agentName} className="bg-[#111] border border-slate-800 rounded-2xl p-6 space-y-4 relative overflow-hidden">
              {isWeak && (
                <div className="absolute top-0 right-0 bg-red-900/50 text-red-200 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-bl-lg border-b border-l border-red-900/50 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  Weak Agent
                </div>
              )}
              
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    {agentName}
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                      v{versionData?.version || 1}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Average Performance: {avgOverall > 0 ? avgOverall.toFixed(1) + '%' : 'N/A'}</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <h4 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Current System Prompt</h4>
                  <p className="text-xs text-blue-200 bg-blue-950/30 p-2.5 rounded-lg border border-blue-900/30 font-mono">
                    {versionData?.prompt || "No prompt available"}
                  </p>
                </div>

                {latestPerf && (
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/50">
                    <div>
                      <h4 className="text-[10px] text-red-500 uppercase tracking-widest font-bold mb-1">Latest Weakness</h4>
                      <p className="text-xs text-slate-300 bg-black/40 p-2 rounded">
                        {latestPerf.weakness_detected || "None detected"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold mb-1">Improvement Suggestion</h4>
                      <p className="text-xs text-slate-300 bg-black/40 p-2 rounded">
                        {latestPerf.improvement_suggestion || "None"}
                      </p>
                    </div>
                  </div>
                )}
                
                {versionData?.history && versionData.history.length > 0 && (
                  <div className="pt-2">
                     <h4 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Version History</h4>
                     <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar pr-2">
                        {[...versionData.history].reverse().map((hist: any, i: number) => (
                           <div key={i} className="text-xs border-l-2 border-slate-700 pl-2 ml-1">
                              <span className="text-slate-400 font-mono">v{hist.version} updated to v{hist.version + 1}</span>
                              <p className="text-slate-500 italic mt-0.5">{hist.reason_for_change}</p>
                           </div>
                        ))}
                     </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
