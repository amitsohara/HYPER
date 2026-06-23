import React, { useState, useEffect } from "react";
import { Activity, Beaker, BrainCircuit, Play, Shield, Zap, Network, FlaskConical } from "lucide-react";
import { EvolutionDashboard } from "./components/EvolutionDashboard";
import { KnowledgeGraphDashboard } from "./components/KnowledgeGraphDashboard";
import { ResearchDashboard } from "./components/ResearchDashboard";

export default function App() {
  const [missions, setMissions] = useState<any[]>([]);
  const [newMission, setNewMission] = useState("");
  const [simulationMode, setSimulationMode] = useState("realistic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"missions" | "evolution" | "knowledge_graph" | "research">("research");

  const [agentVersions, setAgentVersions] = useState<any>({});
  const [agentPerformances, setAgentPerformances] = useState<any[]>([]);
  const [evolving, setEvolving] = useState(false);

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

  const fetchEvolutionData = async () => {
    try {
      const [vRes, pRes] = await Promise.all([
        fetch("/agents/versions").then(res => res.json()),
        fetch("/agents/performance").then(res => res.json())
      ]);
      setAgentVersions(vRes);
      setAgentPerformances(pRes);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMissions();
    fetchEvolutionData();
  }, []);

  const handleEvolve = async () => {
    setEvolving(true);
    try {
      await fetch("/agents/evolve", { method: "POST" });
      await fetchEvolutionData();
    } catch(e) {
      console.error(e);
    }
    setEvolving(false);
  };

  const handleLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMission.trim()) return;
    
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/mission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mission_text: newMission, simulation_mode: simulationMode }),
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-2">
                {activeTab === 'missions' ? 'Mission Command' : activeTab === 'evolution' ? 'Evolution Engine' : activeTab === 'research' ? 'Research Scientist' : 'Knowledge Graph Brain'}
              </h1>
              <p className="text-lg text-slate-400">
                {activeTab === 'missions' ? 'Define high-level objectives. The multi-agent system will decompose, assign, and execute them.' : activeTab === 'evolution' ? 'Track agent performance and evolve system prompts based on mission outcomes.' : activeTab === 'research' ? 'Formulate hypotheses, design experiments, and generate scientific reports.' : 'A self-assembling network of entities, concepts, and relationships extracted from completed missions.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-1 bg-[#111] p-1 rounded-xl border border-slate-800">
              <button 
                onClick={() => setActiveTab("missions")} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "missions" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"}`}
              >
                Missions
              </button>
              <button 
                onClick={() => setActiveTab("evolution")} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "evolution" ? "bg-purple-900/50 text-purple-200" : "text-slate-400 hover:text-purple-300"}`}
              >
                <BrainCircuit className="w-4 h-4" />
                Evolution Engine
              </button>
              <button 
                onClick={() => setActiveTab("knowledge_graph")} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "knowledge_graph" ? "bg-cyan-900/50 text-cyan-200" : "text-slate-400 hover:text-cyan-300"}`}
              >
                <Network className="w-4 h-4" />
                Knowledge Graph
              </button>
              <button 
                onClick={() => setActiveTab("research")} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "research" ? "bg-indigo-900/50 text-indigo-200" : "text-slate-400 hover:text-indigo-300"}`}
              >
                <FlaskConical className="w-4 h-4" />
                Research Scientist
              </button>
            </div>
          </div>
        </header>

        {error && (
          <div className="bg-red-900/20 border border-red-900/50 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {activeTab === "evolution" ? (
          <EvolutionDashboard 
             agentVersions={agentVersions} 
             agentPerformances={agentPerformances} 
             evolving={evolving} 
             handleEvolve={handleEvolve} 
          />
        ) : activeTab === "knowledge_graph" ? (
          <KnowledgeGraphDashboard />
        ) : activeTab === "research" ? (
          <ResearchDashboard simulationMode={simulationMode} setSimulationMode={setSimulationMode} />
        ) : (
          <>
            <form onSubmit={handleLaunch} className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-1 gap-4">
                <input
                  type="text"
                  value={newMission}
                  onChange={(e) => setNewMission(e.target.value)}
                  placeholder="E.g., Analyze the impact of quantum computing on modern cryptography..."
                  className="flex-1 bg-[#111111] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  disabled={loading}
                />
                <select
                  value={simulationMode}
                  onChange={(e) => setSimulationMode(e.target.value)}
                  className="bg-[#111111] border border-slate-800 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-blue-500 transition-colors"
                  disabled={loading}
                >
                  <option value="realistic">Realistic</option>
                  <option value="futuristic">Futuristic</option>
                  <option value="sci_fi">Sci-Fi</option>
                  <option value="business">Business</option>
                  <option value="scientific">Scientific</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading || !newMission.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed justify-center"
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
                  <div>
                    <h3 className="text-xl font-medium text-white">{mission?.mission_text || "Unknown Mission"}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded border border-blue-900/50 uppercase tracking-wider font-semibold">
                        {mission?.simulation_mode || 'realistic'}
                      </span>
                      {mission?.reused_memories && mission.reused_memories.length > 0 && (
                        <span className="text-[10px] bg-purple-900/30 text-purple-400 px-2 py-0.5 rounded border border-purple-900/50 uppercase tracking-wider font-semibold">
                          Memories Reused ({mission.reused_memories.length})
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-mono text-slate-500 bg-black px-2 py-1 rounded mt-1">
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
                          <span key={i} className="text-[10px] bg-blue-900/20 text-blue-300 px-2.5 py-1 rounded-lg border border-blue-900/50 max-w-full truncate" title={typeof w === 'string' ? w : ''}>
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
                      {Array.isArray(mission?.scenario_results || mission?.scenarios) ? (mission.scenario_results || mission.scenarios).map((s: any, i: number) => (
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

                  {mission?.discovery && (
                    <div className="space-y-4 pt-4 border-t border-slate-800/50">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-purple-400 flex items-center gap-1.5 uppercase tracking-wider">
                          <BrainCircuit className="w-4 h-4 text-purple-500" />
                          Discovery Engine Results
                        </h4>
                        {mission.discovery.breakthrough_ranking && (
                          <div className="flex gap-2 ml-auto">
                            <span className="text-[10px] bg-purple-900/30 text-purple-300 px-2 py-1 rounded border border-purple-900/50">
                              Breakthrough: {mission.discovery.breakthrough_ranking.breakthrough_score}%
                            </span>
                            <span className="text-[10px] bg-emerald-900/30 text-emerald-300 px-2 py-1 rounded border border-emerald-900/50">
                              Feasibility: {mission.discovery.breakthrough_ranking.feasibility_score}%
                            </span>
                            <span className="text-[10px] bg-blue-900/30 text-blue-300 px-2 py-1 rounded border border-blue-900/50">
                              Impact: {mission.discovery.breakthrough_ranking.civilization_impact_score}%
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="space-y-2 bg-purple-900/10 p-3 rounded-lg border border-purple-900/30">
                          <h5 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">New Hypotheses</h5>
                          <ul className="text-xs space-y-2">
                            {Array.isArray(mission.discovery.hypotheses) ? mission.discovery.hypotheses.map((h: any, i: number) => (
                              <li key={i} className="flex gap-2 text-purple-200/80">
                                <span className="text-purple-500 font-mono">{i+1}.</span>
                                {h}
                              </li>
                            )) : <li className="text-slate-500 text-xs">No hypotheses</li>}
                          </ul>
                        </div>
                        <div className="space-y-2 bg-blue-900/10 p-3 rounded-lg border border-blue-900/30">
                          <h5 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Experiments</h5>
                          <ul className="text-xs space-y-2">
                            {Array.isArray(mission.discovery.experiments) ? mission.discovery.experiments.map((e: any, i: number) => (
                              <li key={i} className="flex gap-2 text-blue-200/80">
                                <span className="text-blue-500 font-mono">{i+1}.</span>
                                {e}
                              </li>
                            )) : <li className="text-slate-500 text-xs">No experiments</li>}
                          </ul>
                        </div>
                        <div className="space-y-2 bg-slate-800/30 p-3 rounded-lg border border-slate-700/50 text-xs">
                          <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Discovery Ideas</h5>
                          <div className="max-h-48 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                            {Array.isArray(mission.discovery.ideas) ? mission.discovery.ideas.map((idea: any, i: number) => (
                              <div key={i} className="bg-black/40 p-2 rounded text-slate-300">
                                <span className="text-slate-500 text-[10px] mr-1 block mb-0.5">Idea {i+1}</span>
                                {idea}
                              </div>
                            )) : <span>No ideas</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

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
                    
                    {mission?.improvement_log ? (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-slate-400 flex items-center gap-1.5">
                          <BrainCircuit className="w-4 h-4 text-emerald-500" />
                          Improvement Log
                        </h4>
                        <div className="text-sm space-y-2">
                          <p className="text-xs text-emerald-300/80 bg-emerald-900/10 p-2 rounded border border-emerald-900/30">
                            <span className="text-emerald-500 block mb-1">What Worked:</span>
                            {mission.improvement_log.what_worked}
                          </p>
                          <p className="text-xs text-red-300/80 bg-red-900/10 p-2 rounded border border-red-900/30">
                            <span className="text-red-500 block mb-1">What Failed:</span>
                            {mission.improvement_log.what_failed}
                          </p>
                          <div className="flex gap-2">
                            <p className="flex-1 text-xs text-blue-300 bg-blue-900/10 p-2 rounded border border-blue-900/30">
                              <span className="text-blue-400 block mb-1">Next Improvement:</span>
                              {mission.improvement_log.next_improvement}
                            </p>
                            <div className="w-24 shrink-0 text-center text-xs text-amber-300 bg-amber-900/10 p-2 rounded border border-amber-900/30 flex flex-col items-center justify-center">
                              <span className="text-amber-500 block mb-1">Confidence</span>
                              <span className="text-lg font-bold">{mission.improvement_log.confidence_score}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : ((mission?.lessons_learned || mission?.reflection?.lessons_learned) && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-slate-400 flex items-center gap-1.5">
                          <BrainCircuit className="w-4 h-4 text-emerald-500" />
                          Lessons Learned
                        </h4>
                        <div className="text-sm space-y-2">
                          <p className="text-xs text-slate-300 bg-black/40 p-2 rounded border border-slate-800">
                            <span className="text-slate-500 block mb-1">Key Insight:</span>
                            {typeof (mission.lessons_learned || mission?.reflection?.lessons_learned) === 'string' ? (mission.lessons_learned || mission?.reflection?.lessons_learned) : JSON.stringify(mission.lessons_learned || mission?.reflection?.lessons_learned)}
                          </p>
                          <p className="text-xs text-slate-300 bg-black/40 p-2 rounded border border-slate-800">
                            <span className="text-blue-400/80 block mb-1">Next Improvement Suggestion:</span>
                            {typeof (mission.next_improvement || mission?.reflection?.improvement_suggestion) === 'string' ? (mission.next_improvement || mission?.reflection?.improvement_suggestion) : JSON.stringify(mission.next_improvement || mission?.reflection?.improvement_suggestion)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Agents Debate Log */}
                  <div className="space-y-2 pt-4 border-t border-slate-800/50">
                    <h4 className="text-sm font-medium text-slate-400 flex items-center gap-1.5">
                      <BrainCircuit className="w-4 h-4 text-blue-500" />
                      Assigned Agents (Debate on Best Solution)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {Array.isArray(mission?.debate_log || mission?.agents) && (mission.debate_log || mission.agents).length > 0 ? (mission.debate_log || mission.agents).map((a: any, i: number) => (
                        <div key={i} className="bg-blue-900/10 border border-blue-900/50 p-2 rounded-lg">
                          <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-900/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-900/50 inline-block mb-1.5">
                            {typeof a === 'string' ? a : a?.agent || a?.agent_type || a?.role || a?.name || "Agent"}
                          </span>
                          {(a?.argument || a?.output) && (
                            <p className="text-slate-300 text-xs bg-black/40 p-2 rounded line-clamp-3" title={typeof (a.argument || a.output) === 'string' ? (a.argument || a.output) : JSON.stringify(a.argument || a.output)}>
                              {typeof (a.argument || a.output) === 'string' ? (a.argument || a.output) : JSON.stringify(a.argument || a.output)}
                            </p>
                          )}
                        </div>
                      )) : <span className="text-slate-500 text-xs">No agents assigned or debate log missing.</span>}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </section>
        </>
        )}
      </div>
    </div>
  );
}
