import React, { useState, useEffect } from "react";
import { 
  Home, ListTodo, Activity, Network, BookOpen, Settings as SettingsIcon, Hexagon
} from "lucide-react";
import { useHyperMindStore } from "../../store/useHyperMindStore";
import { HomeView } from "./views/HomeView";
import { MissionQueueView } from "./views/MissionQueueView";
import { MissionControlView } from "./views/MissionControlView";
import { ObservatoryView } from "./views/ObservatoryView";
import { KnowledgeCenterView } from "./views/KnowledgeCenterView";
import { SettingsView } from "./views/SettingsView";

export function HuxpApp() {
  const [currentView, setCurrentView] = useState("home");
  const [activeMission, setActiveMission] = useState<any>(null);
  const { connect, disconnect } = useHyperMindStore();

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  const navigateToMissionControl = (mission: any) => {
    setActiveMission(mission);
    setCurrentView("mission_control");
  };

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "mission_queue", label: "Mission Queue", icon: ListTodo },
    { id: "mission_control", label: "Mission Control", icon: Activity },
    { id: "observatory", label: "Cognitive Observatory", icon: Network },
    { id: "knowledge", label: "Knowledge Center", icon: BookOpen },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <div className="flex h-screen w-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="p-6 flex items-center space-x-3">
          <Hexagon className="w-8 h-8 text-emerald-400" />
          <span className="font-bold tracking-widest text-lg">HYPERMIND</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                currentView === item.id 
                  ? "bg-zinc-800 text-emerald-400 font-medium" 
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-zinc-800 text-xs text-zinc-500 font-mono text-center">
          HUXP v1.0 [SYS_ONLINE]
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {currentView === "home" && <HomeView onNavigateQueue={() => setCurrentView("mission_queue")} />}
        {currentView === "mission_queue" && <MissionQueueView onSelectMission={navigateToMissionControl} />}
        {currentView === "mission_control" && <MissionControlView activeMission={activeMission} />}
        {currentView === "observatory" && <ObservatoryView />}
        {currentView === "knowledge" && <KnowledgeCenterView />}
        {currentView === "settings" && <SettingsView />}
      </main>
    </div>
  );
}
