import React, { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronRight, Activity, ShieldAlert, FileText, Map, PieChart, Users, Zap, Briefcase } from "lucide-react";

export function MissionReportDashboard({ mission }: { mission: any }) {
  const [showDeveloper, setShowDeveloper] = useState(false);

  if (!mission) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400">
        <Activity className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-lg">No mission executed yet.</p>
        <p className="text-sm">Enter a mission above to begin.</p>
      </div>
    );
  }

  // The compiled report properties
  const report = mission.compiled_user || mission;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-8 h-8 text-blue-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Mission Completed</h2>
              <p className="text-slate-400">Mission: {report.mission}</p>
              {(report.mission_type || report.mission_stage) && (
                <div className="flex items-center space-x-2 mt-2">
                  {report.mission_type && (
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-md text-xs font-medium uppercase tracking-wider">
                      {report.mission_type}
                    </span>
                  )}
                  {report.mission_stage && (
                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-md text-xs font-medium uppercase tracking-wider">
                      {report.mission_stage}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex flex-col items-end">
              <span className="text-slate-400">Confidence</span>
              <span className="text-2xl font-bold text-green-400">{report.confidence_score}%</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-slate-400">Success Prob.</span>
              <span className="text-2xl font-bold text-blue-400">{report.estimated_success_probability}%</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-slate-400">Risk Level</span>
              <span className={`text-2xl font-bold ${report.overall_risk_level === 'High' ? 'text-red-400' : report.overall_risk_level === 'Medium' ? 'text-yellow-400' : 'text-green-400'}`}>{report.overall_risk_level}</span>
            </div>
          </div>
        </div>

        {report.tokens_used !== undefined && (
          <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-4 gap-4 text-sm">
            <div>
              <span className="block text-slate-500">Tokens Used</span>
              <span className="text-white font-mono">{report.tokens_used.toLocaleString()}</span>
            </div>
            <div>
              <span className="block text-slate-500">Tokens Saved (Cache)</span>
              <span className="text-green-400 font-mono">{report.token_savings.toLocaleString()}</span>
            </div>
            <div>
              <span className="block text-slate-500">Est. Cost</span>
              <span className="text-yellow-400 font-mono">{report.estimated_cost}</span>
            </div>
            <div>
              <span className="block text-slate-500">Modules Skipped</span>
              <span className="text-slate-300">{report.modules_skipped?.length || 0}</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {report.recommended_strategy && <Section title="Recommended Strategy" icon={<Activity className="w-5 h-5" />} content={report.recommended_strategy} />}
          {report.why_this_strategy && <Section title="Why this strategy?" icon={<FileText className="w-5 h-5" />} content={report.why_this_strategy} />}
          <Section title="Executive Summary" icon={<FileText className="w-5 h-5" />} content={report.executive_summary} />
          <Section title="Roadmap" icon={<Map className="w-5 h-5" />} content={report.roadmap} />
          <Section title="Weekly Execution Plan" icon={<Zap className="w-5 h-5" />} content={report.weekly_action_plan} />
          <Section title="Research Findings" icon={<Activity className="w-5 h-5" />} content={report.research_findings} />
        </div>
        <div className="space-y-6">
          {report.top_alternatives && report.top_alternatives.length > 0 && <Section title="Top Alternatives" icon={<PieChart className="w-5 h-5" />} list={report.top_alternatives} />}
          <Section title="Recommended Next Actions" icon={<ChevronRight className="w-5 h-5" />} list={report.recommended_next_actions} />
          <Section title="Key Decisions" icon={<Briefcase className="w-5 h-5" />} content={report.key_decisions} />
          <Section title="Risk Analysis" icon={<ShieldAlert className="w-5 h-5" />} content={report.risks_and_mitigations} />
          <Section title="Budget" icon={<PieChart className="w-5 h-5" />} content={report.budget_and_resources} />
          <Section title="Timeline" icon={<Activity className="w-5 h-5" />} content={report.estimated_timeline} />
          <Section title="Investor Strategy" icon={<Users className="w-5 h-5" />} content={report.investor_or_stakeholder_strategy} />
          <Section title="Next Recommended Mission" icon={<ChevronRight className="w-5 h-5" />} content={report.next_recommended_mission} />
        </div>
      </div>

      <div className="pt-8 border-t border-slate-800">
        <button
          onClick={() => setShowDeveloper(!showDeveloper)}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
        >
          {showDeveloper ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          <span>{showDeveloper ? "Hide Technical Details" : "Show Technical Details"}</span>
        </button>
        
        {showDeveloper && (
          <div className="mt-4 p-4 bg-slate-900 border border-slate-800 rounded-lg overflow-auto max-h-[600px]">
            <p className="text-slate-400 mb-2">Use the tabs above to explore all internal developer modules.</p>
            <pre className="text-xs text-slate-500 whitespace-pre-wrap">
              {JSON.stringify(mission.compiled_dev || mission.raw || mission, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, icon, content, list }: { title: string, icon: React.ReactNode, content?: string, list?: string[] }) {
  if (!content && (!list || list.length === 0)) return null;
  return (
    <div className="bg-[#111] border border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex items-center space-x-2 mb-3 text-slate-300">
        {icon}
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      {content && (
        <div className="text-slate-400 text-sm whitespace-pre-wrap leading-relaxed">
          {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
        </div>
      )}
      {list && list.length > 0 && (
        <ul className="list-disc pl-5 space-y-2 text-slate-400 text-sm">
          {list.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
