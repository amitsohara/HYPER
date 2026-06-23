import React, { useState, useEffect } from "react";
import { Activity, Beaker, BrainCircuit, Play, Shield, Zap } from "lucide-react";

export default function App() {
  const [missions, setMissions] = useState<any[]>([]);
  const [newMission, setNewMission] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMissions = async () => {
    try {
      const res = await fetch("/missions");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      if (Array.isArray(data)) {
        setMissions(data);
      } else {
        setMissions([]);
      }
      setError("");
    } catch (err) {
      setError("Could not connect to the Backend. Ensure the FastAPI server is running.");
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  const handleLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMission.trim()) return;
    
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/mission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mission_text: newMission }),
      });
      let d: any = {};
      try {
        const text = await res.text();
        d = text ? JSON.parse(text) : {};
      } catch (e) {
        // ignore json parse error
      }
      if (!res.ok) {
        throw new Error(d?.detail || "Launch failed");
      }
      setNewMission("");
      fetchMissions();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-300 font-sans selection:bg-blue-500/30">
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        <header className="space-y-4">
          <div className="flex items-center space-x-3 text-blue-500 mb-2">
            <Zap className="w-5 h-5" />
            <span className="text-sm font-bold tracking-wider uppercase">HyperMind-X Control Panel</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
            Mission Command
          </h1>
          <p className="text-lg text-slate-400">
            Define high-level objectives. The multi-agent system will decompose, assign, and execute them.
          </p>
        </header>

        {error && (
          <div className="bg-red-900/20 border border-red-900/50 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLaunch} className="flex gap-4">
          <input
            type="text"
            value={newMission}
            onChange={(e) => setNewMission(e.target.value)}
            placeholder="E.g., Analyze the impact of quantum computing on modern cryptography..."
            className="flex-1 bg-[#111111] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !newMission.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Activity className="w-5 h-5 animate-pulse" />
            ) : (
              <Play className="w-5 h-5" />
            )}
            <span>{loading ? "Engage Agents" : "Launch"}</span>
          </button>
        </form>

        <section className="space-y-6">
          <h2 className="text-2xl font-medium text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-slate-500" />
            Recent Missions
          </h2>
          
          <div className="grid gap-6">
            {missions.length === 0 && !error && (
              <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl text-slate-500">
                No missions executed yet. Start a new mission above.
              </div>
            )}
            
            {missions.map((mission) => (
              <div key={mission.mission_id} className="bg-[#111111] border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-medium text-white">{mission?.mission_text || "Unknown Mission"}</h3>
                  <span className="text-xs font-mono text-slate-500 bg-black px-2 py-1 rounded">
                    {mission?.mission_id ? String(mission.mission_id).substring(0, 8) : "N/A"}
                  </span>
                </div>
                
                <div className="space-y-6 pt-4 border-t border-slate-800/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-slate-400 flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-emerald-500" />
                        Goals
                      </h4>
                      <ul className="text-sm space-y-1">
                        {Array.isArray(mission?.goals) ? mission.goals.map((g: any, i: number) => (
                          <li key={i} className="flex gap-2 text-slate-300">
                            <span className="text-slate-600">•</span>
                            {typeof g === 'string' ? g : g?.description || g?.title || g?.task || g?.goal || JSON.stringify(g)}
                          </li>
                        )) : <li className="text-slate-500 text-xs">No goals</li>}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-slate-400 flex items-center gap-1.5">
                        <BrainCircuit className="w-4 h-4 text-blue-500" />
                        Synthetic Worlds
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(mission?.synthetic_worlds) ? mission.synthetic_worlds.map((w: any, i: number) => (
                          <span key={i} className="text-xs bg-blue-900/20 text-blue-300 px-2.5 py-1 rounded-full border border-blue-900/50">
                            {typeof w === 'string' ? w : JSON.stringify(w)}
                          </span>
                        )) : <span className="text-slate-500 text-xs">No worlds generated</span>}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-400 flex items-center gap-1.5">
                      <Beaker className="w-4 h-4 text-purple-500" />
                      Scenario Results
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {Array.isArray(mission?.scenarios) ? mission.scenarios.map((s: any, i: number) => (
                        <div key={i} className="bg-black/30 border border-slate-800 p-3 rounded-lg flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400 truncate pr-2">{s?.world || "Unknown World"}</span>
                            <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${s.score >= 80 ? 'text-emerald-400 bg-emerald-900/20' : 'text-amber-400 bg-amber-900/20'}`}>
                              {s.score || 0}/100
                            </span>
                          </div>
                          <p className="text-xs text-white bg-slate-800/40 p-2 rounded truncate" title={s?.scenario}>
                            {s?.scenario || "No scenario text"}
                          </p>
                          <p className="text-xs text-slate-300 line-clamp-3">
                            {s?.solution || "No solution provided"}
                          </p>
                        </div>
                      )) : <p className="text-slate-500 text-xs">No scenarios executed.</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-slate-400 flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-amber-500" />
                        Best Solution
                      </h4>
                      {mission?.best_solution ? (
                        <div className="bg-amber-900/10 border border-amber-900/30 p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-amber-400/80 uppercase tracking-wider">{mission.best_solution.world}</span>
                            <span className="text-xs font-mono text-emerald-400 bg-emerald-900/20 px-2 py-0.5 rounded">Score: {mission.best_solution.score || mission?.evaluation?.quality_score || 0}/100</span>
                          </div>
                          <p className="text-sm text-slate-200 mb-2">{mission.best_solution.scenario}</p>
                          <p className="text-sm text-amber-100/90 whitespace-pre-wrap">{mission.best_solution.solution}</p>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-sm">Pending</span>
                      )}
                    </div>
                    
                    {mission?.reflection && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-slate-400 flex items-center gap-1.5">
                          <BrainCircuit className="w-4 h-4 text-emerald-500" />
                          Lessons Learned
                        </h4>
                        <div className="text-sm space-y-2">
                          <p className="text-xs text-slate-300 bg-black/40 p-2 rounded border border-slate-800">
                            <span className="text-slate-500 block mb-1">Key Insight:</span>
                            {typeof mission.reflection.lessons_learned === 'string' ? mission.reflection.lessons_learned : (mission.reflection.lessons_learned ? JSON.stringify(mission.reflection.lessons_learned) : "N/A")}
                          </p>
                          <p className="text-xs text-slate-300 bg-black/40 p-2 rounded border border-slate-800">
                            <span className="text-blue-400/80 block mb-1">Next Improvement Suggestion:</span>
                            {typeof mission.reflection.improvement_suggestion === 'string' ? mission.reflection.improvement_suggestion : (mission.reflection.improvement_suggestion ? JSON.stringify(mission.reflection.improvement_suggestion) : "N/A")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
