import React, { useState, useEffect } from "react";
import { Users, Gavel, Handshake, GitMerge, CheckCircle, XCircle } from "lucide-react";
import { safeFetchJSON } from "../fetchUtils";

export function SocietyDashboard() {
  const [state, setState] = useState<any>({ agents: [], coalitions: [], votes: [], negotiations: [] });
  const [loading, setLoading] = useState(true);

  const fetchState = async () => {
    const data = await safeFetchJSON("/society/state", {}, { agents: [], coalitions: [], votes: [], negotiations: [] });
    setState(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleHoldVote = async () => {
    await fetch("/society/vote", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposal: "Allocate more resources to deep space exploration" })
    });
    fetchState();
  };
  
  const handleNegotiate = async () => {
    await fetch("/society/negotiate", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issue: "Should we prioritize speed over accuracy for the next mission?" })
    });
    fetchState();
  };

  if (loading) return <div className="text-white p-8 animate-pulse text-center"><Users className="w-12 h-12 mx-auto text-blue-400 animate-pulse mb-4" /><p>Accessing Multi-Agent Society...</p></div>;

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
        <div className="flex gap-4">
            <button onClick={handleHoldVote} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
              <Gavel className="w-4 h-4 text-emerald-400" /> Hold Vote
            </button>
            <button onClick={handleNegotiate} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
              <Handshake className="w-4 h-4 text-purple-400" /> Simulate Negotiation
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Active Coalitions */}
        <div className="space-y-6">
          <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
              <GitMerge className="w-4 h-4 text-orange-400" /> Active Coalitions
            </h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {state.coalitions?.length === 0 && <p className="text-slate-500 text-sm italic">No active coalitions.</p>}
              {state.coalitions?.map((c: any, i: number) => (
                <div key={i} className="bg-black/30 border border-slate-800 p-4 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-medium text-slate-200">{c.task}</h4>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded border bg-orange-900/30 text-orange-400 border-orange-800">
                      {c.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {c.members?.map((memberId: string, idx: number) => {
                      const agent = state.agents?.find((a: any) => a.id === memberId);
                      return (
                        <div key={idx} className="bg-slate-800/50 border border-slate-700 px-2 py-1 rounded text-xs flex items-center gap-2">
                          <Users className="w-3 h-3 text-blue-400" />
                          <span className="text-slate-300">{memberId}</span>
                          <span className="text-slate-500 capitalize">({agent?.role})</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Voting Results */}
          <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Gavel className="w-4 h-4 text-emerald-400" /> Recent Votes
            </h3>
            <div className="space-y-3 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
              {state.votes?.map((v: any, i: number) => (
                <div key={i} className="bg-black/30 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <p className="text-sm text-slate-200">{v.proposal}</p>
                    {v.approved ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    ) : (
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-emerald-400 font-medium">{v.votes_for} For</span>
                    <span className="text-red-400 font-medium">{v.votes_against} Against</span>
                    <span className="text-slate-500 ml-auto">Total: {v.votes_for + v.votes_against}</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="h-1.5 w-full bg-red-900/30 rounded-full mt-2 overflow-hidden flex">
                    <div className="h-full bg-emerald-500" style={{ width: `${(v.votes_for / (v.votes_for + v.votes_against)) * 100}%` }}></div>
                    <div className="h-full bg-red-500" style={{ width: `${(v.votes_against / (v.votes_for + v.votes_against)) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Negotiations */}
          <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Handshake className="w-4 h-4 text-purple-400" /> Recent Negotiations
            </h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              {state.negotiations?.length === 0 && <p className="text-slate-500 text-sm italic">No recent negotiations.</p>}
              {state.negotiations?.map((n: any, i: number) => (
                <div key={i} className="bg-black/30 border border-slate-800 p-4 rounded-xl">
                  <div className="mb-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Issue</span>
                    <p className="text-sm text-slate-200">{n.issue}</p>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded">Participants: {n.participants?.join(" vs ")}</span>
                    <span className="text-xs bg-purple-900/30 text-purple-400 px-2 py-1 rounded border border-purple-800 flex items-center gap-1">
                      Winner: {n.winner}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-500/80 uppercase">Resolution</span>
                    <p className="text-xs text-slate-400">{n.resolution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
