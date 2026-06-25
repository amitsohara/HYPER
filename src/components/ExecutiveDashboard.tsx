import React, { useState, useEffect } from "react";
import { Server, Clock, PlayCircle, PauseCircle, Users, CheckCircle, ListTodo, AlertTriangle, TrendingUp, Cpu } from "lucide-react";
import { safeFetchJSON } from "../fetchUtils";

export function ExecutiveDashboard() {
  const [state, setState] = useState<any>({ tasks: [], agents: [] });
  const [loading, setLoading] = useState(true);

  const fetchState = async () => {
    const data = await safeFetchJSON("/executive/state", {}, { tasks: [], agents: [] });
    setState(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePause = async (taskId: string) => {
    await fetch(`/executive/pause/${taskId}`, { method: "POST" });
    fetchState();
  };

  const handleResume = async (taskId: string) => {
    await fetch(`/executive/resume/${taskId}`, { method: "POST" });
    fetchState();
  };

  if (loading) return <div className="text-white p-8 animate-pulse text-center"><Server className="w-12 h-12 mx-auto text-blue-500 animate-pulse mb-4" /><p>Accessing Executive Function...</p></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-medium text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-400" />
            Executive Function
          </h2>
          <p className="text-sm text-slate-400">
            Task prioritization, dependency management, and dynamic agent allocation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Task Manager */}
        <div className="space-y-6">
          <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
              <ListTodo className="w-4 h-4 text-emerald-400" /> Task Queue
            </h3>
            <div className="space-y-4 max-h-[700px] overflow-y-auto custom-scrollbar pr-2">
              {state.tasks?.map((t: any, i: number) => (
                <div key={i} className="bg-black/30 border border-slate-800 p-4 rounded-xl flex flex-col space-y-3">
                  <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium text-slate-200">{t.name}</h4>
                        <p className="text-xs text-slate-400 mt-1">{t.description}</p>
                      </div>
                      <div>
                        {t.status === 'running' || t.status === 'queued' ? (
                          <button onClick={() => handlePause(t.id)} className="text-slate-400 hover:text-amber-400 p-1"><PauseCircle className="w-5 h-5" /></button>
                        ) : t.status === 'paused' ? (
                          <button onClick={() => handleResume(t.id)} className="text-slate-400 hover:text-emerald-400 p-1"><PlayCircle className="w-5 h-5" /></button>
                        ) : <CheckCircle className="w-5 h-5 text-emerald-600 p-1" />}
                      </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                      <div className="bg-[#111] border border-slate-800 rounded p-2 flex flex-col items-center justify-center">
                          <span className="text-[9px] uppercase text-slate-500">Priority</span>
                          <span className="text-xs font-mono text-white">{t.priority}</span>
                      </div>
                      <div className="bg-[#111] border border-slate-800 rounded p-2 flex flex-col items-center justify-center">
                          <span className="text-[9px] uppercase text-slate-500">Value</span>
                          <span className="text-xs font-mono text-emerald-400">{t.expected_value}</span>
                      </div>
                      <div className="bg-[#111] border border-slate-800 rounded p-2 flex flex-col items-center justify-center">
                          <span className="text-[9px] uppercase text-slate-500">Difficulty</span>
                          <span className="text-xs font-mono text-orange-400">{t.estimated_difficulty}</span>
                      </div>
                      <div className="bg-[#111] border border-slate-800 rounded p-2 flex flex-col items-center justify-center">
                          <span className="text-[9px] uppercase text-slate-500">Risk</span>
                          <span className="text-xs font-mono text-red-400">{t.risk_level}</span>
                      </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-800 pt-2">
                    <span className="flex items-center gap-1 uppercase font-bold text-[10px]">
                      {t.status === 'running' ? <PlayCircle className="w-3 h-3 text-emerald-400" /> : t.status === 'paused' ? <PauseCircle className="w-3 h-3 text-amber-400" /> : <Clock className="w-3 h-3 text-blue-400" />} 
                      {t.status}
                    </span>
                    {t.allocated_agent && <span className="text-indigo-400 flex items-center gap-1"><Cpu className="w-3 h-3"/> {t.allocated_agent}</span>}
                  </div>
                  
                  {t.dependencies && t.dependencies.length > 0 && (
                    <p className="text-[10px] text-slate-600 uppercase pt-1">Depends on: {t.dependencies.join(", ")}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resource Manager */}
        <div className="space-y-6">
          <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-indigo-400" /> Agent Resources
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {state.agents?.map((a: any, i: number) => (
                <div key={i} className="bg-black/30 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-300">{a.id}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${a.status === 'busy' ? 'bg-indigo-900/30 text-indigo-400 border-indigo-800' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                      {a.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 capitalize">{a.role}</p>
                  {a.assigned_task && (
                    <p className="text-[10px] text-emerald-500 mt-2 truncate">Task: {a.assigned_task}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
