import React from "react";
import { Users, HeartHandshake, Swords, BrainCircuit, Activity, ShieldAlert, Zap } from "lucide-react";

export function TheoryOfMindDashboard({ mission }: any) {
  const tom = mission?.theory_of_mind;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-[#111] border border-slate-800 p-6 rounded-2xl">
        <div className="space-y-1">
          <h2 className="text-xl font-medium text-white flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-fuchsia-500" />
            Theory of Mind Engine
          </h2>
          <p className="text-sm text-slate-400">
            Model stakeholder beliefs, incentives, and social dynamics.
          </p>
        </div>
        <div className="text-right">
            <div className="text-sm text-slate-500 uppercase tracking-widest font-bold mb-1">Trust Score</div>
            <div className={`text-3xl font-mono ${tom?.trust_score >= 70 ? 'text-emerald-400' : tom?.trust_score >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                {tom?.trust_score || 0}/100
            </div>
        </div>
      </div>

      {!tom ? (
        <div className="text-slate-500 py-12 text-center">Run a mission to initialize Theory of Mind models.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Stakeholders & Mental Models */}
          <div className="space-y-6">
            <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-purple-400" /> Stakeholder Mental Models
              </h3>
              
              <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                 {tom.stakeholders?.map((sh: string, i: number) => {
                    const beliefs = tom.inferred_beliefs?.filter((b:any) => b.stakeholder === sh) || [];
                    const goFears = tom.goals_and_fears?.filter((g:any) => g.stakeholder === sh) || [];
                    const incs = tom.incentives?.filter((inc:any) => inc.stakeholder === sh) || [];
                    const reactions = tom.likely_reactions?.filter((r:any) => r.stakeholder === sh) || [];

                    return (
                        <div key={i} className="bg-black/30 border border-slate-800 p-4 rounded-xl space-y-3">
                            <h4 className="font-bold text-purple-300 border-b border-slate-800 pb-2 mb-2">{sh}</h4>
                            
                            {beliefs.length > 0 && (
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-500">Inferred Beliefs</span>
                                    <ul className="list-disc pl-4 text-xs text-slate-300">
                                        {beliefs.map((b:any, idx:number) => <li key={idx}>{b.belief}</li>)}
                                    </ul>
                                </div>
                            )}

                            {goFears.length > 0 && (
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {goFears.map((g:any, idx:number) => (
                                        <React.Fragment key={idx}>
                                            <div className="bg-emerald-900/10 p-2 rounded border border-emerald-900/30">
                                                <span className="text-[10px] uppercase font-bold text-emerald-500 block mb-1">Goals</span>
                                                <span className="text-xs text-emerald-200">{g.goal}</span>
                                            </div>
                                            <div className="bg-red-900/10 p-2 rounded border border-red-900/30">
                                                <span className="text-[10px] uppercase font-bold text-red-500 block mb-1">Fears</span>
                                                <span className="text-xs text-red-200">{g.fear}</span>
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </div>
                            )}

                            {(incs.length > 0 || reactions.length > 0) && (
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {incs.length > 0 && (
                                        <div className="bg-amber-900/10 p-2 rounded border border-amber-900/30">
                                            <span className="text-[10px] uppercase font-bold text-amber-500 block mb-1">Incentives</span>
                                            <span className="text-xs text-amber-200">{incs[0]?.incentive}</span>
                                        </div>
                                    )}
                                    {reactions.length > 0 && (
                                        <div className="bg-blue-900/10 p-2 rounded border border-blue-900/30">
                                            <span className="text-[10px] uppercase font-bold text-blue-500 block mb-1">Likely Reaction</span>
                                            <span className="text-xs text-blue-200">{reactions[0]?.reaction}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                 })}
              </div>
            </div>
          </div>

          {/* Social Dynamics */}
          <div className="space-y-6">
            <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-emerald-400" /> Social Dynamics
              </h3>

              <div className="space-y-4">
                {/* Cooperation */}
                <div className="bg-emerald-900/10 border border-emerald-900/30 p-4 rounded-xl">
                    <div className="text-xs text-emerald-500 uppercase font-bold mb-3 flex items-center gap-1">
                      <HeartHandshake className="w-3 h-3" /> Cooperation Opportunities
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-sm text-emerald-200">
                        {tom.cooperation_opportunities?.map((opp: string, i: number) => (
                            <li key={i}>{opp}</li>
                        ))}
                    </ul>
                </div>

                {/* Conflict Risks */}
                <div className="bg-red-900/10 border border-red-900/30 p-4 rounded-xl">
                    <div className="text-xs text-red-500 uppercase font-bold mb-3 flex items-center gap-1">
                      <Swords className="w-3 h-3" /> Conflict Risks
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-sm text-red-200">
                        {tom.conflict_risks?.map((risk: string, i: number) => (
                            <li key={i}>{risk}</li>
                        ))}
                    </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
