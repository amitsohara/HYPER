import React, { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Clock, Award, Target, Activity, FileText, AlertCircle, ArrowRight, Zap, Download } from "lucide-react";

export function MissionResultsView() {
  const [results, setResults] = useState<any[]>([]);
  const [selectedResult, setSelectedResult] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/hmrc/results")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setResults(data);
          if (data.length > 0) setSelectedResult(data[0]);
        }
      })
      .catch(console.error);
  }, []);

  if (!selectedResult) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-zinc-500">
        <div className="text-center space-y-4">
          <FileText className="w-12 h-12 mx-auto text-zinc-700" />
          <p>No completed missions found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Sidebar: Mission History */}
      <aside className="w-80 border-r border-zinc-800 bg-zinc-900/50 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-zinc-800">
          <h2 className="font-medium text-zinc-100 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Mission History</span>
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {results.map((res: any) => (
            <div 
              key={res.missionId} 
              onClick={() => setSelectedResult(res)}
              className={`p-3 rounded-xl border cursor-pointer transition-colors ${selectedResult.missionId === res.missionId ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-900/30 border-zinc-800/50 hover:bg-zinc-800/50'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-zinc-500">{res.missionId.substring(0, 8)}</span>
                {res.status === 'SUCCESS' ? 
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : 
                  <XCircle className="w-4 h-4 text-red-400" />
                }
              </div>
              <div className="text-sm font-medium text-zinc-200 line-clamp-2">{res.directive}</div>
              <div className="mt-2 text-xs text-zinc-500 flex justify-between">
                <span>Score: {res.score}%</span>
                <span>{new Date(res.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content: Mission Result Details */}
      <main className="flex-1 overflow-y-auto bg-zinc-950 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Executive Summary Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-zinc-800">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-light text-zinc-100 mb-2">{selectedResult.directive}</h1>
                  <div className="flex items-center space-x-4 text-sm text-zinc-400">
                    <span className="font-mono">ID: {selectedResult.missionId}</span>
                    <span>•</span>
                    <span>{(selectedResult.durationMs / 1000).toFixed(1)} sec</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                    <button className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm flex items-center space-x-2 transition-colors">
                        <Download className="w-4 h-4" />
                        <span>PDF Export</span>
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm flex items-center space-x-2 transition-colors">
                        <Download className="w-4 h-4" />
                        <span>JSON</span>
                    </button>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800/50">
                  <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Status</div>
                  <div className={`text-lg font-medium ${selectedResult.status === 'SUCCESS' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {selectedResult.status}
                  </div>
                </div>
                <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800/50">
                  <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Confidence</div>
                  <div className="text-lg font-medium text-indigo-400">{(selectedResult.confidence * 100).toFixed(0)}%</div>
                </div>
                <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800/50">
                  <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Score</div>
                  <div className="text-lg font-medium text-amber-400">{selectedResult.score}%</div>
                </div>
                <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800/50">
                  <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Duration</div>
                  <div className="text-lg font-medium text-zinc-300">{Math.round(selectedResult.durationMs / 60000)}m {Math.round((selectedResult.durationMs % 60000) / 1000)}s</div>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-zinc-900/50 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-2">Objective</h3>
                <p className="text-zinc-200">{selectedResult.objective}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-2">Outcome</h3>
                <p className="text-zinc-200">{selectedResult.outcome}</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-2">Root Causes</h3>
                  <ul className="list-disc list-inside space-y-1 text-zinc-300">
                    {selectedResult.rootCauses?.map((cause: string, i: number) => <li key={i}>{cause}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-2">Unexpected Findings</h3>
                  <ul className="list-disc list-inside space-y-1 text-zinc-300">
                    {selectedResult.unexpectedFindings?.map((finding: string, i: number) => <li key={i}>{finding}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Actions */}
          <div>
            <h2 className="text-xl font-light text-zinc-100 mb-4 flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Recommended Actions</span>
            </h2>
            <div className="space-y-4">
              {selectedResult.recommendations?.map((rec: any) => (
                <div key={rec.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold shrink-0">
                    {rec.priority}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-zinc-200 mb-2">{rec.description}</h3>
                    <div className="flex space-x-6 text-sm">
                      <div className="flex flex-col">
                        <span className="text-zinc-500">Expected Impact</span>
                        <span className="text-emerald-400 font-medium">{rec.expectedImprovement}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-zinc-500">Est. Cost</span>
                        <span className="text-zinc-300">{rec.estimatedCost}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-zinc-500">Difficulty</span>
                        <span className="text-zinc-300">{rec.implementationDifficulty}</span>
                      </div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium transition-colors">
                    Execute
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cognitive Reasoning Summary */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-light text-zinc-100 flex items-center space-x-2">
                <Target className="w-5 h-5 text-indigo-400" />
                <span>Cognitive Reasoning</span>
              </h2>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <p className="text-zinc-300 leading-relaxed">
                  {selectedResult.cognitiveReasoningSummary}
                </p>
              </div>
              
              <h2 className="text-xl font-light text-zinc-100 flex items-center space-x-2 pt-4">
                <Activity className="w-5 h-5 text-emerald-400" />
                <span>Simulation Comparison</span>
              </h2>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
                {selectedResult.simulationComparison?.map((sim: any, i: number) => (
                  <div key={i} className={`flex justify-between items-center p-3 rounded-lg border ${sim.selected ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-zinc-950 border-zinc-800/50'}`}>
                    <span className={`font-medium ${sim.selected ? 'text-indigo-400' : 'text-zinc-300'}`}>
                      {sim.name} {sim.selected && '⭐'}
                    </span>
                    <span className="text-zinc-400 font-mono text-sm">{sim.metrics}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-light text-zinc-100 flex items-center space-x-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <span>Confidence Breakdown</span>
              </h2>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
                {Object.entries(selectedResult.confidenceBreakdown || {}).map(([key, val]: [string, any]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className={key === 'overall' ? 'text-indigo-400 font-bold' : 'text-zinc-300'}>
                        {(val * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-zinc-950 rounded-full h-1.5 border border-zinc-800">
                      <div className={`h-1.5 rounded-full ${key === 'overall' ? 'bg-indigo-500' : 'bg-emerald-500'}`} style={{ width: `${val * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
