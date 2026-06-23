import React, { useEffect, useState } from "react";
import { Play, Square, Activity, Database, Zap, BookOpen, AlertCircle, ArrowUpRight } from "lucide-react";

import { safeFetchJSON } from "../fetchUtils";

export function AutonomousDashboard() {
  const [queue, setQueue] = useState<any[]>([]);
  const [gaps, setGaps] = useState<any[]>([]);
  const [status, setStatus] = useState<any>({ active: false, maxDepth: 3, maxMissions: 5, currentDepth: 0, currentMissions: 0 });

  const fetchData = async () => {
    try {
      const qData = await safeFetchJSON("/research/queue", {}, []);
      setQueue(qData);

      const gData = await safeFetchJSON("/research/gaps", {}, []);
      setGaps(gData);

      const sData = await safeFetchJSON("/research/autonomous/status", {}, { active: false, maxDepth: 3, maxMissions: 5, currentDepth: 0, currentMissions: 0 });
      setStatus(sData);
    } catch(e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = async () => {
    const endpoint = status.active ? "/research/autonomous/stop" : "/research/autonomous/start";
    await fetch(endpoint, { method: "POST" });
    fetchData();
  };

  const handleManualTrigger = async (question: string) => {
    try {
       await fetch("/research/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mission_text: question, simulation_mode: "futuristic" }),
       });
       fetchData();
    } catch(e) {
       console.error("Manual trigger failed", e);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       <div className="flex justify-between items-center bg-[#111] border border-slate-800 p-6 rounded-2xl">
        <div className="space-y-1">
          <h2 className="text-xl font-medium text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Autonomous Research Loop
          </h2>
          <p className="text-sm text-slate-400">
            Identify knowledge gaps from completed missions and autonomously pursue follow-up research.
          </p>
        </div>
        <button
          onClick={handleToggle}
          className={`px-6 py-2.5 rounded-xl font-medium flex items-center space-x-2 transition-colors shrink-0 ${status.active ? "bg-red-900/50 hover:bg-red-900/80 text-red-200 border border-red-900/50" : "bg-yellow-600 hover:bg-yellow-700 text-white"}`}
        >
          {status.active ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{status.active ? "Stop Autonomous Run" : "Start Autonomous AI"}</span>
        </button>
      </div>

      {status.active && (
         <div className="bg-yellow-900/10 border border-yellow-900/30 p-4 rounded-xl flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3">
               <Activity className="w-5 h-5 text-yellow-500" />
               <div>
                  <span className="text-sm font-bold text-yellow-500 block">Agent Loop Running</span>
                  <span className="text-xs text-yellow-500/70">It may take a few minutes for new research to appear in the dashboard.</span>
               </div>
            </div>
            <div className="text-xs font-mono text-yellow-300/80 bg-black/40 px-3 py-1 rounded">
               MISSIONS: {status.currentMissions} / {status.maxMissions}
            </div>
         </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Knowledge Gaps */}
         <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl space-y-6">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
               <BookOpen className="w-4 h-4 text-orange-400" /> Identified Knowledge Gaps
            </h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
               {gaps.length === 0 && <p className="text-slate-500 text-sm italic">Run research missions to seed initial gaps.</p>}
               {gaps.map((gap, i) => (
                  <div key={i} className="bg-black/30 border border-slate-800 p-4 rounded-xl space-y-4">
                     <span className="text-[10px] text-orange-500/80 font-bold tracking-widest bg-orange-950/30 px-2 py-0.5 rounded border border-orange-900/50">
                        SRC: {gap.mission_id}
                     </span>
                     
                     {gap.gaps && gap.gaps.length > 0 && (
                        <div>
                           <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-800 pb-1">Core Gaps</h4>
                           <ul className="space-y-1.5">
                              {gap.gaps.map((g: string, idx: number) => <li key={idx} className="text-xs text-orange-200/90 leading-relaxed">• {g}</li>)}
                           </ul>
                        </div>
                     )}

                     {gap.unanswered_questions && gap.unanswered_questions.length > 0 && (
                        <div>
                           <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-800 pb-1 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Unanswered
                           </h4>
                           <ul className="space-y-1.5">
                              {gap.unanswered_questions.map((q: string, idx: number) => <li key={idx} className="text-xs text-slate-400 leading-relaxed">? {q}</li>)}
                           </ul>
                        </div>
                     )}
                     
                     {gap.weak_assumptions && gap.weak_assumptions.length > 0 && (
                        <div>
                           <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-800 pb-1">Weak Assumptions</h4>
                           <ul className="space-y-1.5">
                              {gap.weak_assumptions.map((w: string, idx: number) => <li key={idx} className="text-xs text-slate-400 italic leading-relaxed">- {w}</li>)}
                           </ul>
                        </div>
                     )}
                  </div>
               ))}
            </div>
         </div>

         {/* Research Queue */}
         <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl space-y-6">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
               <Database className="w-4 h-4 text-yellow-400" /> Research Queue
            </h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
               {queue.length === 0 && <p className="text-slate-500 text-sm italic">Queue is currently empty.</p>}
               {queue.map((q, i) => (
                  <div key={i} className={`border p-4 rounded-xl space-y-3 ${q.status === 'running' ? 'bg-yellow-900/10 border-yellow-500/50' : q.status === 'completed' ? 'bg-emerald-900/10 border-emerald-900/30' : 'bg-black/30 border-slate-800'}`}>
                     <div className="flex justify-between items-start gap-4">
                        <p className="text-sm font-medium text-white leading-relaxed">{q.question}</p>
                        <div className="flex flex-col gap-1 shrink-0">
                           <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-slate-900 text-slate-300 border-slate-700 w-full text-center">
                              PRI: {q.priority_score}
                           </span>
                           <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-slate-900 text-slate-300 border-slate-700 w-full text-center">
                              VAL: {q.research_value_score}
                           </span>
                        </div>
                     </div>
                     
                     <div className="flex justify-between items-center pt-2 border-t border-slate-800/50">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${q.status === 'running' ? 'text-yellow-500' : q.status === 'completed' ? 'text-emerald-500' : 'text-slate-500'}`}>
                           STATUS: {q.status}
                        </span>

                        {q.status === 'pending' && !status.active && (
                           <button 
                              onClick={() => handleManualTrigger(q.question)}
                              className="text-[10px] flex items-center gap-1 font-bold text-blue-400 hover:text-blue-300 uppercase tracking-widest"
                           >
                              Manual Trigger <ArrowUpRight className="w-3 h-3" />
                           </button>
                        )}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
