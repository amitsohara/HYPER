import React from "react";
import { Globe, Layers, TrendingUp, ShieldAlert, Cpu, AlertCircle, BarChart2 } from "lucide-react";

export function DigitalTwinDashboard({ mission }: any) {
  const twin = mission?.digital_twin;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-[#111] border border-slate-800 p-6 rounded-2xl">
        <div className="space-y-1">
          <h2 className="text-xl font-medium text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-500" />
            Digital Twin Earth
          </h2>
          <p className="text-sm text-slate-400">
            Simulate policy, economic, and climate changes across massive virtual systems.
          </p>
        </div>
      </div>

      {!twin ? (
        <div className="text-slate-500 py-12 text-center">Run a mission to initialize a Digital Twin simulation.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Configuration & Scope */}
          <div className="space-y-6">
            <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
                <Layers className="w-4 h-4 text-blue-400" /> Simulation Config
              </h3>
              
              <div className="space-y-4">
                <div className="bg-black/30 border border-slate-800 p-4 rounded-xl">
                    <div className="text-xs text-slate-500 uppercase font-bold mb-2">Scope</div>
                    <div className="text-sm font-medium text-blue-200">{twin.twin_scope || "Global"}</div>
                </div>

                <div className="bg-black/30 border border-slate-800 p-4 rounded-xl">
                    <div className="text-xs text-slate-500 uppercase font-bold mb-2">Simulated Systems</div>
                    <div className="flex flex-wrap gap-2">
                      {twin.simulated_systems?.map((sys: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-blue-900/20 text-blue-300 border border-blue-900/50 rounded text-xs">
                            {sys}
                        </span>
                      ))}
                    </div>
                </div>
                
                <div className="bg-black/30 border border-slate-800 p-4 rounded-xl">
                    <div className="text-xs text-slate-500 uppercase font-bold mb-2">Core Assumptions</div>
                    <ul className="list-disc pl-4 space-y-1 text-sm text-slate-300">
                      {twin.assumptions?.map((assm: string, i: number) => <li key={i}>{assm}</li>)}
                    </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Outcomes & Analysis */}
          <div className="space-y-6">
            <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Scenario Analysis
              </h3>

              <div className="space-y-4">
                {/* Predicted Outcomes */}
                <div className="bg-black/30 border border-slate-800 p-4 rounded-xl">
                    <div className="text-xs text-emerald-500 uppercase font-bold mb-3 flex items-center gap-1">
                      <BarChart2 className="w-3 h-3" /> Predicted Outcomes
                    </div>
                    <div className="space-y-3">
                      {twin.predicted_outcomes?.map((out: any, i: number) => (
                        <div key={i} className="bg-slate-900/50 border border-slate-800 p-3 rounded-lg flex justify-between items-center gap-4">
                          <div className="flex-1">
                            <div className="font-medium text-emerald-200 text-sm">{out.scenario}</div>
                            <div className="text-xs text-slate-400">{out.outcome}</div>
                          </div>
                          <span className="text-xs font-mono text-emerald-400 font-bold">
                            {out.probability}
                          </span>
                        </div>
                      ))}
                    </div>
                </div>

                {/* Uncertainty Ranges */}
                <div className="bg-black/30 border border-slate-800 p-4 rounded-xl">
                    <div className="text-xs text-amber-500 uppercase font-bold mb-3 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Uncertainty Ranges
                    </div>
                    <div className="space-y-2">
                        {twin.uncertainty_ranges?.map((ur: any, i: number) => (
                          <div key={i} className="flex justify-between items-center bg-amber-900/10 border border-amber-900/30 p-2 rounded text-sm text-amber-200">
                             <span>{ur.metric}</span>
                             <span className="font-mono text-xs">{ur.range}</span>
                          </div>
                        ))}
                    </div>
                </div>

                {/* Recommended Interventions */}
                {twin.recommended_interventions?.length > 0 && (
                  <div className="bg-indigo-900/10 border border-indigo-900/30 p-4 rounded-xl">
                      <div className="text-xs text-indigo-400 uppercase font-bold mb-3 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" /> Recommended Interventions
                      </div>
                      <ul className="list-disc pl-4 space-y-1 text-sm text-indigo-200">
                        {twin.recommended_interventions.map((intv: string, i: number) => (
                          <li key={i}>{intv}</li>
                        ))}
                      </ul>
                  </div>
                )}

              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
