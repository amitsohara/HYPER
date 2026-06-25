import React from "react";
import { Microscope, FlaskConical, Split, Map, FileText } from "lucide-react";

export function DiscoveryDashboard({ mission }: any) {
  const disc = mission?.scientific_discovery;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       <div className="flex justify-between items-center bg-[#111] border border-slate-800 p-6 rounded-2xl">
        <div className="space-y-1">
          <h2 className="text-xl font-medium text-white flex items-center gap-2">
            <Microscope className="w-5 h-5 text-indigo-500" />
            Scientific Discovery Platform
          </h2>
          <p className="text-sm text-slate-400">
            Generate hypotheses, competing explanations, and evidence confidence across multiple disciplines.
          </p>
        </div>
      </div>

      <div className="space-y-8">
         {!disc ? (
            <div className="text-slate-500 py-12 text-center">No discoveries yet. Run a mission to synthesize discoveries.</div>
         ) : (
            <div className="bg-[#111] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-8">
               <div className="border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3 mb-2">
                     <span className="bg-indigo-900/40 text-indigo-400 text-xs font-bold px-2 py-0.5 rounded border border-indigo-500/30 uppercase tracking-widest flex items-center gap-1">
                        <Microscope className="w-3 h-3" />
                        {disc.discipline || "Multidisciplinary"}
                     </span>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column: Hypotheses & Explanations */}
                  <div className="space-y-6">
                     <div>
                        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-3">
                           <FlaskConical className="w-4 h-4 text-amber-400" /> Research Hypotheses
                        </h4>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                           {disc.hypotheses?.map((h: any, i: number) => (
                              <div key={i} className="bg-black/30 border border-slate-800 p-4 rounded-xl space-y-3">
                                 <h5 className="font-medium text-amber-200 text-sm flex items-start gap-2">
                                     <span className="text-amber-500/50 mt-0.5">H{i+1}:</span> 
                                     {h.statement}
                                 </h5>
                                 
                                 <div className="text-xs text-slate-400 border-l-2 border-purple-700/50 pl-3">
                                    <span className="font-bold text-purple-400/80 uppercase tracking-widest flex items-center gap-1 mb-1">
                                        <Split className="w-3 h-3" /> Competing Explanations
                                    </span>
                                    <ul className="list-disc pl-4 space-y-1">
                                        {h.competing_explanations?.map((ce: string, ceIdx: number) => (
                                            <li key={ceIdx}>{ce}</li>
                                        ))}
                                    </ul>
                                 </div>

                                 <div className="text-xs text-slate-400 border-l-2 border-emerald-700/50 pl-3">
                                    <span className="font-bold text-emerald-400/80 uppercase tracking-widest flex items-center gap-1 mb-1">
                                        <Map className="w-3 h-3" /> Experiment Roadmap
                                    </span>
                                    <ul className="list-disc pl-4 space-y-1">
                                        {h.experiment_roadmap?.map((er: string, erIdx: number) => (
                                            <li key={erIdx}>{er}</li>
                                        ))}
                                    </ul>
                                 </div>

                                 <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Confidence:</span>
                                    <div className="flex-1 bg-slate-900 rounded-full h-1.5 overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full" 
                                            style={{ width: `${h.evidence_confidence || 0}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-mono text-emerald-400">{h.evidence_confidence}%</span>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Right Column: Discovery Report */}
                  <div className="space-y-6">
                     <div>
                        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-3">
                           <FileText className="w-4 h-4 text-cyan-400" /> Synthesis Report
                        </h4>
                        <div className="bg-black/30 border border-slate-800 p-6 rounded-xl max-h-[500px] overflow-y-auto custom-scrollbar">
                           <div className="prose prose-invert prose-sm max-w-none text-slate-300">
                              {disc.discovery_report?.split('\n').map((para: string, pIdx: number) => (
                                 <p key={pIdx} className="mb-4 leading-relaxed">{para}</p>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
    </div>
  );
}
