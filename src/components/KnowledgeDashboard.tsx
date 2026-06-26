import React, { useState, useEffect } from "react";
import { BookOpen, Search, Link as LinkIcon, Database, CheckCircle, BrainCircuit } from "lucide-react";
import { safeFetchJSON } from "../fetchUtils";

export function KnowledgeDashboard({ mission }: { mission?: any }) {
  const [data, setData] = useState<any>({
    evidence: [],
    needs: []
  });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const fetchState = async () => {
    try {
      const [evidenceRes, needsRes] = await Promise.all([
        safeFetchJSON("/api/knowledge/evidence", {}, { evidence: [] }),
        query ? safeFetchJSON("/api/knowledge/plan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mission: query }) }, { needs: [] }) : Promise.resolve({ needs: [] })
      ]);
      setData({
        evidence: evidenceRes.evidence || [],
        needs: needsRes.needs || []
      });
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
    const interval = setInterval(() => {
        if (!query) fetchState();
    }, 5000);
    return () => clearInterval(interval);
  }, [query]);

  const handlePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetchState();
  };

  if (loading && !data.evidence.length) return <div className="text-white p-8 animate-pulse text-center"><BookOpen className="w-12 h-12 mx-auto text-emerald-500 animate-pulse mb-4" /><p>Accessing Knowledge Graph...</p></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-medium text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            Knowledge Acquisition
          </h2>
          <p className="text-sm text-slate-400">
            Autonomous evidence gathering, source routing, and credibility scoring.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Planner */}
        <div className="space-y-6">
          <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
              <BrainCircuit className="w-4 h-4 text-purple-400" /> Knowledge Planner
            </h3>
            
            <form onSubmit={handlePlan} className="mb-4">
               <div className="flex gap-2">
                 <input 
                   type="text" 
                   value={query}
                   onChange={e => setQuery(e.target.value)}
                   placeholder="Enter a mission to plan knowledge needs..."
                   className="flex-1 bg-black/50 border border-slate-700 text-sm text-white px-3 py-2 rounded focus:outline-none focus:border-emerald-500"
                 />
                 <button type="submit" disabled={loading} className="bg-emerald-900/50 hover:bg-emerald-800 text-emerald-200 px-4 py-2 rounded text-sm transition-colors flex items-center gap-2">
                    <Search className="w-4 h-4" /> Plan
                 </button>
               </div>
            </form>

            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {data.needs?.length === 0 && <p className="text-slate-500 text-sm italic">No active knowledge plans.</p>}
              {data.needs?.map((need: any, i: number) => (
                <div key={i} className="bg-black/30 border border-slate-800 p-4 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-sm font-medium text-emerald-300">{need.query}</h4>
                      <div className="flex gap-2 mt-1">
                          {need.preferred_sources?.map((s: string, idx: number) => (
                              <span key={idx} className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded uppercase">{s}</span>
                          ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">{need.rationale}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Evidence Store */}
        <div className="space-y-6">
          <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
              <CheckCircle className="w-4 h-4 text-blue-400" /> Verified Evidence Store
            </h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
              {data.evidence?.length === 0 && <p className="text-slate-500 text-sm italic">No evidence acquired yet.</p>}
              {data.evidence?.slice().reverse().map((ev: any, i: number) => (
                <div key={i} className="bg-black/30 border border-slate-800 p-4 rounded-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                     <LinkIcon className="w-16 h-16 text-emerald-400" />
                  </div>
                  <div className="flex justify-between items-start mb-2 relative z-10">
                     <div className="flex flex-col">
                        <span className="text-[10px] text-emerald-500 font-mono mb-1">{ev.source.toUpperCase()}</span>
                        <h4 className="text-sm font-medium text-slate-200 leading-tight">{ev.title}</h4>
                     </div>
                  </div>
                  <div className="flex gap-4 mb-3 relative z-10">
                     <div className="flex flex-col">
                        <span className="text-[9px] text-slate-500 uppercase">Credibility</span>
                        <span className="text-xs font-mono text-emerald-400">{ev.credibility_score || 0}/100</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[9px] text-slate-500 uppercase">Relevance</span>
                        <span className="text-xs font-mono text-blue-400">{ev.relevance_score || 0}/100</span>
                     </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-2 relative z-10 line-clamp-2">{ev.summary}</p>
                  <div className="bg-slate-900/50 p-2 rounded text-[9px] font-mono text-slate-500 break-all relative z-10">
                    {ev.citation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
