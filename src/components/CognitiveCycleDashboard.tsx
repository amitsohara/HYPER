import React, { useState, useEffect } from 'react';
import { Activity, Brain, Compass, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface CycleTraceEntry {
  step_name: string;
  status: string;
  timestamp: number;
}

interface CycleState {
  cycle_id: string;
  mission: string;
  status: string;
  current_step: string;
  trace: CycleTraceEntry[];
  errors: any[];
  [key: string]: any;
}

export function CognitiveCycleDashboard({ missionId }: { missionId: string }) {
  const [cycleState, setCycleState] = useState<CycleState | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("trace");

  useEffect(() => {
    if (!missionId) return;

    const fetchState = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/cycle/${missionId}`);
        const data = (await response.text().then(t => { try { return JSON.parse(t); } catch(e) { return {}; } }));
        setCycleState(data);
      } catch (e) {
        console.error("Failed to fetch cycle state", e);
      }
      setLoading(false);
    };

    fetchState();
    
    // Simple polling
    const interval = setInterval(fetchState, 5000);
    return () => clearInterval(interval);
  }, [missionId]);

  if (!cycleState) return <div className="p-4">Loading Cognitive Cycle...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-lg font-semibold text-white">
              <Activity className="h-5 w-5 text-indigo-500" />
              Cognitive Cycle
            </div>
            <div className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${cycleState.status === "completed" ? "bg-emerald-500/10 text-emerald-500" : cycleState.status === "failed" ? "bg-red-500/10 text-red-500" : "bg-slate-800 text-slate-300"}`}>
              {cycleState.status}
            </div>
          </div>
          <p className="text-sm text-slate-400 mt-1">Master continuous loop for {cycleState.cycle_id}</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
             <div className="bg-slate-800 p-4 rounded-lg">
                <p className="text-sm text-slate-400">Current Step</p>
                <p className="font-semibold text-lg text-white">{cycleState.current_step}</p>
             </div>
             <div className="bg-slate-800 p-4 rounded-lg">
                <p className="text-sm text-slate-400">Mode</p>
                <p className="font-semibold text-lg text-white">{cycleState.mode || 'N/A'}</p>
             </div>
             <div className="bg-slate-800 p-4 rounded-lg">
                <p className="text-sm text-slate-400">Errors</p>
                <p className="font-semibold text-lg text-red-500">{cycleState.errors?.length || 0}</p>
             </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-2 border-b border-slate-800 pb-2">
               <button onClick={() => setActiveTab("trace")} className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === "trace" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"}`}>Cycle Trace</button>
               <button onClick={() => setActiveTab("experience")} className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === "experience" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"}`}>Experience</button>
               <button onClick={() => setActiveTab("reflection")} className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === "reflection" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"}`}>Reflection</button>
               <button onClick={() => setActiveTab("learning")} className={`px-4 py-2 text-sm font-medium rounded-lg ${activeTab === "learning" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"}`}>Learning</button>
            </div>
            
            {activeTab === "trace" && (
               <div className="h-96 overflow-y-auto pr-2 custom-scrollbar">
                  <div className="space-y-4">
                     {cycleState.trace?.map((entry, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-3 border border-slate-800 bg-slate-950 rounded-lg">
                           {entry.status === 'completed' ? (
                             <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                           ) : entry.status === 'failed' ? (
                             <XCircle className="h-5 w-5 text-red-500" />
                           ) : (
                             <Clock className="h-5 w-5 text-blue-500 animate-pulse" />
                           )}
                           <div className="flex-1">
                              <p className="font-medium text-slate-200">{entry.step_name}</p>
                              <p className="text-xs text-slate-500">{new Date(entry.timestamp).toLocaleTimeString()}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}
            
            {activeTab === "experience" && (
               <pre className="p-4 bg-slate-950 text-slate-300 rounded-lg overflow-auto h-96 text-xs border border-slate-800">
                  {JSON.stringify(cycleState.experience, null, 2)}
               </pre>
            )}
            
            {activeTab === "reflection" && (
               <pre className="p-4 bg-slate-950 text-slate-300 rounded-lg overflow-auto h-96 text-xs border border-slate-800">
                  {JSON.stringify(cycleState.reflection, null, 2)}
               </pre>
            )}
            
            {activeTab === "learning" && (
               <pre className="p-4 bg-slate-950 text-slate-300 rounded-lg overflow-auto h-96 text-xs border border-slate-800">
                  {JSON.stringify(cycleState.learning, null, 2)}
               </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
