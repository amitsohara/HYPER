import React, { useState, useEffect } from "react";
import { Search, FlaskConical, Play, Activity, Database, Sparkles, BrainCircuit, ShieldAlert, CheckCircle, Flame } from "lucide-react";

export function ResearchDashboard({ simulationMode, setSimulationMode }: any) {
  const [researchTopic, setResearchTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<any[]>([]);

  const fetchReports = async () => {
    try {
      const res = await fetch("/research/reports");
      const data = await res.json();
      setReports(data);
    } catch(e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleLaunchResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!researchTopic.trim()) return;
    
    setLoading(true);
    try {
      await fetch("/research/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mission_text: researchTopic, simulation_mode: simulationMode }),
      });
      setResearchTopic("");
      await fetchReports();
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       <div className="flex justify-between items-center bg-[#111] border border-slate-800 p-6 rounded-2xl">
        <div className="space-y-1">
          <h2 className="text-xl font-medium text-white flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-indigo-500" />
            Research Scientist Mode
          </h2>
          <p className="text-sm text-slate-400">
            Formulate hypotheses, design experiments, and generate scientific reports.
          </p>
        </div>
      </div>

      <form onSubmit={handleLaunchResearch} className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-1 gap-4">
          <input
            type="text"
            value={researchTopic}
            onChange={(e) => setResearchTopic(e.target.value)}
            placeholder="Enter research topic (e.g., Cryptographic backdoors in decentralized ledgers)"
            className="flex-1 bg-[#111111] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            disabled={loading}
          />
          <select
            value={simulationMode}
            onChange={(e) => setSimulationMode(e.target.value)}
            className="bg-[#111111] border border-slate-800 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
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
          disabled={loading || !researchTopic.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed justify-center"
        >
          {loading ? (
            <Activity className="w-5 h-5 animate-pulse" />
          ) : (
            <Search className="w-5 h-5" />
          )}
          <span>{loading ? "Researching..." : "Initialize Study"}</span>
        </button>
      </form>

      <div className="space-y-8">
         {reports.map((report, idx) => (
            <div key={idx} className="bg-[#111] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-8">
               <div className="border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3 mb-2">
                     <span className="bg-indigo-900/40 text-indigo-400 text-xs font-bold px-2 py-0.5 rounded border border-indigo-500/30 uppercase tracking-widest">
                        Study {report.id}
                     </span>
                     <span className="text-slate-500 text-sm">{new Date(report.timestamp).toLocaleString()}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">{report.mission_text}</h3>
                  <div className="flex items-center gap-2 mt-2">
                      <Database className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs text-slate-400 font-mono flex-1 truncate">
                          Reused Context: {report.reused_memories?.length > 0 ? report.reused_memories.join(", ") : "None"} | Graph Nodes: {report.kgSearch?.related_concepts?.length || 0}
                      </span>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column: Plan */}
                  <div className="space-y-6">
                     <div>
                        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-3">
                           <Search className="w-4 h-4 text-indigo-400" /> Research Questions
                        </h4>
                        <ul className="space-y-2">
                           {report.plan?.research_questions?.map((q: string, i: number) => (
                              <li key={i} className="text-sm text-slate-400 flex items-start gap-2 bg-slate-900/30 p-2 rounded-lg">
                                 <span className="text-indigo-500 font-bold">{i+1}.</span>
                                 <span>{q}</span>
                              </li>
                           ))}
                        </ul>
                     </div>

                     <div>
                        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-3">
                           <Sparkles className="w-4 h-4 text-amber-400" /> Hypotheses & Evidence Plan
                        </h4>
                        <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                           {report.plan?.hypotheses?.map((h: any, i: number) => (
                              <div key={i} className="bg-black/30 border border-slate-800 p-4 rounded-xl space-y-3">
                                 <h5 className="font-medium text-amber-200 text-sm">H{i+1}: {h.hypothesis}</h5>
                                 <div className="text-xs text-slate-400 border-l-2 border-slate-700 pl-3">
                                    <span className="font-bold text-slate-300 uppercase tracking-widest block mb-1">Evidence Required</span>
                                    {h.evidence_required}
                                 </div>
                                 <div className="text-xs text-slate-400 border-l-2 border-slate-700 pl-3">
                                    <span className="font-bold text-slate-300 uppercase tracking-widest block mb-1">Experiment Design</span>
                                    {h.experiment_design}
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Right Column: Execution & Final Report */}
                  <div className="space-y-6">
                     <div className="bg-indigo-950/20 border border-indigo-900/30 p-5 rounded-2xl">
                        <div className="flex justify-between items-center mb-4">
                           <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                              <FlaskConical className="w-4 h-4 text-indigo-400" /> Science Report
                           </h4>
                           <div className="flex items-center gap-2 bg-[#111] px-3 py-1.5 rounded-lg border border-slate-800">
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                              <span className="text-xs font-bold text-emerald-400 tracking-wider">
                                 Confidence: {report.finalReportData?.research_confidence_score}%
                              </span>
                           </div>
                        </div>
                        <p className="text-sm text-indigo-100/80 leading-relaxed whitespace-pre-wrap font-medium">
                           {report.finalReportData?.final_research_report}
                        </p>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                           <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                              <Play className="w-3 h-3" /> Expected Results
                           </h4>
                           <p className="text-xs text-slate-300 leading-relaxed">
                              {report.finalReportData?.expected_results}
                           </p>
                        </div>
                        
                        <div className="bg-red-950/20 border border-red-900/30 p-4 rounded-xl space-y-4">
                           <div>
                              <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                 <Flame className="w-3 h-3" /> Failure Points
                              </h4>
                              <ul className="list-disc pl-4 text-xs text-red-200/80 space-y-1">
                                 {report.finalReportData?.possible_failure_points?.map((f: string, i: number) => (
                                    <li key={i}>{f}</li>
                                 ))}
                              </ul>
                           </div>
                           <div>
                              <h4 className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                 <ShieldAlert className="w-3 h-3" /> Ethical Concerns
                              </h4>
                              <ul className="list-disc pl-4 text-xs text-orange-200/80 space-y-1">
                                 {report.finalReportData?.ethical_concerns?.map((e: string, i: number) => (
                                    <li key={i}>{e}</li>
                                 ))}
                              </ul>
                           </div>
                        </div>
                     </div>

                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}
