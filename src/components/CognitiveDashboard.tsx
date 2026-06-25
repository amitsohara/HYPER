import React, { useState, useEffect } from "react";
import { Brain, Target, GitBranch, Lightbulb, Activity, CheckCircle, Clock, Zap, AlertTriangle, ListChecks } from "lucide-react";
import { safeFetchJSON } from "../fetchUtils";

export function CognitiveDashboard() {
  const [state, setState] = useState<any>({ beliefs: [], goals: [], plans: [], reasoning_chains: [], uncertainty_level: 0, confidence_level: 1, reasoning_summary: "", knowledge_gaps: [], current_mission: null });
  const [loading, setLoading] = useState(true);
  const [looping, setLooping] = useState(false);
  const [metaLoading, setMetaLoading] = useState(false);

  const fetchState = async () => {
    const data = await safeFetchJSON("/cognitive/state", {}, { beliefs: [], goals: [], plans: [], reasoning_chains: [], uncertainty_level: 0, confidence_level: 1, reasoning_summary: "", knowledge_gaps: [], current_mission: null });
    setState(data);
    
    const statusData = await safeFetchJSON("/cognitive/loop/status", {}, { running: false });
    setLooping(statusData.running);
    setLoading(false);
  };

  const triggerMetaCognition = async () => {
      setMetaLoading(true);
      try {
          await fetch("/cognitive/meta", { method: "POST" });
          await fetchState();
      } catch (e) {
          console.error(e);
      }
      setMetaLoading(false);
  };

  const toggleLoop = async () => {
      try {
          if (looping) {
              await fetch("/cognitive/loop/stop", { method: "POST" });
          } else {
              await fetch("/cognitive/loop/start", { method: "POST" });
          }
          await fetchState();
      } catch (e) {
          console.error(e);
      }
  };

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-white p-8 animate-pulse text-center"><Brain className="w-12 h-12 mx-auto text-purple-500 animate-pulse mb-4" /><p>Accessing Cognitive State...</p></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-medium text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            Cognitive Architecture
          </h2>
          <p className="text-sm text-slate-400">
            Internal reasoning, autonomous goals, planning, and meta-reflection.
          </p>
          <div className="flex gap-2">
            <button 
               onClick={toggleLoop} 
               className={`mt-2 px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 ${looping ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}>
               {looping ? <Activity className="w-4 h-4 animate-pulse" /> : <Zap className="w-4 h-4" />}
               {looping ? 'Stop Continuous Cognitive Loop' : 'Start Continuous Cognitive Loop'}
            </button>
            <button 
               onClick={triggerMetaCognition}
               disabled={metaLoading}
               className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 disabled:opacity-50">
               {metaLoading ? <Activity className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
               Run Meta-Cognition
            </button>
          </div>
        </div>
        <div className="flex gap-4 text-sm text-slate-300">
           <div className="flex flex-col items-center"><span className="text-lg text-red-400 font-mono">{(state.uncertainty_level * 100).toFixed(0)}%</span><span className="text-[10px] text-slate-500 uppercase tracking-widest">Uncertainty</span></div>
           <div className="flex flex-col items-center"><span className="text-lg text-emerald-400 font-mono">{(state.confidence_level * 100).toFixed(0)}%</span><span className="text-[10px] text-slate-500 uppercase tracking-widest">Confidence</span></div>
           <div className="w-px h-8 bg-slate-800 mx-2"></div>
           <div className="flex flex-col items-center"><span className="text-lg text-white font-mono">{state.goals?.length || 0}</span><span className="text-[10px] text-slate-500 uppercase tracking-widest">Goals</span></div>
           <div className="flex flex-col items-center"><span className="text-lg text-white font-mono">{state.plans?.length || 0}</span><span className="text-[10px] text-slate-500 uppercase tracking-widest">Plans</span></div>
           <div className="flex flex-col items-center"><span className="text-lg text-white font-mono">{state.beliefs?.length || 0}</span><span className="text-[10px] text-slate-500 uppercase tracking-widest">Beliefs</span></div>
        </div>
      </div>

      {/* Reasoning Summary & Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#111] border border-slate-800 p-5 rounded-2xl">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Activity className="w-3 h-3 text-purple-400" /> Reasoning Summary</h3>
              <p className="text-sm text-slate-300">{state.reasoning_summary}</p>
          </div>
          <div className="bg-[#111] border border-slate-800 p-5 rounded-2xl">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2"><AlertTriangle className="w-3 h-3 text-yellow-400" /> Knowledge Gaps</h3>
              <ul className="text-sm text-slate-300 list-disc pl-4 space-y-1">
                  {state.knowledge_gaps?.length === 0 && <li className="text-slate-500 italic list-none">No active gaps identified.</li>}
                  {state.knowledge_gaps?.map((gap: string, i: number) => <li key={i}>{gap}</li>)}
              </ul>
          </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Left Column: Goals & Plans */}
        <div className="space-y-6">
          {/* Current Goals */}
          <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-red-400" /> Goal System
            </h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
              {state.goals?.length === 0 && <p className="text-slate-500 text-sm italic">No active goals. Awaiting knowledge gaps or new missions.</p>}
              {state.goals?.map((g: any, i: number) => (
                <div key={i} className="bg-black/30 border border-slate-800 p-4 rounded-xl flex items-start justify-between flex-col space-y-3">
                  <div className="w-full flex justify-between items-start">
                    <p className="text-sm text-slate-200 font-medium">{g.description}</p>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${g.priority === 'high' ? 'bg-red-900/30 text-red-400 border-red-800' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>{g.priority}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 w-full">
                      <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><GitBranch className="w-3 h-3"/> Subgoals</span>
                          <ul className="text-xs text-slate-400 pl-3 list-disc">
                              {g.subgoals?.map((sg: string, idx: number) => <li key={idx}>{sg}</li>)}
                          </ul>
                      </div>
                      <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-yellow-500/50"/> Assumptions & Risks</span>
                          <ul className="text-xs text-slate-400 pl-3 list-disc">
                              {g.assumptions?.map((ass: string, idx: number) => <li key={idx}>{ass}</li>)}
                              {g.risk_factors?.map((rf: string, idx: number) => <li key={idx} className="text-red-400/70">{rf}</li>)}
                          </ul>
                      </div>
                  </div>

                  <div className="text-[10px] text-slate-500 flex items-center gap-1 w-full justify-end border-t border-slate-800 pt-2">
                    {g.status === 'in_progress' ? <Activity className="w-3 h-3 text-blue-400" /> : <Clock className="w-3 h-3 text-yellow-400" />} {g.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Plans */}
          <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
              <GitBranch className="w-4 h-4 text-emerald-400" /> Long-Term Plan
            </h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
              {state.plans?.length === 0 && <p className="text-slate-500 text-sm italic">No active plans.</p>}
              {state.plans?.map((p: any, i: number) => (
                <div key={i} className="bg-black/30 border border-slate-800 p-4 rounded-xl space-y-4">
                  <h4 className="text-sm font-medium text-slate-300 line-clamp-1">{p.goal_description}</h4>
                  
                  {/* Short/Medium/Long Term Steps */}
                  <div className="space-y-3 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-800">
                    <div className="relative pl-6">
                        <div className="absolute left-0 w-4 h-4 rounded-full border-2 border-slate-800 bg-emerald-900 flex items-center justify-center mt-0.5"><span className="text-[8px] text-emerald-400">S</span></div>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase">Short Term</span>
                        {p.short_term_steps?.map((step: any, idx: number) => (
                          <div key={idx} className="mt-1"><p className="text-xs text-slate-300">{step.action}</p><p className="text-[10px] text-slate-500">{step.expected_output}</p></div>
                        ))}
                    </div>
                    <div className="relative pl-6">
                        <div className="absolute left-0 w-4 h-4 rounded-full border-2 border-slate-800 bg-blue-900 flex items-center justify-center mt-0.5"><span className="text-[8px] text-blue-400">M</span></div>
                        <span className="text-[10px] font-bold text-blue-400 uppercase">Medium Term</span>
                        {p.medium_term_steps?.map((step: any, idx: number) => (
                          <div key={idx} className="mt-1"><p className="text-xs text-slate-300">{step.action}</p><p className="text-[10px] text-slate-500">{step.expected_output}</p></div>
                        ))}
                    </div>
                    <div className="relative pl-6">
                        <div className="absolute left-0 w-4 h-4 rounded-full border-2 border-slate-800 bg-purple-900 flex items-center justify-center mt-0.5"><span className="text-[8px] text-purple-400">L</span></div>
                        <span className="text-[10px] font-bold text-purple-400 uppercase">Long Term</span>
                        {p.long_term_steps?.map((step: any, idx: number) => (
                          <div key={idx} className="mt-1"><p className="text-xs text-slate-300">{step.action}</p><p className="text-[10px] text-slate-500">{step.expected_output}</p></div>
                        ))}
                    </div>
                  </div>

                  <div className="flex gap-4 border-t border-slate-800 pt-3">
                      <div className="flex-1">
                          <span className="text-[10px] text-slate-500 font-bold uppercase">Required Agents</span>
                          <div className="flex gap-1 flex-wrap mt-1">
                              {p.required_agents?.map((a: string, idx: number) => <span key={idx} className="text-[9px] bg-slate-800 px-1 py-0.5 rounded text-slate-300">{a}</span>)}
                          </div>
                      </div>
                      <div className="flex-1">
                          <span className="text-[10px] text-red-500/80 font-bold uppercase">Failure Points</span>
                          <ul className="text-[10px] text-slate-400 pl-3 list-disc mt-1">
                              {p.failure_points?.map((f: string, idx: number) => <li key={idx}>{f}</li>)}
                          </ul>
                      </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Beliefs & Meta Reasoning */}
        <div className="space-y-6">
          {/* Beliefs */}
          <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Lightbulb className="w-4 h-4 text-yellow-400" /> Belief System
            </h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
              {state.beliefs?.map((b: any, i: number) => (
                <div key={i} className="bg-black/30 border border-slate-800 p-4 rounded-xl space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm text-slate-200 font-medium leading-relaxed">"{b.belief}"</h4>
                    <span className="text-xs font-mono text-purple-400 bg-purple-900/20 px-2 py-1 rounded border border-purple-800/50 flex-shrink-0 ml-2">
                      CONF: {(b.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-emerald-500/80 uppercase">Supporting Evidence</span>
                        {b.evidence?.map((e: string, idx: number) => (
                          <p key={idx} className="text-xs text-emerald-400/70">• {e}</p>
                        ))}
                      </div>
                      <div className="space-y-1 border-l border-slate-800 pl-4">
                        <span className="text-[10px] font-bold text-red-500/80 uppercase">Contradicting Evidence</span>
                        {b.contradicting_evidence?.length === 0 && <p className="text-xs text-slate-500 italic">None found yet.</p>}
                        {b.contradicting_evidence?.map((e: string, idx: number) => (
                          <p key={idx} className="text-xs text-red-400/70">• {e}</p>
                        ))}
                      </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-800 pt-2">
                      <span>Sources: {b.source_missions?.length} missions</span>
                      <span>Version: {b.version} | Updated: {new Date(b.last_updated).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reasoning Chains (Internal) */}
          <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-blue-400" /> Meta-Reasoning Chains
            </h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {state.reasoning_chains?.length === 0 && <p className="text-slate-500 text-sm italic">No reflections yet.</p>}
              {state.reasoning_chains?.map((r: any, i: number) => (
                <div key={i} className="bg-black/30 border border-slate-800 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] text-slate-500 font-mono">{new Date(r.timestamp).toLocaleTimeString()}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Mission: {r.mission_id}</span>
                  </div>
                  <div className="space-y-2 mb-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Reasoning Chain</span>
                    <ul className="list-decimal list-inside text-xs text-slate-400 space-y-1">
                      {r.reasoning_chain?.map((step: string, idx: number) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-500/80 uppercase">Lessons Learned</span>
                    {r.lessons_learned?.map((l: string, idx: number) => (
                      <p key={idx} className="text-xs text-emerald-400/70">• {l}</p>
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
