import React, { useState, useEffect } from "react";
import { Globe, GitMerge, Users, TrendingUp, Compass, Activity, Play, LineChart, Network, Plus } from "lucide-react";
import { safeFetchJSON } from "../fetchUtils";
import { FutureTrendsChart } from "./FutureTrendsChart";

export function WorldModelDashboard() {
  const [domain, setDomain] = useState("economy");
  const [startYear, setStartYear] = useState(2025);
  const [endYear, setEndYear] = useState(2050);
  const [context, setContext] = useState("AGI emergence");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [causalGraph, setCausalGraph] = useState<any[]>([]);
  const [evolutionSummary, setEvolutionSummary] = useState<string>("");
  const [newAction, setNewAction] = useState("");
  const [newOutcome, setNewOutcome] = useState("");
  const [learningCausal, setLearningCausal] = useState(false);

  useEffect(() => {
    fetchCausalGraph();
  }, []);

  const fetchCausalGraph = async () => {
    try {
      const data = await safeFetchJSON("/causal_model/graph", {}, { causal_graph: [] });
      setCausalGraph(data.causal_graph || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLearnCausal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAction || !newOutcome) return;
    setLearningCausal(true);
    try {
      const res = await fetch("/causal_model/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: newAction, outcome: newOutcome, context })
      });
      const data = await res.json();
      setNewAction("");
      setNewOutcome("");
      if (data.evolution_summary) setEvolutionSummary(data.evolution_summary);
      await fetchCausalGraph();
    } catch(e) {
      console.error(e);
    }
    setLearningCausal(false);
  };

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/simulate/future", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, startYear, endYear, context })
      });
      const data = await res.json();
      setResult(data);
    } catch(e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-medium text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" />
            World Model Engine
          </h2>
          <p className="text-sm text-slate-400">
            Simulate future worlds, predict outcomes, and optimize strategies using a learned causal model.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Simulation Config */}
        <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Play className="w-4 h-4 text-emerald-400" /> Run Simulation
            </h3>
          <form onSubmit={handleSimulate} className="flex flex-col gap-4">
            <div className="flex gap-4">
                <select value={domain} onChange={(e) => setDomain(e.target.value)} className="bg-black border border-slate-800 rounded-lg px-4 py-2 text-slate-300 flex-1">
                  <option value="economy">Economy</option>
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="environment">Environment</option>
                  <option value="politics">Politics</option>
                </select>
                <input type="number" value={startYear} onChange={(e) => setStartYear(parseInt(e.target.value))} className="bg-black border border-slate-800 rounded-lg px-4 py-2 text-slate-300 w-24" />
                <input type="number" value={endYear} onChange={(e) => setEndYear(parseInt(e.target.value))} className="bg-black border border-slate-800 rounded-lg px-4 py-2 text-slate-300 w-24" />
            </div>
            <input type="text" value={context} onChange={(e) => setContext(e.target.value)} placeholder="Context..." className="bg-black border border-slate-800 rounded-lg px-4 py-2 text-white w-full" />
            <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center justify-center gap-2">
              {loading ? <Activity className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />} Simulate Future
            </button>
          </form>
        </div>

        {/* Causal Graph Learner */}
        <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Network className="w-4 h-4 text-purple-400" /> Learn Causal Rules
            </h3>
            <form onSubmit={handleLearnCausal} className="flex flex-col gap-3">
              <input type="text" value={newAction} onChange={(e) => setNewAction(e.target.value)} placeholder="Action or Event..." className="bg-black border border-slate-800 rounded-lg px-4 py-2 text-white text-sm" />
              <input type="text" value={newOutcome} onChange={(e) => setNewOutcome(e.target.value)} placeholder="Observed Outcome..." className="bg-black border border-slate-800 rounded-lg px-4 py-2 text-white text-sm" />
              <button type="submit" disabled={learningCausal} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-lg font-medium flex items-center justify-center gap-2 text-sm border border-slate-700">
                {learningCausal ? <Activity className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Extract Causal Rules
              </button>
            </form>
        </div>
      </div>

      {causalGraph.length > 0 && (
         <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Network className="w-4 h-4 text-purple-400" /> Learned Causal Graph ({causalGraph.length} Rules)
            </h3>
            
            {evolutionSummary && (
                <div className="bg-emerald-900/10 border border-emerald-900/30 p-4 rounded-xl text-emerald-300 text-sm italic">
                    <span className="font-bold uppercase tracking-widest text-emerald-400 text-[10px] block mb-1">Latest Evolution</span>
                    {evolutionSummary}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              {causalGraph.map((rule: any, i: number) => (
                <div key={i} className="bg-black/30 border border-slate-800 p-4 rounded-xl flex flex-col gap-2">
                   <div className="flex justify-between items-start">
                     <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400">Cause</span>
                     <span className="text-[10px] font-mono text-emerald-400 bg-emerald-900/20 px-2 py-0.5 rounded">Conf: {rule.confidence}</span>
                   </div>
                   <p className="text-xs text-slate-300">{rule.cause}</p>
                   <div className="flex items-center justify-center my-1 text-slate-600">↓</div>
                   <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400">Effect</span>
                   <p className="text-xs text-slate-300">{rule.effect}</p>
                </div>
              ))}
            </div>
         </div>
      )}

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
                <GitMerge className="w-4 h-4 text-emerald-400" /> Future Timeline
              </h3>
              
              {result.trends && result.trends.length > 0 && (
                <div className="mb-6 border-b border-slate-800 pb-6">
                   <h4 className="text-xs text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><LineChart className="w-3 h-3"/> Projected Domain Trend</h4>
                   <FutureTrendsChart data={result.trends} domain={result.domain} />
                </div>
              )}

              <div className="space-y-4">
                {result.timeline?.map((t: any, i: number) => (
                  <div key={i} className="flex gap-4 items-start">
                    <span className="text-emerald-400 font-mono text-sm">{t.year}</span>
                    <div>
                      <p className="text-slate-300 text-sm">{t.event}</p>
                      <span className="text-xs text-slate-500">Prob: {Math.round(t.probability * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-purple-400" /> Predicted Outcomes
              </h3>
              <div className="space-y-4">
                {result.predicted_outcomes?.map((o: any, i: number) => (
                  <div key={i} className="bg-black/30 p-4 rounded-lg border border-slate-800">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-slate-200 font-medium">{o.scenario}</h4>
                      <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">Prob: {Math.round(o.probability * 100)}%</span>
                    </div>
                    <p className="text-sm text-slate-400">{o.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-yellow-400" /> Population Simulation
              </h3>
              <div className="space-y-4">
                <div className="bg-black/30 p-4 rounded-lg border border-slate-800">
                  <h4 className="text-slate-500 text-xs uppercase mb-1">Economic Shift</h4>
                  <p className="text-slate-300 text-sm">{result.population_impact?.economic_shift}</p>
                </div>
                <div className="bg-black/30 p-4 rounded-lg border border-slate-800">
                  <h4 className="text-slate-500 text-xs uppercase mb-1">Social Shift</h4>
                  <p className="text-slate-300 text-sm">{result.population_impact?.social_shift}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
                <Compass className="w-4 h-4 text-blue-400" /> Recommended Strategies
              </h3>
              {result.applied_causal_rules_count > 0 && (
                <div className="mb-4 text-xs bg-purple-900/20 text-purple-300 p-2 rounded border border-purple-900/50">
                  Applied {result.applied_causal_rules_count} learned causal rules to shape these strategies.
                </div>
              )}
              <ul className="space-y-2">
                {result.recommended_strategies?.map((s: string, i: number) => (
                  <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                    <span className="text-blue-500">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
