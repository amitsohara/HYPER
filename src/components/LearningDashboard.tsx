import React, { useState, useEffect } from "react";
import { GraduationCap, BookOpen, Activity, PlayCircle, Star, GitMerge, TrendingUp, CheckCircle } from "lucide-react";
import { safeFetchJSON } from "../fetchUtils";

export function LearningDashboard() {
  const [state, setState] = useState<any>({ skill_library: [], learning_progress: [], replayed_missions: [], evaluations: [] });
  const [loading, setLoading] = useState(true);

  const fetchState = async () => {
    const data = await safeFetchJSON("/learning/state", {}, { skill_library: [], learning_progress: [], replayed_missions: [], evaluations: [] });
    setState(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleReplay = async () => {
    await fetch("/learning/replay", { method: "POST" });
    fetchState();
  };

  if (loading) return <div className="text-white p-8 animate-pulse text-center"><GraduationCap className="w-12 h-12 mx-auto text-pink-500 animate-pulse mb-4" /><p>Accessing Learning Engine...</p></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-medium text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-pink-400" />
            Autonomous Learning
          </h2>
          <p className="text-sm text-slate-400">
            Extract reusable skills, replay past missions, and track continuous improvement.
          </p>
        </div>
        <button onClick={handleReplay} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <PlayCircle className="w-4 h-4 text-emerald-400" /> Replay Random Mission
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Skill Library */}
        <div className="space-y-6">
          <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-orange-400" /> Skill Library
            </h3>
            <div className="space-y-4 max-h-[800px] overflow-y-auto custom-scrollbar pr-2">
              {state.skill_library?.length === 0 && <p className="text-slate-500 text-sm italic">No skills extracted yet.</p>}
              {state.skill_library?.map((sk: any, i: number) => (
                <div key={i} className="bg-black/30 border border-slate-800 p-4 rounded-xl flex flex-col space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium text-slate-200">{sk.name}</h4>
                      <p className="text-[10px] text-slate-500 uppercase mt-1">{sk.domain}</p>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded border bg-orange-900/30 text-orange-400 border-orange-800 flex items-center gap-1">
                      <Star className="w-3 h-3" /> {(sk.success_rate * 100).toFixed(0)}% Success
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-300 bg-slate-900/50 p-2 rounded">{sk.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Use Case</span>
                        <p className="text-[11px] text-slate-400">{sk.use_case}</p>
                      </div>
                      <div className="space-y-1 border-l border-slate-800 pl-4">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Evidence</span>
                        <p className="text-[11px] text-slate-400">{sk.evidence}</p>
                      </div>
                  </div>

                  {sk.procedure && sk.procedure.length > 0 && (
                    <div className="space-y-1 border-t border-slate-800 pt-3">
                      <span className="text-[10px] font-bold text-emerald-500/80 uppercase">Procedure</span>
                      <ol className="list-decimal list-inside text-[11px] text-slate-300 space-y-1">
                        {sk.procedure.map((step: string, idx: number) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  <div className="flex justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800">
                      <span>Related: {sk.related_missions?.length} missions</span>
                      <span>Version {sk.version}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Evaluations & Replays */}
        <div className="space-y-6">

          {/* Self Evaluations */}
          <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
              <CheckCircle className="w-4 h-4 text-blue-400" /> Self Evaluator
            </h3>
            <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              {state.evaluations?.length === 0 && <p className="text-slate-500 text-sm italic">No evaluations yet.</p>}
              {state.evaluations?.map((ev: any, i: number) => (
                <div key={i} className="bg-black/30 border border-slate-800 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Mission: {ev.mission_id}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{new Date(ev.timestamp).toLocaleTimeString()}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                        <div className="bg-[#111] border border-slate-800 rounded px-2 py-1 flex justify-between items-center">
                            <span className="text-[9px] uppercase text-slate-500">Reasoning</span>
                            <span className="text-xs font-mono text-emerald-400">{ev.reasoning_quality}</span>
                        </div>
                        <div className="bg-[#111] border border-slate-800 rounded px-2 py-1 flex justify-between items-center">
                            <span className="text-[9px] uppercase text-slate-500">Planning</span>
                            <span className="text-xs font-mono text-blue-400">{ev.planning_quality}</span>
                        </div>
                        <div className="bg-[#111] border border-slate-800 rounded px-2 py-1 flex justify-between items-center">
                            <span className="text-[9px] uppercase text-slate-500">Learning</span>
                            <span className="text-xs font-mono text-purple-400">{ev.learning_value}</span>
                        </div>
                        <div className="bg-[#111] border border-slate-800 rounded px-2 py-1 flex justify-between items-center">
                            <span className="text-[9px] uppercase text-slate-500">Novelty</span>
                            <span className="text-xs font-mono text-pink-400">{ev.novelty}</span>
                        </div>
                        <div className="bg-[#111] border border-slate-800 rounded px-2 py-1 flex justify-between items-center">
                            <span className="text-[9px] uppercase text-slate-500">Factual</span>
                            <span className="text-xs font-mono text-yellow-400">{ev.factual_confidence}</span>
                        </div>
                        <div className="bg-[#111] border border-slate-800 rounded px-2 py-1 flex justify-between items-center">
                            <span className="text-[9px] uppercase text-slate-500">Risk</span>
                            <span className="text-xs font-mono text-orange-400">{ev.risk_awareness}</span>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 border-t border-slate-800 pt-2"><span className="text-[10px] font-bold text-slate-500 uppercase mr-2">Justification:</span>{ev.justification}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Replay */}
          <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
              <GitMerge className="w-4 h-4 text-purple-400" /> Experience Replay Log
            </h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              {state.replayed_missions?.length === 0 && <p className="text-slate-500 text-sm italic">No missions replayed yet.</p>}
              {state.replayed_missions?.map((r: any, i: number) => (
                <div key={i} className="bg-black/30 border border-slate-800 p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Mission: {r.mission_id}</span>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-500 line-through">{r.old_score}</span>
                        <span className="text-xs font-mono text-emerald-400">{r.new_score}</span>
                        <span className="text-[10px] bg-emerald-900/30 text-emerald-400 px-1 py-0.5 rounded">+{r.intelligence_gain}</span>
                    </div>
                  </div>
                  <div className="space-y-1 border-t border-slate-800 pt-2">
                    <span className="text-[10px] font-bold text-purple-400 uppercase">Insights Gained</span>
                    {r.insights_gained?.map((insight: string, idx: number) => (
                      <p key={idx} className="text-xs text-slate-300">• {insight}</p>
                    ))}
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
