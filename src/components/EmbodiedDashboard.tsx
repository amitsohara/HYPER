import React from "react";
import { Eye, Activity, ShieldCheck, Map, Cpu, CheckCircle, XCircle } from "lucide-react";

export function EmbodiedDashboard({ mission }: any) {
  const embodied = mission?.embodied_intelligence;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-[#111] border border-slate-800 p-6 rounded-2xl">
        <div className="space-y-1">
          <h2 className="text-xl font-medium text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-emerald-500" />
            Embodied Intelligence
          </h2>
          <p className="text-sm text-slate-400">
            Perception, environment tracking, safety evaluation, and physical action execution.
          </p>
        </div>
      </div>

      {!embodied ? (
        <div className="text-slate-500 py-12 text-center">Run a mission to activate embodied sensors.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Perception & State */}
          <div className="space-y-6">
            <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
                <Map className="w-4 h-4 text-blue-400" /> Environmental Perception
              </h3>
              
              <div className="space-y-4">
                <div className="bg-black/30 border border-slate-800 p-4 rounded-xl">
                    <div className="text-xs text-slate-500 uppercase font-bold mb-2">Observations</div>
                    <ul className="list-disc pl-4 space-y-1 text-sm text-slate-300">
                      {embodied.observations?.map((obs: string, i: number) => <li key={i}>{obs}</li>)}
                    </ul>
                </div>
                
                <div className="bg-black/30 border border-slate-800 p-4 rounded-xl">
                    <div className="text-xs text-slate-500 uppercase font-bold mb-2">Environmental State</div>
                    <div className="text-sm text-slate-300">{embodied.environmental_state}</div>
                </div>

                <div className="bg-black/30 border border-slate-800 p-4 rounded-xl">
                    <div className="text-xs text-slate-500 uppercase font-bold mb-2">Perceived Entities</div>
                    <div className="flex flex-wrap gap-2">
                      {embodied.perceived_entities?.map((ent: any, i: number) => (
                        <div key={i} className="bg-slate-800/50 border border-slate-700 px-3 py-1.5 rounded-lg text-xs">
                          <div className="font-bold text-blue-300">{ent.name}</div>
                          <div className="text-slate-400">{ent.type} &bull; {ent.state}</div>
                        </div>
                      ))}
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions & Safety */}
          <div className="space-y-6">
            <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Safety Gate & Actuators
              </h3>

              <div className="space-y-4">
                {/* Safety Risks */}
                {embodied.safety_risks?.length > 0 && (
                  <div className="bg-red-900/10 border border-red-900/50 p-4 rounded-xl">
                    <div className="text-xs text-red-500 uppercase font-bold mb-2 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Identified Risks
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-sm text-red-200">
                      {embodied.safety_risks.map((r: string, i: number) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                )}

                {/* Approved Actions */}
                <div className="bg-black/30 border border-slate-800 p-4 rounded-xl">
                    <div className="text-xs text-emerald-500 uppercase font-bold mb-3 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Executed Actions
                    </div>
                    <div className="space-y-2">
                      {embodied.approved_actions?.map((act: any, i: number) => (
                        <div key={i} className="bg-slate-900/50 border border-slate-800 p-3 rounded-lg flex justify-between items-center">
                          <div>
                            <div className="font-medium text-emerald-200 text-sm">{act.action}</div>
                            <div className="text-xs text-slate-500">{act.intent}</div>
                          </div>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded border bg-emerald-900/30 text-emerald-400 border-emerald-800">
                            {act.status || "Executed"}
                          </span>
                        </div>
                      ))}
                      {(!embodied.approved_actions || embodied.approved_actions.length === 0) && (
                        <div className="text-sm text-slate-500">No actions executed.</div>
                      )}
                    </div>
                </div>

                {/* Rejected Actions */}
                {embodied.rejected_actions?.length > 0 && (
                  <div className="bg-black/30 border border-slate-800 p-4 rounded-xl">
                      <div className="text-xs text-red-500 uppercase font-bold mb-3 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Rejected Actions
                      </div>
                      <div className="space-y-2">
                        {embodied.rejected_actions.map((act: any, i: number) => (
                          <div key={i} className="bg-red-900/20 border border-red-900/50 p-3 rounded-lg">
                            <div className="font-medium text-red-300 text-sm">{act.action}</div>
                            <div className="text-xs text-red-400/70">{act.intent}</div>
                          </div>
                        ))}
                      </div>
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
