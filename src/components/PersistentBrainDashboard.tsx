import React, { useEffect, useState } from "react";
import { BrainCircuit, Book, ShieldAlert, GitMerge, Activity, Key, Save, AlertCircle } from "lucide-react";

import { safeFetchJSON } from "../fetchUtils";

export function PersistentBrainDashboard() {
  const [db, setDb] = useState<any>({ episodic: [], semantic: [], procedural: [], concepts: [], beliefs: [] });
  const [loading, setLoading] = useState(true);

  const fetchBrain = async () => {
    const data = await safeFetchJSON("/brain/db", {}, { episodic: [], semantic: [], procedural: [], concepts: [], beliefs: [] });
    setDb(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBrain();
    const interval = setInterval(fetchBrain, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-white p-8 animate-pulse text-center space-y-4"><BrainCircuit className="w-12 h-12 mx-auto text-yellow-500 animate-spin-slow" /><p>Accessing Persistent Cognitive Brain...</p></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-medium text-white flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-indigo-400" />
            Persistent Cognitive Brain
          </h2>
          <p className="text-sm text-slate-400">
            System memory, beliefs, and concept structures evolving over time.
          </p>
        </div>
        <div className="flex gap-4 text-sm text-slate-300">
           <div className="flex flex-col items-center"><span className="text-lg text-white font-mono">{db.episodic?.length || 0}</span><span className="text-xs text-slate-500 uppercase tracking-widest">Episodes</span></div>
           <div className="flex flex-col items-center"><span className="text-lg text-white font-mono">{db.semantic?.length || 0}</span><span className="text-xs text-slate-500 uppercase tracking-widest">Facts</span></div>
           <div className="flex flex-col items-center"><span className="text-lg text-white font-mono">{db.concepts?.length || 0}</span><span className="text-xs text-slate-500 uppercase tracking-widest">Concepts</span></div>
           <div className="flex flex-col items-center"><span className="text-lg text-indigo-400 font-mono">{db.beliefs?.length || 0}</span><span className="text-xs text-slate-500 uppercase tracking-widest">Beliefs</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Belief System */}
         <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl space-y-6">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
               <ShieldAlert className="w-4 h-4 text-indigo-400" /> Evolving Belief System
            </h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
               {db.beliefs?.length === 0 && <p className="text-slate-500 text-sm italic">No deeply held beliefs yet. Run missions to establish baseline truths.</p>}
               {db.beliefs?.map((b: any, i: number) => (
                  <div key={i} className="bg-black/30 border border-slate-800 p-4 rounded-xl space-y-3">
                     <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium text-white leading-relaxed">"{b.belief}"</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-slate-900 text-indigo-300 border-indigo-900/50 shrink-0">
                           CONF: {(b.confidence * 100).toFixed(0)}%
                        </span>
                     </div>
                     <div className="flex gap-2 items-center text-[10px] text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">
                         <span>v{b.version || 1}</span> • <span>Updated: {new Date(b.last_updated || Date.now()).toLocaleString()}</span>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4 pt-1">
                        <div>
                           <span className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest block mb-1">Supporting</span>
                           <ul className="space-y-1">
                              {(b.supporting_evidence || []).map((e: string, idx: number) => <li key={idx} className="text-xs text-slate-400 leading-relaxed">• {e}</li>)}
                              {(!b.supporting_evidence || b.supporting_evidence.length === 0) && <li className="text-xs text-slate-600 italic">None logged.</li>}
                           </ul>
                        </div>
                        <div>
                           <span className="text-[10px] font-bold text-red-500/80 uppercase tracking-widest block mb-1">Contradicting</span>
                           <ul className="space-y-1">
                              {(b.contradicting_evidence || []).map((e: string, idx: number) => <li key={idx} className="text-xs text-slate-400 leading-relaxed">• {e}</li>)}
                              {(!b.contradicting_evidence || b.contradicting_evidence.length === 0) && <li className="text-xs text-slate-600 italic">None logged.</li>}
                           </ul>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="space-y-8">
             {/* Episodic Memory Timeline */}
             <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl space-y-6">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                   <Activity className="w-4 h-4 text-emerald-400" /> Episodic Memory Timeline
                </h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
                   {db.episodic?.slice().reverse().map((ep: any, i: number) => (
                      <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                         <div className="flex items-center justify-center w-4 h-4 rounded-full border border-slate-800 bg-[#111] group-hover:bg-emerald-500 group-hover:border-emerald-500 text-slate-500 group-hover:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors"></div>
                         <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-black/30 border border-slate-800 p-3 rounded-xl">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest">Mission ID: {ep.mission_id || 'SYS'}</span>
                                <span className="text-[10px] text-slate-500">{new Date(ep.timestamp).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-medium mb-1 truncate">{ep.mission_text}</p>
                            <p className="text-[10px] text-slate-500 line-clamp-2">{ep.summary}</p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             {/* Semantic Facts */}
             <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl space-y-6">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                   <Book className="w-4 h-4 text-yellow-400" /> Semantic Knowledge
                </h3>
                <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                   {db.semantic?.map((s: any, i: number) => (
                      <div key={i} className="bg-black/30 border border-slate-800 p-3 rounded-lg flex items-start gap-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-slate-900 text-yellow-300/80 border-yellow-900/30 whitespace-nowrap">
                             {s.concept}
                          </span>
                          <span className="text-xs text-slate-300 leading-relaxed">
                             {s.fact}
                          </span>
                      </div>
                   ))}
                </div>
             </div>
         </div>
      </div>
    </div>
  );
}
