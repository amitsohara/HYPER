import React, { useState, useEffect } from "react";
import { GraduationCap, BookOpen, Activity, PlayCircle, Star, TrendingUp, CheckCircle, BrainCircuit, ShieldAlert } from "lucide-react";
import { safeFetchJSON } from "../fetchUtils";

export function LearningDashboard({ mission }: { mission?: any }) {
  const [data, setData] = useState<any>({
    skills: [],
    improvements: [],
    competence: null,
    strategies: [],
    history: []
  });
  const [loading, setLoading] = useState(true);

  const fetchState = async () => {
    try {
      const [skills, improvements, competence, strategies, history] = await Promise.all([
        safeFetchJSON("/api/learning/skills", {}, { skills: [] }),
        safeFetchJSON("/api/learning/improvements", {}, { improvements: [] }),
        safeFetchJSON("/api/learning/competence", {}, null),
        safeFetchJSON("/api/learning/strategies", {}, { strategies: [] }),
        safeFetchJSON("/api/learning/history", {}, { history: [] })
      ]);
      setData({
        skills: skills.skills,
        improvements: improvements.improvements,
        competence,
        strategies: strategies.strategies,
        history: history.history
      });
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleReplay = async () => {
    await fetch("/api/learning/replay", { method: "POST" });
    fetchState();
  };

  if (loading) return <div className="text-white p-8 animate-pulse text-center"><GraduationCap className="w-12 h-12 mx-auto text-pink-500 animate-pulse mb-4" /><p>Accessing Learning Engine...</p></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-medium text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-pink-400" />
            Autonomous Learning Engine
          </h2>
          <p className="text-sm text-slate-400">
            Self-evaluating missions to continuously enhance HyperMind's cognitive core.
          </p>
        </div>
        <button onClick={handleReplay} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <PlayCircle className="w-4 h-4 text-emerald-400" /> Experience Replay
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Learning History & Skills */}
        <div className="space-y-6">
          <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-orange-400" /> Extracted Skills
            </h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {data.skills?.length === 0 && <p className="text-slate-500 text-sm italic">No skills extracted yet.</p>}
              {data.skills?.map((sk: any, i: number) => (
                <div key={i} className="bg-black/30 border border-slate-800 p-4 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-sm font-medium text-slate-200">{sk.skill_name}</h4>
                      <p className="text-[10px] text-slate-500 uppercase mt-1">{sk.domain}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 bg-slate-900/50 p-2 rounded mb-2">{sk.description}</p>
                  {sk.steps && (
                     <ol className="list-decimal list-inside text-[11px] text-slate-400">
                       {sk.steps.map((step: string, idx: number) => <li key={idx}>{step}</li>)}
                     </ol>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
              <CheckCircle className="w-4 h-4 text-blue-400" /> Mission History
            </h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {data.history?.length === 0 && <p className="text-slate-500 text-sm italic">No missions analyzed yet.</p>}
              {data.history?.map((h: any, i: number) => (
                <div key={i} className="bg-black/30 border border-slate-800 p-4 rounded-xl">
                    <div className="flex justify-between mb-2">
                       <span className="text-xs font-mono text-slate-400">{h.mission_id}</span>
                       <span className="text-xs text-emerald-400">Score: {h.mission_score?.score || h.mission_score || 'N/A'}</span>
                    </div>
                    {h.weaknesses_detected?.length > 0 && (
                       <div className="mb-2">
                         <span className="text-[10px] uppercase text-red-400 font-bold">Weaknesses</span>
                         <ul className="text-[11px] text-slate-300 list-disc list-inside">
                            {h.weaknesses_detected.map((w: any, idx: number) => <li key={idx}>{w.weakness_type}</li>)}
                         </ul>
                       </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Competence & Improvements */}
        <div className="space-y-6">
          {data.competence && (
            <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-emerald-400" /> Competence Tracker
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(data.competence).map(([key, val]: [string, any]) => (
                  <div key={key} className="bg-black/30 border border-slate-800 rounded p-3">
                     <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] uppercase text-slate-500">{key.replace(/_/g, ' ')}</span>
                        <span className="text-xs font-mono text-emerald-400">{val}</span>
                     </div>
                     <div className="w-full bg-slate-800 rounded-full h-1.5">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${val}%` }}></div>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
              <BrainCircuit className="w-4 h-4 text-purple-400" /> Accepted Improvements
            </h3>
            <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              {data.improvements?.length === 0 && <p className="text-slate-500 text-sm italic">No improvements applied yet.</p>}
              {data.improvements?.map((imp: any, i: number) => (
                <div key={i} className="bg-black/30 border border-slate-800 p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-xs font-medium text-slate-200">{imp.improvement?.target_component || 'System'}</span>
                     <span className="text-[10px] text-slate-500 font-mono">{imp.improvement?.improvement_id?.substring(0,8)}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-2">Expected Benefit: {imp.improvement?.expected_benefit}</p>
                  <div className="bg-slate-900/50 p-2 rounded text-[10px] font-mono text-slate-300">
                    <div><span className="text-red-400">- </span>{imp.improvement?.before}</div>
                    <div><span className="text-emerald-400">+ </span>{imp.improvement?.after}</div>
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
