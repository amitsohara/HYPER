import React, { useState, useEffect } from "react";
import { Play, Square, RefreshCcw, Activity, CheckCircle2, UserCog, Database, ExternalLink, Bot, Target } from "lucide-react";
import { safeFetchJSON } from "../fetchUtils";

export function GoalLoopDashboard() {
  const [loops, setLoops] = useState<any[]>([]);
  const [selectedLoop, setSelectedLoop] = useState<any>(null);
  const [purposeInput, setPurposeInput] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isStepping, setIsStepping] = useState(false);

  useEffect(() => {
    fetchLoops();
    const interval = setInterval(fetchLoops, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchLoops = async () => {
    try {
      const data = await safeFetchJSON("/api/loop/all", {}, []);
      setLoops(data);
      if (selectedLoop) {
        const updated = data.find((l: any) => l.id === selectedLoop.id);
        if (updated) setSelectedLoop(updated);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const createLoop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!purposeInput.trim()) return;
    setIsCreating(true);
    try {
      const res = await fetch("/api/loop/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purpose: purposeInput })
      });
      const newLoop = await res.json();
      setPurposeInput("");
      fetchLoops();
      setSelectedLoop(newLoop);
    } catch (e) {
      console.error(e);
    }
    setIsCreating(false);
  };

  const stepLoop = async () => {
    if (!selectedLoop) return;
    setIsStepping(true);
    try {
      const res = await fetch(`/api/loop/${selectedLoop.id}/step`, { method: "POST" });
      const updated = await res.json();
      setSelectedLoop(updated);
      fetchLoops();
    } catch (e) {
      console.error(e);
    }
    setIsStepping(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Square className="w-4 h-4 text-slate-500" />;
      case "running": return <Activity className="w-4 h-4 text-blue-500" />;
      case "completed": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "needs_human": return <UserCog className="w-4 h-4 text-yellow-500" />;
      case "failed": return <Square className="w-4 h-4 text-red-500" />;
      default: return <Square className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <RefreshCcw className="w-5 h-5 text-indigo-500" />
            Recursive Goal Loops
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Define a high-level purpose and the AI will recursively plan, act, and verify until the goal is met or human handoff is required.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Create & List */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#111] border border-slate-800 p-5 rounded-2xl shadow-sm">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-400" /> New Goal Loop
            </h3>
            <form onSubmit={createLoop} className="space-y-4">
              <textarea
                value={purposeInput}
                onChange={e => setPurposeInput(e.target.value)}
                placeholder="e.g. Map the entire codebase, identifying all critical vulnerabilities, and generate a final patch file."
                className="w-full bg-black border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none h-24"
              />
              <button
                type="submit"
                disabled={isCreating || !purposeInput.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? <Activity className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                Initialize Loop
              </button>
            </form>
          </div>

          <div className="bg-[#111] border border-slate-800 p-5 rounded-2xl shadow-sm max-h-[500px] overflow-y-auto custom-scrollbar">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Database className="w-4 h-4 text-slate-400" /> Active Loops
            </h3>
            <div className="space-y-3">
              {loops.length === 0 && <p className="text-sm text-slate-500 italic">No active loops.</p>}
              {loops.map(loop => (
                <button
                  key={loop.id}
                  onClick={() => setSelectedLoop(loop)}
                  className={`w-full text-left p-3 rounded-xl border transition-colors ${selectedLoop?.id === loop.id ? "bg-indigo-900/20 border-indigo-500/50" : "bg-black/30 border-slate-800 hover:border-slate-700"}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-slate-500">{loop.id}</span>
                    <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {getStatusIcon(loop.status)}
                      <span className="text-[10px] uppercase font-bold text-slate-300">{loop.status}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">{loop.purpose}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Loop Detail */}
        <div className="lg:col-span-2">
          {selectedLoop ? (
            <div className="bg-[#111] border border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[750px]">
              {/* Detail Header */}
              <div className="p-5 border-b border-slate-800 bg-black/20 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-indigo-400 bg-indigo-900/30 px-2 py-1 rounded border border-indigo-900/50">
                      {selectedLoop.id}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Activity className="w-3 h-3" /> {selectedLoop.iterations?.length || 0} Iterations
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-white">{selectedLoop.purpose}</h3>
                </div>
                
                <div className="shrink-0 flex flex-col items-end">
                  <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 mb-3">
                    {getStatusIcon(selectedLoop.status)}
                    <span className="text-sm uppercase font-bold text-slate-300">{selectedLoop.status}</span>
                  </div>
                  
                  {['pending', 'running', 'needs_human'].includes(selectedLoop.status) && (
                    <button
                      onClick={stepLoop}
                      disabled={isStepping}
                      className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white text-sm font-medium py-1.5 px-4 rounded transition-colors flex items-center gap-2"
                    >
                      {isStepping ? <Activity className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                      Step Iteration
                    </button>
                  )}
                </div>
              </div>

              {/* State Panel */}
              <div className="p-4 bg-slate-900/50 border-b border-slate-800 overflow-x-auto">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">External Shared State</span>
                <div className="flex gap-4">
                  {Object.keys(selectedLoop.external_state || {}).length === 0 ? (
                    <span className="text-sm text-slate-600 italic">No state recorded yet.</span>
                  ) : (
                    Object.entries(selectedLoop.external_state).map(([k, v]: [string, any]) => (
                      <div key={k} className="bg-black/40 border border-slate-800 p-2 rounded shrink-0 min-w-[150px]">
                        <span className="block text-[10px] text-slate-500 uppercase">{k}</span>
                        <span className="text-sm font-mono text-indigo-300 truncate max-w-[200px] block">
                          {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Iterations Feed */}
              <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-black/10">
                {selectedLoop.iterations?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-3">
                    <Activity className="w-8 h-8 opacity-50" />
                    <p>No iterations yet. Step the loop to begin.</p>
                  </div>
                ) : (
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-800">
                    {selectedLoop.iterations.map((iter: any) => (
                      <div key={iter.iteration_number} className="relative flex items-start justify-between space-x-4">
                        <div className="relative z-10 flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${iter.is_complete ? 'bg-green-900/50 border-green-500/50 text-green-400' : iter.needs_human ? 'bg-yellow-900/50 border-yellow-500/50 text-yellow-400' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>
                            {iter.is_complete ? <CheckCircle2 className="w-4 h-4" /> : iter.needs_human ? <UserCog className="w-4 h-4" /> : <RefreshCcw className="w-4 h-4" />}
                          </div>
                          <span className="text-[10px] font-bold text-slate-500 mt-1">#{iter.iteration_number}</span>
                        </div>
                        
                        <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl p-4 shadow-sm space-y-4">
                          <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Action Taken</h4>
                            <p className="text-sm text-slate-300 leading-relaxed bg-black/40 p-3 rounded-lg border border-slate-800/50">
                              {iter.action_taken}
                            </p>
                          </div>
                          
                          {iter.sub_agents_used?.length > 0 && (
                            <div>
                              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1"><Bot className="w-3 h-3" /> Sub-Agents Utilized</h4>
                              <div className="flex gap-2 flex-wrap">
                                {iter.sub_agents_used.map((agent: string, i: number) => (
                                  <span key={i} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">
                                    {agent}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="border-t border-slate-800/50 pt-3">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Verification Result</h4>
                            <p className="text-sm text-indigo-200/80 leading-relaxed">
                              {iter.verification_result}
                            </p>
                          </div>
                          
                          {iter.handoff_reason && (
                            <div className="bg-yellow-900/20 border border-yellow-900/50 p-3 rounded-lg mt-2">
                              <h4 className="text-xs font-bold text-yellow-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                <UserCog className="w-3 h-3" /> Handoff Reason
                              </h4>
                              <p className="text-sm text-yellow-200">{iter.handoff_reason}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#111] border border-slate-800 rounded-2xl shadow-sm h-full flex flex-col items-center justify-center text-slate-500 p-8 text-center min-h-[500px]">
              <RefreshCcw className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium text-slate-400">No Loop Selected</p>
              <p className="text-sm mt-2 max-w-md">Select an active goal loop from the left or create a new one to monitor its recursive progress.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
