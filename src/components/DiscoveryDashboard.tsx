import React, { useState, useEffect } from "react";
import { Search, FlaskConical, Play, Activity, Microscope, FileText, CheckCircle, Split, Map } from "lucide-react";
import { safeFetchJSON } from "../fetchUtils";

export function DiscoveryDashboard() {
  const [topic, setTopic] = useState("");
  const [discipline, setDiscipline] = useState("physics");
  const [loading, setLoading] = useState(false);
  const [discoveries, setDiscoveries] = useState<any[]>([]);

  const fetchDiscoveries = async () => {
    try {
      const data = await safeFetchJSON("/discovery/state", {}, { discoveries: [] });
      setDiscoveries(data.discoveries || []);
    } catch(e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDiscoveries();
    const interval = setInterval(fetchDiscoveries, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLaunchDiscovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    
    setLoading(true);
    try {
      await fetch("/discovery/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, discipline }),
      });
      setTopic("");
      await fetchDiscoveries();
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
            <Microscope className="w-5 h-5 text-indigo-500" />
            Scientific Discovery Platform
          </h2>
          <p className="text-sm text-slate-400">
            Generate hypotheses, competing explanations, and evidence confidence across multiple disciplines.
          </p>
        </div>
      </div>

      <form onSubmit={handleLaunchDiscovery} className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-1 gap-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter research topic (e.g., Quantum Entanglement Networks)"
            className="flex-1 bg-[#111111] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            disabled={loading}
          />
          <select
            value={discipline}
            onChange={(e) => setDiscipline(e.target.value)}
            className="bg-[#111111] border border-slate-800 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
            disabled={loading}
          >
            <option value="physics">Physics</option>
            <option value="biology">Biology</option>
            <option value="computer_science">Computer Science</option>
            <option value="sociology">Sociology</option>
            <option value="economics">Economics</option>
            <option value="astronomy">Astronomy</option>
            <option value="neuroscience">Neuroscience</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed justify-center"
        >
          {loading ? (
            <Activity className="w-5 h-5 animate-pulse" />
          ) : (
            <Search className="w-5 h-5" />
          )}
          <span>{loading ? "Discovering..." : "Launch Discovery"}</span>
        </button>
      </form>

      <div className="space-y-8">
         {discoveries.map((disc, idx) => (
            <div key={idx} className="bg-[#111] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-8">
               <div className="border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3 mb-2">
                     <span className="bg-indigo-900/40 text-indigo-400 text-xs font-bold px-2 py-0.5 rounded border border-indigo-500/30 uppercase tracking-widest flex items-center gap-1">
                        <Microscope className="w-3 h-3" />
                        {disc.discipline}
                     </span>
                     <span className="text-slate-500 text-sm">{new Date(disc.timestamp).toLocaleString()}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">{disc.topic}</h3>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column: Hypotheses & Explanations */}
                  <div className="space-y-6">
                     <div>
                        <h4 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-3">
                           <FlaskConical className="w-4 h-4 text-amber-400" /> Research Hypotheses
                        </h4>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                           {disc.hypotheses?.map((h: any, i: number) => (
                              <div key={i} className="bg-black/30 border border-slate-800 p-4 rounded-xl space-y-3">
                                 <h5 className="font-medium text-amber-200 text-sm flex items-start gap-2">
                                     <span className="text-amber-500/50 mt-0.5">H{i+1}:</span> 
                                     {h.statement}
                                 </h5>
                                 
                                 <div className="text-xs text-slate-400 border-l-2 border-purple-700/50 pl-3">
                                    <span className="font-bold text-purple-400/80 uppercase tracking-widest flex items-center gap-1 mb-1">
                                        <Split className="w-3 h-3" /> Competing Explanations
                                    </span>
                                    <ul className="list-disc pl-4 space-y-1">
                                        {h.competing_explanations?.map((ce: string, ceIdx: number) => (
                                            <li key={ceIdx}>{ce}</li>
                                        ))}
                                    </ul>
                                 </div>
                                 
                                 <div className="text-xs text-slate-400 border-l-2 border-emerald-700/50 pl-3">
                                    <span className="font-bold text-emerald-400/80 uppercase tracking-widest flex items-center gap-1 mb-1">
                                        <Map className="w-3 h-3" /> Experiment Roadmap
                                    </span>
                                    <ul className="list-decimal pl-4 space-y-1">
                                        {h.experiment_roadmap?.map((phase: string, pIdx: number) => (
                                            <li key={pIdx}>{phase}</li>
                                        ))}
                                    </ul>
                                 </div>

                                 <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800">
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                    <span className="text-xs font-bold text-emerald-400 tracking-wider">
                                       Evidence Confidence: {h.evidence_confidence}%
                                    </span>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Right Column: Discovery Report */}
                  <div className="space-y-6">
                     <div className="bg-indigo-950/20 border border-indigo-900/30 p-5 rounded-2xl h-full">
                        <div className="flex justify-between items-center mb-4">
                           <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                              <FileText className="w-4 h-4 text-indigo-400" /> Discovery Report
                           </h4>
                        </div>
                        <p className="text-sm text-indigo-100/80 leading-relaxed whitespace-pre-wrap font-medium">
                           {disc.discovery_report}
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}
