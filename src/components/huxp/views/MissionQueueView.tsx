import React from "react";
import { useHyperMindStore } from "../../../store/useHyperMindStore";
import { Play, Pause, AlertCircle, CheckCircle2, CircleDashed } from "lucide-react";

export function MissionQueueView({ onSelectMission }: { onSelectMission: (mission: any) => void }) {
  const { missions } = useHyperMindStore();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "RUNNING": return <Play className="w-4 h-4 text-emerald-400" />;
      case "PAUSED": return <Pause className="w-4 h-4 text-amber-400" />;
      case "FAILED": return <AlertCircle className="w-4 h-4 text-red-400" />;
      case "COMPLETED": return <CheckCircle2 className="w-4 h-4 text-zinc-400" />;
      case "READY":
      default: return <CircleDashed className="w-4 h-4 text-blue-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RUNNING": return "bg-emerald-400/10 text-emerald-400 border-emerald-400/20";
      case "PAUSED": return "bg-amber-400/10 text-amber-400 border-amber-400/20";
      case "FAILED": return "bg-red-400/10 text-red-400 border-red-400/20";
      case "COMPLETED": return "bg-zinc-800 text-zinc-400 border-zinc-700";
      case "READY":
      default: return "bg-blue-400/10 text-blue-400 border-blue-400/20";
    }
  };

  // Mock some missions if none exist to show UI structure
  const displayMissions = Object.values(missions || {}).length > 0 ? Object.values(missions) : [
    { id: "m-001", directive: "Optimize city traffic", status: "RUNNING", createdAt: Date.now() - 3600000, priority: "High" },
    { id: "m-002", directive: "Inspect medicines", status: "PAUSED", createdAt: Date.now() - 7200000, priority: "Normal" },
    { id: "m-003", directive: "Control warehouse robot", status: "READY", createdAt: Date.now() - 10000, priority: "Urgent" },
  ];

  return (
    <div className="flex-1 flex flex-col p-8">
      <div className="max-w-6xl mx-auto w-full space-y-8 flex-1 flex flex-col">
        <header>
          <h1 className="text-3xl font-light tracking-tight mb-2">Mission Queue</h1>
          <p className="text-zinc-400">Manage and monitor active and pending directives.</p>
        </header>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl flex-1 overflow-hidden flex flex-col">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-zinc-800 text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-900/50">
            <div className="col-span-2">Mission ID</div>
            <div className="col-span-4">Directive</div>
            <div className="col-span-2">Priority</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Created</div>
          </div>

          {/* Table Body */}
          <div className="flex-1 overflow-auto p-2 space-y-1">
            {displayMissions.map((m: any) => (
              <div 
                key={m.id} 
                onClick={() => onSelectMission(m)}
                className="grid grid-cols-12 gap-4 p-3 rounded-xl hover:bg-zinc-800 cursor-pointer items-center transition-colors group"
              >
                <div className="col-span-2 font-mono text-sm text-zinc-400 group-hover:text-zinc-300">{m.id.substring(0, 8)}</div>
                <div className="col-span-4 font-medium truncate">{m.directive}</div>
                <div className="col-span-2">
                  <span className={`text-xs px-2 py-1 rounded-full border ${m.priority === 'Urgent' ? 'border-red-500/30 text-red-400 bg-red-500/10' : 'border-zinc-700 text-zinc-400 bg-zinc-800'}`}>
                    {m.priority || "Normal"}
                  </span>
                </div>
                <div className="col-span-2 flex items-center space-x-2">
                  <span className={`flex items-center space-x-2 px-2.5 py-1 rounded-full border text-xs font-medium ${getStatusColor(m.status)}`}>
                    {getStatusIcon(m.status)}
                    <span>{m.status}</span>
                  </span>
                </div>
                <div className="col-span-2 text-sm text-zinc-500">
                  {m.createdAt ? new Date(m.createdAt).toLocaleTimeString() : '-'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
