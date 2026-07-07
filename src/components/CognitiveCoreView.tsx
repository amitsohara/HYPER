import React, { useEffect, useState } from "react";
import { Brain, Activity, Target, Shield, Zap, Lock } from "lucide-react";

export function CognitiveCoreView() {
  const [coreState, setCoreState] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await fetch("/api/core/state");
        if (res.ok) {
          const data = (await res.text().then(t => { try { return JSON.parse(t); } catch(e) { return {}; } }));
          setCoreState(data);
        }
      } catch (e) {
        console.error("Failed to fetch core state", e);
      } finally {
        setLoading(false);
      }
    };

    fetchState();
    const interval = setInterval(fetchState, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="text-slate-500 animate-pulse p-8">Initializing HyperMind Cognitive Core...</div>;
  }

  if (!coreState) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-500 border border-slate-800 rounded-xl bg-[#111111] mt-8">
        <Brain className="w-12 h-12 mb-4 opacity-50" />
        <h3 className="text-lg font-medium text-slate-300">Cognitive Core Offline</h3>
        <p className="text-sm mt-2 text-center max-w-md">The core will initialize when a mission is launched. It serves as the central shared cognitive state for all modules.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-400" />
          HyperMind Cognitive Core
        </h2>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-400">Version: <span className="text-slate-200 font-mono">{coreState.version}</span></span>
          <span className="text-slate-400">Stage: <span className="text-purple-400">{coreState.mission_stage}</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* State Summary Cards */}
        <div className="bg-[#111111] border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Target className="w-4 h-4" /> Top Goal
          </div>
          <div className="text-slate-200 font-medium truncate">{coreState.current_goal || "Awaiting goals..."}</div>
        </div>
        <div className="bg-[#111111] border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Activity className="w-4 h-4" /> Attention Focus
          </div>
          <div className="text-slate-200 font-medium truncate">{coreState.attention?.focus || "None"}</div>
        </div>
        <div className="bg-[#111111] border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Shield className="w-4 h-4" /> Confidence Score
          </div>
          <div className="text-slate-200 font-medium">
            <span className={coreState.confidence?.score > 70 ? "text-green-400" : coreState.confidence?.score > 40 ? "text-yellow-400" : "text-red-400"}>
              {coreState.confidence?.score || 0}%
            </span>
          </div>
        </div>
        <div className="bg-[#111111] border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Zap className="w-4 h-4" /> Active Modules
          </div>
          <div className="text-slate-200 font-medium">{coreState.active_modules?.length || 0} Modules</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111111] border border-slate-800 p-6 rounded-xl">
            <h3 className="text-lg font-medium text-slate-200 mb-4 border-b border-slate-800 pb-2">Working Memory</h3>
            <ul className="space-y-2">
              {coreState.working_memory?.length > 0 ? (
                coreState.working_memory.map((fact: any, idx: number) => (
                  <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    {typeof fact === 'string' ? fact : JSON.stringify(fact)}
                  </li>
                ))
              ) : (
                <li className="text-sm text-slate-500">Memory is empty.</li>
              )}
            </ul>
          </div>

          <div className="bg-[#111111] border border-slate-800 p-6 rounded-xl">
            <h3 className="text-lg font-medium text-slate-200 mb-4 border-b border-slate-800 pb-2">Event Timeline</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {coreState.events?.length > 0 ? (
                [...coreState.events].reverse().map((event: any, idx: number) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="text-xs text-slate-500 font-mono pt-1 w-20 flex-shrink-0">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </div>
                    <div>
                      <div className="text-sm text-slate-200 font-medium">{event.type}</div>
                      <div className="text-xs text-slate-400 font-mono mt-1 bg-[#1a1a1a] p-2 rounded">
                        Source: {event.sourceModule}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-500">No events logged.</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#111111] border border-slate-800 p-6 rounded-xl">
            <h3 className="text-lg font-medium text-slate-200 mb-4 border-b border-slate-800 pb-2">Evidence Store</h3>
            <div className="space-y-3">
              {coreState.evidence?.length > 0 ? (
                coreState.evidence.map((ev: any, idx: number) => (
                  <div key={idx} className="p-3 bg-[#1a1a1a] rounded-lg border border-slate-800 text-sm">
                    <div className="text-slate-300">{ev.description}</div>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className="text-slate-500 font-mono">{ev.source}</span>
                      <span className={ev.quality === 'HIGH' ? 'text-green-400' : 'text-yellow-400'}>{ev.quality} Q</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-500">No evidence gathered.</div>
              )}
            </div>
          </div>

          <div className="bg-[#111111] border border-slate-800 p-6 rounded-xl">
            <h3 className="text-lg font-medium text-slate-200 mb-4 border-b border-slate-800 pb-2">Beliefs & Constraints</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Beliefs</h4>
                {coreState.beliefs?.length > 0 ? (
                  <ul className="text-sm text-slate-300 space-y-1">
                    {coreState.beliefs.map((b: any, i: number) => (
                       <li key={i}>- {typeof b === 'string' ? b : b.statement || JSON.stringify(b)}</li>
                    ))}
                  </ul>
                ) : <span className="text-xs text-slate-600">None</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
