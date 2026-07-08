import React, { useState } from "react";
import { Play, Pause, Square, Download, Activity, Globe, BrainCircuit, ListTree, Terminal } from "lucide-react";
import { useHyperMindStore } from "../../../store/useHyperMindStore";
import { WorldModelRenderer } from "./components/WorldModelRenderer";
import { CognitivePipeline } from "./components/CognitivePipeline";
import { EventStreamConsole } from "./components/EventStreamConsole";

export function MissionControlView({ activeMission }: { activeMission: any }) {
  const { metrics, worldState } = useHyperMindStore();
  const [missionState, setMissionState] = useState(activeMission?.status || "READY");

  const mission = activeMission || {
    id: "m-000",
    directive: "No mission selected",
    status: "READY",
    createdAt: Date.now()
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-zinc-950">
      {/* Top Header */}
      <header className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center space-x-6">
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 font-mono">MISSION // {mission.id.substring(0, 8)}</span>
            <span className="font-medium text-zinc-100 truncate max-w-md">{mission.directive}</span>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-2
            ${missionState === 'RUNNING' ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400' : 
              missionState === 'PAUSED' ? 'bg-amber-400/10 border-amber-400/20 text-amber-400' :
              'bg-blue-400/10 border-blue-400/20 text-blue-400'}`}
          >
            {missionState === 'RUNNING' && <Activity className="w-3 h-3 animate-pulse" />}
            <span>{missionState}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {missionState !== 'RUNNING' ? (
            <button onClick={() => setMissionState("RUNNING")} className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors">
              <Play className="w-5 h-5" />
            </button>
          ) : (
            <button onClick={() => setMissionState("PAUSED")} className="p-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors">
              <Pause className="w-5 h-5" />
            </button>
          )}
          <button className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
            <Square className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-zinc-800 mx-2" />
          <button className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition-colors">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: Timeline & Tasks */}
        <aside className="w-64 border-r border-zinc-800 flex flex-col bg-zinc-950/50">
          <div className="p-4 border-b border-zinc-800 flex items-center space-x-2 text-zinc-400 text-sm font-medium">
            <ListTree className="w-4 h-4" />
            <span>Task Tree</span>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-2">
            <div className="text-sm font-medium text-emerald-400 flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-400 mr-2"/> Observation</div>
            <div className="text-sm text-zinc-400 flex items-center pl-4 border-l border-zinc-800 ml-1 py-1">Identify objects</div>
            <div className="text-sm text-zinc-400 flex items-center pl-4 border-l border-zinc-800 ml-1 py-1">Assess anomalies</div>
          </div>
        </aside>

        {/* Center Canvas: World Model */}
        <main className="flex-1 flex flex-col bg-zinc-950 relative">
          <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-zinc-900/80 backdrop-blur border border-zinc-800 px-3 py-1.5 rounded-lg text-sm text-zinc-300">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Live World Model</span>
          </div>
          <WorldModelRenderer worldState={worldState} />
        </main>

        {/* Right Panel: Cognitive Pipeline */}
        <aside className="w-80 border-l border-zinc-800 flex flex-col bg-zinc-950/50">
          <div className="p-4 border-b border-zinc-800 flex items-center space-x-2 text-zinc-400 text-sm font-medium">
            <BrainCircuit className="w-4 h-4" />
            <span>Cognitive Pipeline</span>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <CognitivePipeline />
          </div>
        </aside>

      </div>

      {/* Bottom Panel: HCNS Stream & Console */}
      <div className="h-48 border-t border-zinc-800 bg-zinc-900 flex flex-col flex-shrink-0">
        <div className="px-4 py-2 border-b border-zinc-800 flex items-center space-x-2 text-zinc-400 text-xs font-medium uppercase tracking-wider">
          <Terminal className="w-3 h-3" />
          <span>HCNS Event Stream</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <EventStreamConsole />
        </div>
      </div>
    </div>
  );
}
