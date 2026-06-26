import React, { useEffect, useState } from 'react';
import { Brain, Cpu, List, Map, BarChart2, CheckCircle2, HelpCircle, Lightbulb, Settings, ShieldCheck } from 'lucide-react';

export default function MetaCognitionDashboard() {
  const [mission, setMission] = useState<any>({});
  const [capabilities, setCapabilities] = useState<any[]>([]);
  const [executionPlan, setExecutionPlan] = useState<any>({});
  const [moduleScores, setModuleScores] = useState<any[]>([]);
  const [missionGraph, setMissionGraph] = useState<any>({ nodes: [], edges: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [missionRes, capRes, execRes, scoresRes, graphRes] = await Promise.all([
          fetch('/api/meta/mission').then(r => r.json()),
          fetch('/api/meta/capabilities').then(r => r.json()),
          fetch('/api/meta/execution-plan').then(r => r.json()),
          fetch('/api/meta/module-scores').then(r => r.json()),
          fetch('/api/meta/mission-graph').then(r => r.json())
        ]);
        
        setMission(missionRes || {});
        setCapabilities(capRes || []);
        setExecutionPlan(execRes || {});
        setModuleScores(scoresRes || []);
        setMissionGraph(graphRes || { nodes: [], edges: [] });
      } catch (err) {
        console.error("Error fetching MCE data", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <Brain className="w-6 h-6 text-fuchsia-400" />
        <h2 className="text-xl font-bold text-white tracking-tight">Meta-Cognition Engine</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col items-center text-center space-y-2">
          <CheckCircle2 className="w-6 h-6 text-blue-400" />
          <h3 className="text-xs font-bold text-gray-300 uppercase">❶ What do I know?</h3>
          <p className="text-xs text-gray-400 line-clamp-3">
            {mission.knowns && mission.knowns.length > 0 ? mission.knowns.join(', ') : "Awaiting analysis..."}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col items-center text-center space-y-2">
          <HelpCircle className="w-6 h-6 text-orange-400" />
          <h3 className="text-xs font-bold text-gray-300 uppercase">❷ What do I need to know?</h3>
          <p className="text-xs text-gray-400 line-clamp-3">
             {mission.unknowns && mission.unknowns.length > 0 ? mission.unknowns.join(', ') : "Awaiting analysis..."}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col items-center text-center space-y-2">
          <Lightbulb className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xs font-bold text-gray-300 uppercase">❸ How should I think?</h3>
          <p className="text-xs text-gray-400 line-clamp-3">
             {mission.reasoning_strategy || "Awaiting analysis..."}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col items-center text-center space-y-2">
          <Settings className="w-6 h-6 text-fuchsia-400" />
          <h3 className="text-xs font-bold text-gray-300 uppercase">❹ Which capabilities?</h3>
          <p className="text-xs text-gray-400 line-clamp-3">
            {executionPlan.selected_modules ? executionPlan.selected_modules.length + " modules selected" : "Awaiting plan..."}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col items-center text-center space-y-2">
          <ShieldCheck className="w-6 h-6 text-green-400" />
          <h3 className="text-xs font-bold text-gray-300 uppercase">❺ How confident am I?</h3>
          <p className="text-xs text-gray-400 line-clamp-3">
            {mission.confidence_score ? mission.confidence_score + "% - " + mission.confidence_reasoning : "Awaiting analysis..."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4 text-fuchsia-400">
            <Cpu className="w-4 h-4" />
            <h3 className="font-semibold">Mission Understanding</h3>
          </div>
          <div className="space-y-2 text-sm text-gray-300">
            <p><strong className="text-white">Type:</strong> {mission.mission_type}</p>
            <p><strong className="text-white">Intent:</strong> {mission.mission_intent}</p>
            <p><strong className="text-white">Primary Objective:</strong> {mission.primary_objective}</p>
            <p><strong className="text-white">Time Horizon:</strong> {mission.time_horizon}</p>
            <p><strong className="text-white">Difficulty:</strong> {mission.difficulty}/10</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4 text-fuchsia-400">
            <List className="w-4 h-4" />
            <h3 className="font-semibold">Execution Plan</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Execution Order</p>
              <div className="flex flex-wrap gap-2">
                {(executionPlan.execution_order || []).map((mod: string, idx: number) => (
                  <span key={idx} className="px-2 py-1 bg-fuchsia-500/20 text-fuchsia-300 rounded text-xs">
                    {idx + 1}. {mod}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Skipped Modules</p>
              <div className="flex flex-wrap gap-2">
                {(executionPlan.skipped_modules || []).map((m: any, idx: number) => (
                  <span key={idx} className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs line-through">
                    {m.module}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4 text-fuchsia-400">
          <BarChart2 className="w-4 h-4" />
          <h3 className="font-semibold">Module Profiler & Utilities</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead>
              <tr className="border-b border-white/10 text-gray-400">
                <th className="py-2 px-3 font-medium">Module</th>
                <th className="py-2 px-3 font-medium text-right">Utility</th>
                <th className="py-2 px-3 font-medium text-right">Rel/Con</th>
                <th className="py-2 px-3 font-medium">Benefit</th>
              </tr>
            </thead>
            <tbody>
              {moduleScores.map((score, idx) => (
                <tr key={idx} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                  <td className="py-2 px-3 font-medium text-white">{score.module}</td>
                  <td className="py-2 px-3 text-right">
                    <span className="px-2 py-1 rounded bg-white/10">{Math.round(score.utility_score || 0)}</span>
                  </td>
                  <td className="py-2 px-3 text-right text-xs text-gray-500">
                    {score.relevance_score}/{score.contribution_score}
                  </td>
                  <td className="py-2 px-3 text-xs truncate max-w-[200px]" title={score.expected_benefit}>
                    {score.expected_benefit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4 text-fuchsia-400">
          <Brain className="w-4 h-4" />
          <h3 className="font-semibold">Self-Reflection Planner</h3>
        </div>
        <div className="space-y-2 text-sm text-gray-300">
          <p><strong className="text-white">Summary:</strong> {executionPlan.reflection?.reflection_summary}</p>
          <p><strong className="text-white">Efficiency Suggestions:</strong> {executionPlan.reflection?.efficiency_suggestions}</p>
          <p><strong className="text-white">Assumptions:</strong> {(executionPlan.reflection?.assumptions || []).join(', ')}</p>
        </div>
      </div>
    </div>
  );
}
