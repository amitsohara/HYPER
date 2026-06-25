import React from "react";
import { Users, MessagesSquare, Lightbulb, Scale, AlertOctagon, CheckCircle2, Network, BrainCircuit, Flag, Gavel } from "lucide-react";

export function CollectiveIntelligenceDashboard({ mission }: any) {
  const collective = mission?.collective_intelligence;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-[#111] border border-slate-800 p-6 rounded-2xl">
        <div className="space-y-1">
          <h2 className="text-xl font-medium text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-indigo-500" />
            Collective Intelligence (1000 Specialists)
          </h2>
          <p className="text-sm text-slate-400">
            Massively parallel expert debate, knowledge merging, consensus, and minority reporting.
          </p>
        </div>
        <div className="text-right">
            <div className="text-sm text-slate-500 uppercase tracking-widest font-bold mb-1">Status</div>
            <div className="text-sm font-bold uppercase text-emerald-400 flex items-center gap-2 justify-end">
                <CheckCircle2 className="w-4 h-4" /> Consensus Reached
            </div>
        </div>
      </div>

      {!collective ? (
        <div className="text-slate-500 py-12 text-center">Run a mission to invoke the Society of Specialists.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Teams & Debate */}
          <div className="space-y-6">
            <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-blue-400" /> Specialist Teams
              </h3>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                 {collective.teams_created?.map((team: any, i: number) => (
                     <div key={i} className="bg-black/30 border border-slate-800 p-4 rounded-xl space-y-2">
                         <div className="flex justify-between items-center">
                             <h4 className="font-bold text-blue-300">{team.name}</h4>
                             <span className="text-xs font-mono text-blue-500 bg-blue-900/20 px-2 py-1 rounded">
                                 Confidence: {team.confidence}%
                             </span>
                         </div>
                         <div className="text-xs text-slate-400">{team.expertise}</div>
                         <div className="flex flex-wrap gap-1 mt-2">
                             {team.specialists?.map((spec: string, idx: number) => (
                                 <span key={idx} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                                     {spec}
                                 </span>
                             ))}
                         </div>
                     </div>
                 ))}
              </div>
            </div>

            <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
                <MessagesSquare className="w-4 h-4 text-amber-400" /> Debate Highlights
              </h3>
              <ul className="list-disc pl-4 space-y-2 text-sm text-amber-200">
                 {collective.debate_highlights?.map((point: string, i: number) => (
                     <li key={i}>{point}</li>
                 ))}
              </ul>
            </div>
          </div>

          {/* Knowledge, Consensus, Minority Report */}
          <div className="space-y-6">
            
            {/* Merged Knowledge */}
            <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
                <Lightbulb className="w-4 h-4 text-emerald-400" /> Merged Knowledge
              </h3>
              <ul className="list-disc pl-4 space-y-2 text-sm text-emerald-200">
                 {collective.merged_knowledge?.map((insight: string, i: number) => (
                     <li key={i}>{insight}</li>
                 ))}
              </ul>
            </div>

            {/* Decisions */}
            <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl space-y-6">
                
                <div>
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-2">
                        <Scale className="w-4 h-4 text-indigo-400" /> Consensus
                    </h3>
                    <div className="bg-indigo-900/10 border border-indigo-900/30 p-4 rounded-xl text-sm text-indigo-200 leading-relaxed">
                        {collective.consensus}
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-2">
                        <AlertOctagon className="w-4 h-4 text-red-400" /> Minority Report
                    </h3>
                    <div className="bg-red-900/10 border border-red-900/30 p-4 rounded-xl text-sm text-red-200 leading-relaxed">
                        {collective.minority_report}
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-2">
                        <Gavel className="w-4 h-4 text-fuchsia-400" /> Final Decision
                    </h3>
                    <div className="bg-fuchsia-900/10 border border-fuchsia-900/30 p-4 rounded-xl text-sm text-fuchsia-200 leading-relaxed font-medium">
                        {collective.final_decision}
                    </div>
                </div>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}
