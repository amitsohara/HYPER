import React, { useState, useEffect } from 'react';
import { useHyperMindStore } from '../../store/useHyperMindStore';
import { Activity, HeartPulse, Cpu, MemoryStick, AlertTriangle, AlertCircle, Clock, Zap, Target } from 'lucide-react';

export function EngineStatusView() {
    const { metrics, hii } = useHyperMindStore();

    const [engines, setEngines] = useState<any[]>([]);

    useEffect(() => {
        if (metrics?.engineStats) {
            setEngines(metrics.engineStats);
        }
    }, [metrics]);

    

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                    <Activity className="text-indigo-400" />
                    Engine Status Panel
                </h2>
                <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    All Systems Nominal
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {engines.map(engine => (
                    <div key={engine.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-indigo-500/10 border border-indigo-500/20 text-indigo-400`}>
                                    <Cpu size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-200 text-lg">{engine.id}</h3>
                                    <p className="text-xs text-slate-400">{engine.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {engine.status === "Healthy" ? (
                                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-md text-xs font-medium border border-emerald-500/20 flex items-center gap-1.5">
                                        <HeartPulse size={12} />
                                        {engine.status}
                                    </span>
                                ) : (
                                    <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded-md text-xs font-medium border border-amber-500/20 flex items-center gap-1.5">
                                        <AlertTriangle size={12} />
                                        {engine.status}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                            <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
                                <div className="text-slate-500 text-xs mb-1 flex items-center gap-1">
                                    <HeartPulse size={12} /> Heartbeat
                                </div>
                                <div className="text-sm font-medium text-slate-300">{engine.heartbeat}</div>
                            </div>
                            <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
                                <div className="text-slate-500 text-xs mb-1 flex items-center gap-1">
                                    <Clock size={12} /> Latency
                                </div>
                                <div className="text-sm font-medium text-slate-300">{engine.latency} ms</div>
                            </div>
                            <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
                                <div className="text-slate-500 text-xs mb-1 flex items-center gap-1">
                                    <Zap size={12} /> Queue
                                </div>
                                <div className="text-sm font-medium text-slate-300">{engine.queue}</div>
                            </div>
                            <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
                                <div className="text-slate-500 text-xs mb-1 flex items-center gap-1">
                                    <MemoryStick size={12} /> Memory
                                </div>
                                <div className="text-sm font-medium text-slate-300">{engine.memory} MB</div>
                            </div>
                            <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
                                <div className="text-slate-500 text-xs mb-1 flex items-center gap-1">
                                    <Cpu size={12} /> CPU
                                </div>
                                <div className="text-sm font-medium text-slate-300">{engine.cpu}%</div>
                            </div>
                            <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
                                <div className="text-slate-500 text-xs mb-1 flex items-center gap-1">
                                    <Target size={12} /> Confidence
                                </div>
                                <div className="text-sm font-medium text-indigo-400">{engine.confidence}%</div>
                            </div>
                            <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
                                <div className="text-slate-500 text-xs mb-1 flex items-center gap-1">
                                    <AlertCircle size={12} /> Errors
                                </div>
                                <div className="text-sm font-medium text-emerald-400">{engine.errors}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
