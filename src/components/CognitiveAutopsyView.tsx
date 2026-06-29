import React, { useState } from "react";
import { 
  Target, 
  Brain, 
  Map, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ChevronRight,
  ChevronDown,
  Clock,
  ShieldAlert,
  GitCommit
} from "lucide-react";

export interface ExecutionStep {
  step: string;
  status: "COMPLETED" | "FAILED" | "SKIPPED";
  error?: string;
}

export interface AutopsyData {
  mission_id: string;
  mission_name: string;
  status: "SUCCESS" | "FAILURE" | "PARTIAL";
  timestamp: number;
  goals: {
    primary: string;
    secondary: string[];
    alignment: number;
  };
  reasoning: {
    assumptions: string[];
    logic_chain: string[];
    flaws_identified?: string[];
  };
  planning: {
    selected_strategy: string;
    alternatives_considered: string[];
    execution_steps: ExecutionStep[];
  };
  outcome: {
    actual_result: string;
    metrics: Record<string, number>;
    unintended_consequences?: string[];
  };
  root_cause?: {
    primary_cause: string;
    contributing_factors: string[];
    recommended_system_update?: string;
  };
}

export function CognitiveAutopsyView({ autopsy }: { autopsy?: AutopsyData }) {
  const [expandedSection, setExpandedSection] = useState<string | null>("root_cause");

  if (!autopsy) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400 bg-[#0f1115] border border-slate-800 rounded-xl">
        <Activity className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-lg">No cognitive autopsy data available.</p>
        <p className="text-sm">Select a mission to view its cognitive lifecycle analysis.</p>
      </div>
    );
  }

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === "SUCCESS" || status === "COMPLETED") return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    if (status === "FAILURE" || status === "FAILED") return <XCircle className="w-5 h-5 text-red-500" />;
    return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-2 h-full ${
          autopsy.status === "SUCCESS" ? "bg-green-500" : autopsy.status === "FAILURE" ? "bg-red-500" : "bg-yellow-500"
        }`}></div>
        
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <ShieldAlert className="w-6 h-6 text-slate-300" />
              <h2 className="text-2xl font-bold text-white">Cognitive Autopsy Report</h2>
            </div>
            <p className="text-slate-400 text-lg">{autopsy.mission_name}</p>
            <div className="flex items-center space-x-4 mt-3 text-sm text-slate-500">
              <span className="flex items-center space-x-1">
                <span className="font-mono">{autopsy.mission_id}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{new Date(autopsy.timestamp).toLocaleString()}</span>
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-slate-400 text-sm mb-1">Mission Outcome</span>
            <div className="flex items-center space-x-2">
              {getStatusIcon(autopsy.status)}
              <span className={`text-xl font-bold ${
                autopsy.status === "SUCCESS" ? "text-green-500" : autopsy.status === "FAILURE" ? "text-red-500" : "text-yellow-500"
              }`}>
                {autopsy.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Root Cause Analysis (Highlight if failure) */}
      {autopsy.root_cause && (
        <div className={`border rounded-xl shadow-sm overflow-hidden ${autopsy.status === "FAILURE" ? "border-red-900/50 bg-red-900/10" : "border-slate-800 bg-[#111]"}`}>
          <button 
            onClick={() => toggleSection("root_cause")}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <AlertTriangle className={`w-5 h-5 ${autopsy.status === "FAILURE" ? "text-red-400" : "text-slate-400"}`} />
              <h3 className="font-semibold text-lg text-white">Root Cause Analysis</h3>
            </div>
            {expandedSection === "root_cause" ? <ChevronDown className="w-5 h-5 text-slate-500" /> : <ChevronRight className="w-5 h-5 text-slate-500" />}
          </button>
          
          {expandedSection === "root_cause" && (
            <div className="p-5 pt-0 border-t border-slate-800/50 mt-2">
              <div className="space-y-4 pt-3">
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-1">Primary Cause</h4>
                  <p className="text-white text-lg bg-slate-900 p-3 rounded-lg border border-slate-800">
                    {autopsy.root_cause.primary_cause}
                  </p>
                </div>
                
                {autopsy.root_cause.contributing_factors.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-2">Contributing Factors</h4>
                    <ul className="space-y-2">
                      {autopsy.root_cause.contributing_factors.map((factor, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-slate-300 bg-slate-900/50 p-2 rounded border border-slate-800/50">
                          <span className="text-slate-600 mt-0.5">•</span>
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {autopsy.root_cause.recommended_system_update && (
                  <div className="mt-4 p-4 bg-blue-900/20 border border-blue-900/50 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-400 mb-1">Recommended Architecture Update</h4>
                    <p className="text-slate-300">{autopsy.root_cause.recommended_system_update}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lifecycle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. Goals */}
        <div className="bg-[#111] border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center space-x-2 mb-4 text-slate-300 pb-3 border-b border-slate-800">
            <Target className="w-5 h-5 text-purple-400" />
            <h3 className="font-semibold text-lg">1. Mission Goals</h3>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Primary Objective</h4>
              <p className="text-white bg-slate-900 p-3 rounded border border-slate-800">{autopsy.goals.primary}</p>
            </div>
            
            {autopsy.goals.secondary.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Secondary Objectives</h4>
                <ul className="list-disc pl-5 text-slate-400 text-sm space-y-1">
                  {autopsy.goals.secondary.map((goal, i) => <li key={i}>{goal}</li>)}
                </ul>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Alignment Score</span>
              <span className="text-blue-400 font-mono font-medium">{autopsy.goals.alignment}%</span>
            </div>
          </div>
        </div>

        {/* 2. Reasoning */}
        <div className="bg-[#111] border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center space-x-2 mb-4 text-slate-300 pb-3 border-b border-slate-800">
            <Brain className="w-5 h-5 text-pink-400" />
            <h3 className="font-semibold text-lg">2. Cognitive Reasoning</h3>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Initial Assumptions</h4>
              <div className="flex flex-wrap gap-2">
                {autopsy.reasoning.assumptions.map((assump, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded border border-slate-700">
                    {assump}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Logic Chain</h4>
              <div className="space-y-2">
                {autopsy.reasoning.logic_chain.map((logic, i) => (
                  <div key={i} className="flex items-start space-x-2 text-sm text-slate-400">
                    <span className="text-slate-600 mt-0.5">{i+1}.</span>
                    <span>{logic}</span>
                  </div>
                ))}
              </div>
            </div>

            {autopsy.reasoning.flaws_identified && autopsy.reasoning.flaws_identified.length > 0 && (
              <div className="pt-2 border-t border-slate-800/50">
                <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">Reasoning Flaws Identified</h4>
                <ul className="list-disc pl-5 text-slate-300 text-sm space-y-1">
                  {autopsy.reasoning.flaws_identified.map((flaw, i) => <li key={i}>{flaw}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* 3. Planning & Execution */}
        <div className="bg-[#111] border border-slate-800 rounded-xl p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center space-x-2 mb-4 text-slate-300 pb-3 border-b border-slate-800">
            <Map className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-lg">3. Planning & Execution</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Strategy</h4>
              <div className="bg-slate-900 p-3 rounded border border-slate-800 mb-4">
                <span className="block text-xs text-slate-500 mb-1">Selected Strategy</span>
                <span className="text-white text-sm">{autopsy.planning.selected_strategy}</span>
              </div>
              
              {autopsy.planning.alternatives_considered.length > 0 && (
                <div>
                  <span className="block text-xs text-slate-500 mb-2">Alternatives Discarded</span>
                  <div className="flex flex-wrap gap-2">
                    {autopsy.planning.alternatives_considered.map((alt, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-900/50 text-slate-400 text-xs rounded border border-slate-800/50 line-through">
                        {alt}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Execution Trace</h4>
              <div className="space-y-3 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
                {autopsy.planning.execution_steps.map((step, i) => (
                  <div key={i} className="relative flex items-start justify-between space-x-4">
                    <div className="flex items-center space-x-3 w-full">
                      <div className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 border border-slate-800 shadow-sm shrink-0">
                        {step.status === "COMPLETED" ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : 
                         step.status === "FAILED" ? <XCircle className="w-4 h-4 text-red-500" /> : 
                         <Activity className="w-4 h-4 text-slate-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${step.status === "FAILED" ? "text-red-400 font-medium" : "text-slate-300"}`}>
                          {step.step}
                        </p>
                        {step.error && (
                          <p className="text-xs text-red-400/80 mt-1 mt-0.5 break-words">Error: {step.error}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Outcome */}
        <div className="bg-[#111] border border-slate-800 rounded-xl p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center space-x-2 mb-4 text-slate-300 pb-3 border-b border-slate-800">
            <Activity className="w-5 h-5 text-teal-400" />
            <h3 className="font-semibold text-lg">4. Final Outcome & Metrics</h3>
          </div>
          
          <div className="space-y-5">
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Actual Result</h4>
              <p className="text-white text-sm bg-slate-900 p-3 rounded border border-slate-800 leading-relaxed">
                {autopsy.outcome.actual_result}
              </p>
            </div>
            
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Performance Metrics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(autopsy.outcome.metrics).map(([key, value], i) => (
                  <div key={i} className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-center">
                    <span className="block text-2xl font-mono text-white mb-1">{value}</span>
                    <span className="block text-xs text-slate-500 uppercase">{key.replace(/_/g, ' ')}</span>
                  </div>
                ))}
              </div>
            </div>

            {autopsy.outcome.unintended_consequences && autopsy.outcome.unintended_consequences.length > 0 && (
              <div className="pt-3">
                <h4 className="text-xs font-semibold text-yellow-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Unintended Consequences
                </h4>
                <ul className="list-disc pl-5 text-slate-300 text-sm space-y-1">
                  {autopsy.outcome.unintended_consequences.map((consequence, i) => <li key={i}>{consequence}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
