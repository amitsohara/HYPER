import React, { useState, useEffect } from "react";
import {
  Brain,
  Trophy,
  ShieldAlert,
  LineChart,
  Cpu,
  Network,
  Sparkles,
  Beaker,
  Play,
  GitBranch,
  Shield,
  Zap,
  Search,
  Cog,
  Target,
  Layers,
} from "lucide-react";

export function IntelligenceDashboard() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch("/benchmark/history");
      const data = await res.json();
      setHistory(data.reverse()); // latest first
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const runBenchmark = async () => {
    setRunning(true);
    try {
      await fetch("/benchmark/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: "v" + (history.length + 1) + ".0.0" }),
      });
      await fetchHistory();
    } catch (e) {
      console.error(e);
    }
    setRunning(false);
  };

  const latest = history[0];
  const previous = history[1];

  const categories = [
    { key: "reasoning", label: "Reasoning", icon: Brain },
    { key: "planning", label: "Planning", icon: Target },
    { key: "learning", label: "Learning", icon: GitBranch },
    { key: "memory", label: "Memory", icon: DatabaseIcon },
    { key: "research", label: "Research", icon: Beaker },
    { key: "simulation", label: "Simulation", icon: GlobeIcon },
    { key: "creativity", label: "Creativity", icon: Sparkles },
    { key: "causal", label: "Causal Reasoning", icon: GitBranch },
    { key: "meta_cognition", label: "Meta Cognition", icon: Brain },
    { key: "tool_use", label: "Tool Use", icon: Cog },
    { key: "theory_of_mind", label: "Theory of Mind", icon: UsersIcon },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-[#111] border border-slate-800 p-6 rounded-2xl">
        <div className="space-y-1">
          <h2 className="text-xl font-medium text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            HyperMind-X Benchmark Suite (HXBS)
          </h2>
          <p className="text-sm text-slate-400">
            Automated intelligence evaluation & capability regression detection
            across 100+ simulated test environments. Database: SQLite
            (PostgreSQL schema mock)
          </p>
        </div>
        <button
          onClick={runBenchmark}
          disabled={running}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center gap-2 font-medium transition-colors disabled:opacity-50"
        >
          {running ? (
            <Cpu className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          {running ? "Running Suite..." : "Run Benchmark"}
        </button>
      </div>

      {!latest ? (
        <div className="text-slate-500 py-12 text-center">
          No benchmarks run yet. Execute the suite to measure intelligence
          capabilities.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Overall Capability */}
          <div className="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="text-sm text-slate-500 uppercase tracking-widest font-bold mb-2">
                Overall Capability Index
              </div>
              <div className="text-5xl font-mono text-white mb-2">
                {latest.overall}
              </div>
              {previous && (
                <div
                  className={`text-xs font-bold ${latest.overall >= previous.overall ? "text-emerald-400" : "text-red-400"}`}
                >
                  {latest.overall >= previous.overall ? "▲" : "▼"}{" "}
                  {Math.abs(latest.overall - previous.overall)} pts
                </div>
              )}
            </div>

            <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="text-sm text-slate-500 uppercase tracking-widest font-bold mb-2">
                Total Missions
              </div>
              <div className="text-4xl font-mono text-indigo-400">100</div>
            </div>

            <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="text-sm text-slate-500 uppercase tracking-widest font-bold mb-2">
                Version
              </div>
              <div className="text-2xl font-mono text-fuchsia-400">
                {latest.version}
              </div>
            </div>

            <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="text-sm text-slate-500 uppercase tracking-widest font-bold mb-2">
                Status
              </div>
              {previous && latest.overall < previous.overall ? (
                <div className="flex items-center gap-2 text-red-500">
                  <ShieldAlert className="w-5 h-5" /> Regression Detected
                </div>
              ) : (
                <div className="flex items-center gap-2 text-emerald-500">
                  <Shield className="w-5 h-5" /> All Systems Nominal
                </div>
              )}
            </div>
          </div>

          {/* Radar / Capability Breakdown */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-6">
                <Target className="w-4 h-4 text-blue-400" /> Capability Scores
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {categories.map((cat, i) => {
                  const score = latest.metrics[cat.key] || 0;
                  const prevScore = previous?.metrics[cat.key] || 0;
                  const diff = score - prevScore;
                  return (
                    <div
                      key={i}
                      className="bg-black/30 border border-slate-800 p-4 rounded-xl flex flex-col items-center text-center"
                    >
                      <cat.icon className="w-5 h-5 text-slate-500 mb-2" />
                      <div className="text-xs text-slate-400 uppercase font-bold mb-1">
                        {cat.label}
                      </div>
                      <div className="text-xl font-mono text-white mb-1">
                        {score}
                      </div>
                      {previous && (
                        <div
                          className={`text-[10px] font-bold ${diff >= 0 ? "text-emerald-400" : "text-red-400"}`}
                        >
                          {diff >= 0 ? "+" : ""}
                          {diff}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Leaderboard & History */}
          <div className="space-y-6">
            <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl h-full">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
                <LineChart className="w-4 h-4 text-emerald-400" /> Version
                Leaderboard
              </h3>

              <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                {history.slice(0, 10).map((h, i) => (
                  <div
                    key={i}
                    className={`flex justify-between items-center p-3 rounded-xl border ${i === 0 ? "bg-indigo-900/20 border-indigo-500/50" : "bg-black/30 border-slate-800"}`}
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-200">
                        {h.version}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(
                          h.timestamp || Date.now(),
                        ).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="font-mono text-lg font-bold text-white">
                      {h.overall}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const DatabaseIcon = ({ className }: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5V19A9 3 0 0 0 21 19V5" />
    <path d="M3 12A9 3 0 0 0 21 12" />
  </svg>
);
const GlobeIcon = ({ className }: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
);
const UsersIcon = ({ className }: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
