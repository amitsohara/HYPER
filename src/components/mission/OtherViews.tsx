import React from "react";
import { Database, Download, Award, GitBranch, Settings, Activity } from "lucide-react";

export function PluginManagerView() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
      <Database size={48} className="opacity-20" />
      <h2 className="text-xl font-bold text-slate-300">Plugin Manager</h2>
      <p>Manage external integrations, memory modules, and specialized expert systems.</p>
    </div>
  );
}

export function ReportsView() {
  const [isExporting, setIsExporting] = React.useState(false);
  const [exported, setExported] = React.useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExported(true);
      setTimeout(() => setExported(false), 3000);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
      <Download size={48} className="opacity-20" />
      <h2 className="text-xl font-bold text-slate-300">Generate Reports</h2>
      <p>Export executive summaries, performance metrics, and compliance certificates as PDF.</p>
      
      {exported && <div className="text-emerald-400 text-sm mt-2">✅ Report PV-01_export.pdf generated successfully.</div>}
      <button onClick={handleExport} disabled={isExporting} className={`px-4 py-2 mt-4 ${isExporting ? 'bg-indigo-800' : 'bg-indigo-600 hover:bg-indigo-500'} text-white text-sm font-medium rounded shadow flex items-center gap-2 transition-colors`}>
        <Download size={14} className={isExporting ? "animate-bounce" : ""} /> 
        {isExporting ? "Generating PDF..." : "Export PV-01 Report"}
      </button>
    </div>
  );
}

export function LeaderboardView() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
      <Award size={48} className="opacity-20 text-amber-500" />
      <h2 className="text-xl font-bold text-slate-300">HyperMind Leaderboard</h2>
      <p>Compare HII scores across different iterations of the Cognitive Architecture.</p>
    </div>
  );
}

export function BenchmarkView() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
      <Activity size={48} className="opacity-20" />
      <h2 className="text-xl font-bold text-slate-300">Grand Challenge Benchmarks</h2>
      <p>Run standardized mission scenarios (Traffic, Medicine, Robotics) to evaluate intelligence.</p>
    </div>
  );
}

export function RegressionView() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
      <GitBranch size={48} className="opacity-20" />
      <h2 className="text-xl font-bold text-slate-300">Regression Testing</h2>
      <p>Ensure new versions of the cognitive core do not degrade performance on historical missions.</p>
    </div>
  );
}

export function SettingsView() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
      <Settings size={48} className="opacity-20" />
      <h2 className="text-xl font-bold text-slate-300">Platform Settings</h2>
      <p>Configure HOS parameters, HCNS event limits, and UI preferences.</p>
    </div>
  );
}
