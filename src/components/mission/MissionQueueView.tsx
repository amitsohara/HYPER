import React, { useMemo } from 'react';
import { useHyperMindStore } from '../../store/useHyperMindStore';
import { Play, Pause, CheckCircle, XCircle, Clock, AlertTriangle, AlertCircle, CircleDashed } from 'lucide-react';

export function MissionQueueView() {
    const { missions } = useHyperMindStore();

    // Group missions by status
    const groupedMissions = useMemo(() => {
        const groups: Record<string, any[]> = {
            "NEED": [],
            "QUEUED": [],
            "RUNNING": [],
            "PAUSED": [],
            "COMPLETED": [],
            "FAILED": [],
            "CANCELLED": []
        };
        
        // Also capture any generic "Need" or unscheduled if they exist.
        // Let's assume some are queued. 
        if (missions) {
            missions.forEach(m => {
                const status = (m.status || "QUEUED").toUpperCase();
                if (groups[status]) {
                    groups[status].push(m);
                } else {
                    groups["QUEUED"].push(m);
                }
            });
        }
        return groups;
    }, [missions]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "RUNNING": return <Play size={16} className="text-emerald-400" />;
            case "NEED": return <CircleDashed size={16} className="text-pink-400" />;
            case "QUEUED": return <Clock size={16} className="text-indigo-400" />;
            case "PAUSED": return <Pause size={16} className="text-amber-400" />;
            case "COMPLETED": return <CheckCircle size={16} className="text-emerald-500" />;
            case "FAILED": return <AlertTriangle size={16} className="text-red-500" />;
            case "CANCELLED": return <XCircle size={16} className="text-slate-500" />;
            default: return <CircleDashed size={16} className="text-slate-400" />;
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "RUNNING": return "border-emerald-500/30 bg-emerald-500/5 text-emerald-300";
            case "NEED": return "border-pink-500/30 bg-pink-500/5 text-pink-300";
            case "QUEUED": return "border-indigo-500/30 bg-indigo-500/5 text-indigo-300";
            case "PAUSED": return "border-amber-500/30 bg-amber-500/5 text-amber-300";
            case "COMPLETED": return "border-emerald-500/20 bg-emerald-500/5 text-emerald-400";
            case "FAILED": return "border-red-500/30 bg-red-500/5 text-red-300";
            case "CANCELLED": return "border-slate-500/30 bg-slate-500/5 text-slate-300";
            default: return "border-slate-700 bg-slate-800 text-slate-400";
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                    <Clock className="text-indigo-400" />
                    Mission Queue
                </h2>
                <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-sm font-medium">
                    Live from HOS
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {Object.entries(groupedMissions).map(([status, list]: [string, any[]]) => {
                    if (list.length === 0 && status !== "RUNNING" && status !== "QUEUED") return null;
                    return (
                        <div key={status} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {getStatusIcon(status)}
                                    <h3 className="font-semibold text-slate-200 capitalize">{status.toLowerCase()}</h3>
                                </div>
                                <span className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded-full font-medium">
                                    {list.length} {list.length === 1 ? 'Mission' : 'Missions'}
                                </span>
                            </div>
                            
                            <div className="p-4">
                                {list.length === 0 ? (
                                    <div className="text-center py-8 text-slate-500 text-sm italic">
                                        No missions currently {status.toLowerCase()}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {list.map(m => (
                                            <div key={m.id} className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border ${getStatusStyle(status)} transition-colors`}>
                                                <div className="mb-3 md:mb-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-medium text-slate-100">{m.name || m.objective || "Unnamed Mission"}</span>
                                                        {m.priority && (
                                                            <span className="text-xs px-1.5 py-0.5 bg-amber-500/10 text-amber-400 rounded border border-amber-500/20 ml-2">
                                                                Priority {m.priority}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-slate-400 font-mono">ID: {m.id}</div>
                                                </div>
                                                
                                                <div className="flex items-center gap-4">
                                                    {m.hii !== undefined && (
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-xs text-slate-500">HII</span>
                                                            <span className="text-sm font-medium text-indigo-400">{Number(m.hii).toFixed(1)}%</span>
                                                        </div>
                                                    )}
                                                    {m.llmDependency !== undefined && (
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-xs text-slate-500">LLM Dep</span>
                                                            <span className="text-sm font-medium text-amber-400">{(m.llmDependency * 100).toFixed(1)}%</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
