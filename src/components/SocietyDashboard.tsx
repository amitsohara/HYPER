import React from "react";
import { Users, Gavel, Handshake, GitMerge, CheckCircle, XCircle } from "lucide-react";

export function SocietyDashboard({ mission }: any) {
  const societyResults = mission?.society_results || null;
  const coalition = societyResults?.coalition;
  const vote = societyResults?.vote;
  const negotiation = societyResults?.negotiation;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-medium text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            Multi-Agent Society
          </h2>
          <p className="text-sm text-slate-400">
            Hundreds of agents collaborating, forming teams, voting, and negotiating.
          </p>
        </div>
      </div>

      {!mission ? (
         <div className="text-slate-500 py-12 text-center">Run a mission to observe society dynamics.</div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Active Coalitions */}
        <div className="space-y-6">
          <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
              <GitMerge className="w-4 h-4 text-orange-400" /> Formed Coalition
            </h3>
            {coalition ? (
                <div className="bg-black/30 border border-slate-800 p-4 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-medium text-slate-200">{coalition.task}</h4>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded border bg-orange-900/30 text-orange-400 border-orange-800">
                      {coalition.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {coalition.members?.map((memberId: string, idx: number) => (
                        <div key={idx} className="bg-slate-800/50 border border-slate-700 px-2 py-1 rounded text-xs flex items-center gap-2">
                          <Users className="w-3 h-3 text-blue-400" />
                          <span className="text-slate-300">{memberId}</span>
                        </div>
                    ))}
                  </div>
                </div>
            ) : (
                <div className="text-sm text-slate-500">No coalition formed for this mission.</div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Voting Results */}
          <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Gavel className="w-4 h-4 text-emerald-400" /> Democratic Votes
            </h3>
            <div className="space-y-4">
              {vote ? (
                <div className="bg-black/30 border border-slate-800 p-4 rounded-xl">
                  <div className="flex items-start gap-3 mb-3">
                    {vote.approved ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    )}
                    <h4 className="text-sm font-medium text-slate-200 leading-snug">{vote.proposal}</h4>
                  </div>
                  <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      {vote.votes_for} For
                    </div>
                    <div className="flex items-center gap-1.5 text-red-400 font-medium">
                      <span className="w-2 h-2 rounded-full bg-red-400"></span>
                      {vote.votes_against} Against
                    </div>
                  </div>
                </div>
              ) : (
                  <div className="text-sm text-slate-500">No voting activity.</div>
              )}
            </div>
          </div>

          {/* Negotiations */}
          <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Handshake className="w-4 h-4 text-purple-400" /> Negotiations
            </h3>
            <div className="space-y-4">
              {negotiation ? (
                <div className="bg-black/30 border border-slate-800 p-4 rounded-xl space-y-3">
                  <h4 className="text-sm font-medium text-slate-200">{negotiation.issue}</h4>
                  <div className="text-xs text-slate-400 space-y-2 bg-slate-900/50 p-3 rounded-lg font-mono border border-slate-800/50">
                    {negotiation.dialogue?.map((line: string, i: number) => (
                      <div key={i}>{line}</div>
                    ))}
                  </div>
                  <div className="text-xs text-purple-300 bg-purple-900/20 p-2 rounded border border-purple-900/50">
                    <strong>Resolution:</strong> {negotiation.resolution}
                  </div>
                </div>
              ) : (
                  <div className="text-sm text-slate-500">No negotiations simulated.</div>
              )}
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
