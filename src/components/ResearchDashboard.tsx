import React from "react";
import { FlaskConical, Database, Sparkles, BrainCircuit, ShieldAlert, CheckCircle, Flame } from "lucide-react";

export function ResearchDashboard({ mission }: any) {
  const displayReports = mission ? [mission] : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       <div className="flex justify-between items-center bg-[#111] border border-slate-800 p-6 rounded-2xl">
        <div className="space-y-1">
          <h2 className="text-xl font-medium text-white flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-indigo-500" />
            Research Scientist Mode
          </h2>
          <p className="text-sm text-slate-400">
            Formulate hypotheses, design experiments, and generate scientific reports.
          </p>
        </div>
      </div>

      <div className="space-y-8">
         {displayReports.length === 0 && <div className="text-slate-500 py-12 text-center">No research reports available.</div>}
         {displayReports.map((report, idx) => (
            <div key={idx} className="bg-[#111] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-8">
               <div className="border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3 mb-2">
                     <span className="bg-indigo-900/40 text-indigo-400 text-xs font-bold px-2 py-0.5 rounded border border-indigo-500/30 uppercase tracking-widest flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        Mission
                     </span>
                     <span className="text-slate-500 text-sm">{new Date(report.timestamp).toLocaleString()}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">{report.mission}</h3>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column: Context & Plan */}
                  <div className="space-y-6">
                     <div>
                        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-3">
                           <Database className="w-4 h-4 text-emerald-400" /> Retrieved Context
                        </h4>
                        <div className="bg-black/30 border border-slate-800 p-4 rounded-xl space-y-3">
                           {report.reused_memories?.length > 0 ? (
                              <div className="space-y-2">
                                 <div className="text-xs text-slate-500 uppercase font-bold">Episodic Memories</div>
                                 <ul className="list-disc pl-4 space-y-1 text-sm text-slate-300">
                                    {report.reused_memories.map((m: string, i: number) => <li key={i}>{m}</li>)}
                                 </ul>
                              </div>
                           ) : <div className="text-sm text-slate-500">No episodic memories.</div>}
                        </div>
                     </div>

                     <div>
                        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-3">
                           <Sparkles className="w-4 h-4 text-purple-400" /> Research Plan
                        </h4>
                        <div className="bg-black/30 border border-slate-800 p-4 rounded-xl space-y-4">
                           <div>
                              <div className="text-xs text-slate-500 uppercase font-bold mb-2">Research Questions</div>
                              <ul className="list-disc pl-4 space-y-1 text-sm text-slate-300">
                                 {report.scientific_discovery?.hypotheses?.map((q: any, i: number) => <li key={i}>{q.statement}</li>) || <li className="text-slate-500">None</li>}
                              </ul>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Right Column: Debates & Report */}
                  <div className="space-y-6">
                     <div>
                        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-3">
                           <BrainCircuit className="w-4 h-4 text-amber-400" /> Final Report
                        </h4>
                        <div className="bg-black/30 border border-slate-800 p-6 rounded-xl">
                           <div className="prose prose-invert prose-sm max-w-none text-slate-300">
                              <p className="whitespace-pre-wrap">{report.final_report || "No final report."}</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}
