import React, { useState, useEffect } from "react";
import { Globe, GitMerge, Users, TrendingUp, Compass, Activity, Play, LineChart } from "lucide-react";
import { safeFetchJSON } from "../fetchUtils";
import { FutureTrendsChart } from "./FutureTrendsChart";

export function WorldModelDashboard() {
  const [domain, setDomain] = useState("economy");
  const [startYear, setStartYear] = useState(2025);
  const [endYear, setEndYear] = useState(2050);
  const [context, setContext] = useState("AGI emergence");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

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
            Simulate future worlds, predict outcomes, and optimize strategies.
          </p>
        </div>
      </div>

      <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
        <form onSubmit={handleSimulate} className="flex flex-col md:flex-row gap-4">
          <select value={domain} onChange={(e) => setDomain(e.target.value)} className="bg-black border border-slate-800 rounded-lg px-4 py-2 text-slate-300 flex-1">
            <option value="economy">Economy</option>
            <option value="technology">Technology</option>
            <option value="healthcare">Healthcare</option>
            <option value="education">Education</option>
            <option value="environment">Environment</option>
            <option value="politics">Politics</option>
          </select>
          <input type="text" value={context} onChange={(e) => setContext(e.target.value)} placeholder="Context..." className="bg-black border border-slate-800 rounded-lg px-4 py-2 text-white flex-2" />
          <input type="number" value={startYear} onChange={(e) => setStartYear(parseInt(e.target.value))} className="bg-black border border-slate-800 rounded-lg px-4 py-2 text-slate-300 w-24" />
          <input type="number" value={endYear} onChange={(e) => setEndYear(parseInt(e.target.value))} className="bg-black border border-slate-800 rounded-lg px-4 py-2 text-slate-300 w-24" />
          <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center justify-center gap-2">
            {loading ? <Activity className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />} Simulate
          </button>
        </form>
      </div>

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
