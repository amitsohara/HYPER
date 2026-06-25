import React, { useState, useEffect } from "react";
import { Globe, GitMerge, Users, TrendingUp, Compass, Activity, Play, LineChart, Network, Plus } from "lucide-react";
import { safeFetchJSON } from "../fetchUtils";
import { FutureTrendsChart } from "./FutureTrendsChart";

export function WorldModelDashboard({ mission }: any) {
  const [causalGraph, setCausalGraph] = useState<any[]>([]);

  useEffect(() => {
    fetchCausalGraph();
    const interval = setInterval(fetchCausalGraph, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchCausalGraph = async () => {
    try {
      const data = await safeFetchJSON("/causal_model/graph", {}, { causal_graph: [] });
      setCausalGraph(data.causal_graph || []);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       <div className="flex justify-between items-center bg-[#111] border border-slate-800 p-6 rounded-2xl">
        <div className="space-y-1">
          <h2 className="text-xl font-medium text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" />
            Synthetic World Engine
          </h2>
          <p className="text-sm text-slate-400">
            Simulate scenarios and learn causal dynamics from missions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-blue-400" /> Synthetic Worlds
            </h3>
            {mission?.synthetic_worlds ? (
               <ul className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                  {mission.synthetic_worlds.map((w: string, i: number) => (
                     <li key={i} className="text-sm text-slate-300 bg-slate-900/30 p-3 rounded-lg border border-slate-800">{w}</li>
                  ))}
               </ul>
            ) : (
               <div className="text-sm text-slate-500">Run a mission to generate synthetic worlds.</div>
            )}
        </div>

        <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Play className="w-4 h-4 text-emerald-400" /> Scenario Results
            </h3>
            {mission?.scenario_results ? (
               <ul className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                  {mission.scenario_results.map((s: any, i: number) => (
                     <li key={i} className="text-sm text-slate-300 bg-slate-900/30 p-3 rounded-lg border border-slate-800">
                        {s.evolution_summary || s.scenario || String(s)}
                     </li>
                  ))}
               </ul>
            ) : (
               <div className="text-sm text-slate-500">Run a mission to simulate scenarios.</div>
            )}
        </div>
      </div>

      {causalGraph.length > 0 && (
         <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Network className="w-4 h-4 text-purple-400" /> Global Learned Causal Graph ({causalGraph.length} Rules)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
               {causalGraph.map((rule, idx) => (
                  <div key={idx} className="bg-black/40 border border-slate-800/80 p-4 rounded-xl space-y-2 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-2 bg-black/50 rounded-bl-lg border-b border-l border-slate-800/50 backdrop-blur-sm z-10 flex flex-col items-center">
                        <span className="text-xs text-emerald-400 font-mono font-bold">{(rule.confidence * 100).toFixed(0)}%</span>
                     </div>
                     <div className="flex flex-col gap-2 relative z-0">
                        <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Cause</div>
                        <div className="text-sm text-slate-200">{rule.cause}</div>
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-1 relative">
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-2">
                              <GitMerge className="w-3 h-3 text-purple-500" />
                           </div>
                        </div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Effect</div>
                        <div className="text-sm text-purple-300">{rule.effect}</div>
                     </div>
                     {rule.context_dependencies?.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-800/50">
                           <div className="flex flex-wrap gap-1">
                              {rule.context_dependencies.map((dep: string, d: number) => (
                                 <span key={d} className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                                    {dep}
                                 </span>
                              ))}
                           </div>
                        </div>
                     )}
                  </div>
               ))}
            </div>
         </div>
      )}
    </div>
  );
}
