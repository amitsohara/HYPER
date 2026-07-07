import React, { useState, useEffect } from "react";
import { 
  Activity, Monitor, LayoutDashboard, Search, Camera, Globe, 
  BrainCircuit, GitCommit, GitMerge, FileText, Share2, 
  Target, BarChart3, Settings, Play, Database, Award, 
  GitBranch, FlaskConical, Map, LineChart, BookOpen, Layers,
  Power, ListTree
} from "lucide-react";
import { useHyperMindStore } from "../store/useHyperMindStore";
import { ConceptGraphView } from "./mission/ConceptGraphView";
import { ThoughtExplorerView } from "./mission/ThoughtExplorerView";
import { ReasoningExplorerView } from "./mission/ReasoningExplorerView";
import { DecisionCenterView } from "./mission/DecisionCenterView";
import { LearningCenterView } from "./mission/LearningCenterView";
import { AnalyticsView } from "./mission/AnalyticsView";
import { SimulationCenterView } from "./mission/SimulationCenterView";
import { ReplayCenterView } from "./mission/ReplayCenterView";
import { LiveCognitivePipelineView } from "./mission/LiveCognitivePipelineView";
import { EngineStatusView } from "./mission/EngineStatusView";
import { HUIVDashboardView } from "./mission/HUIVDashboardView";
import { ShieldCheck } from "lucide-react";
import { PluginManagerView, ReportsView, LeaderboardView, BenchmarkView, RegressionView, SettingsView } from "./mission/OtherViews";
import { MissionDetailView } from "./MissionDetailView";

export function MissionControlApp({ onBack, activeMission }: { onBack?: () => void, activeMission?: any }) {
  const [activeTab, setActiveTab] = useState(activeMission ? "active_mission_detail" : "dashboard");
  const { metrics, hii, missions, diagnostics, connect, disconnect } = useHyperMindStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "mission_control", label: "Mission Control", icon: Target },
    { id: "engine_status", label: "Engine Status", icon: Activity },
    { id: "mission_builder", label: "Mission Builder", icon: GitCommit },
    { id: "live_inputs", label: "Live Inputs", icon: Camera },
    { id: "world_model", label: "World Model", icon: Globe },
    { id: "concept_graph", label: "Concept Graph", icon: GitMerge },
    { id: "reasoning_explorer", label: "Reasoning Explorer", icon: BrainCircuit },
    { id: "thought_explorer", label: "Thought Explorer", icon: FileText },
    { id: "simulation_center", label: "Simulation Center", icon: Layers },
    { id: "decision_center", label: "Decision Center", icon: Share2 },
    { id: "learning_center", label: "Learning Center", icon: BookOpen },
    { id: "plugin_manager", label: "Plugin Manager", icon: Database },
    { id: "replay", label: "Replay", icon: Play },
    { id: "analytics", label: "Analytics", icon: LineChart },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "benchmark", label: "Benchmark", icon: Activity },
    { id: "regression", label: "Regression", icon: GitBranch },
    { id: "leaderboard", label: "Leaderboard", icon: Award },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "huiv", label: "HUIV Validation", icon: ShieldCheck }
  ];

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 border-r border-slate-800 bg-slate-900 flex flex-col`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
          {sidebarOpen && <div className="font-bold text-lg text-indigo-400">HyperMind RMV</div>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-slate-800 rounded">
            <Monitor size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map(item => (
              <li key={item.id}>
                <button 
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${activeTab === item.id ? 'bg-indigo-600/20 text-indigo-400' : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                  title={item.label}
                >
                  <item.icon size={18} className="shrink-0" />
                  {sidebarOpen && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {onBack && (
          <div className="p-4 border-t border-slate-800">
            <button 
              onClick={onBack}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition-colors"
              title="Command Center"
            >
              <Target size={18} />
              {sidebarOpen && <span className="text-sm font-medium">Command Center</span>}
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-950">
        {/* Topbar */}
        <div className="h-16 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold capitalize text-slate-100">{activeTab.replace('_', ' ')}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input type="text" placeholder="Global Search..." className="pl-9 pr-4 py-1.5 bg-slate-900 border border-slate-700 rounded-full text-sm focus:outline-none focus:border-indigo-500 transition-colors w-64" />
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 text-sm font-medium">
              <Activity size={14} className="animate-pulse" />
              v2.0 HII: {hii?.overallIntelligence ? Number(hii.overallIntelligence * 100).toFixed(1) + '%' : 'CALCULATING...'}
            </div>
          </div>
        </div>

        {/* Dynamic Canvas */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'active_mission_detail' && activeMission && <MissionDetailView missionId={activeMission.mission_id || activeMission.id} missionName={activeMission.name || activeMission.mission_text || 'Active Mission'} />}
          {activeTab === 'dashboard' && <DashboardView metrics={metrics} hii={hii} missions={missions} />}
          {activeTab === 'mission_control' && <MissionControlView onLaunchNew={() => setActiveTab('mission_builder')} />}
          {activeTab === 'engine_status' && <EngineStatusView />}
          {activeTab === 'mission_builder' && <MissionBuilderView />}
          {activeTab === 'live_inputs' && <LiveInputsView />}
          {activeTab === 'simulation_center' && <SimulationCenterView />}
          {activeTab === 'world_model' && <WorldModelView diagnostics={diagnostics} />}
          {activeTab === 'replay' && <ReplayCenterView />}
          {activeTab === 'concept_graph' && <ConceptGraphView diagnostics={diagnostics} />}
          {activeTab === 'thought_explorer' && <ThoughtExplorerView diagnostics={diagnostics} />}
          {activeTab === 'reasoning_explorer' && <ReasoningExplorerView diagnostics={diagnostics} />}
          {activeTab === 'decision_center' && <DecisionCenterView diagnostics={diagnostics} />}
          {activeTab === 'learning_center' && <LearningCenterView diagnostics={diagnostics} />}
          {activeTab === 'analytics' && <AnalyticsView diagnostics={diagnostics} />}
          {activeTab === 'plugin_manager' && <PluginManagerView />}
          {activeTab === 'reports' && <ReportsView />}
          {activeTab === 'leaderboard' && <LeaderboardView />}
          {activeTab === 'benchmark' && <BenchmarkView />}
          {activeTab === 'regression' && <RegressionView />}
          {activeTab === 'settings' && <SettingsView />}
          {activeTab === 'huiv' && <HUIVDashboardView />}
          
          {/* Fallback for other tabs */}
          {['dashboard', 'active_mission_detail', 'mission_control', 'mission_builder', 'live_inputs', 'simulation_center', 'world_model', 'replay', 'concept_graph', 'thought_explorer', 'reasoning_explorer', 'decision_center', 'learning_center', 'analytics', 'plugin_manager', 'reports', 'leaderboard', 'benchmark', 'regression', 'settings'].indexOf(activeTab) === -1 && (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
              <Monitor size={48} className="opacity-20" />
              <p>Module {activeTab.replace('_', ' ')} is online and awaiting HCNS event streams.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MissionBuilderView() {
  const [nodes, setNodes] = useState<{id: string, type: string, label: string, icon: any}[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  const handleDragStart = (e: React.DragEvent, type: string, label: string) => {
      e.dataTransfer.setData("application/json", JSON.stringify({ type, label }));
  };

  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      try {
          const data = JSON.parse(e.dataTransfer.getData("application/json"));
          let icon = Camera;
          if (data.type === 'cognitive') icon = Target;
          if (data.type === 'output') icon = Activity;
          setNodes([...nodes, { id: Math.random().toString(), type: data.type, label: data.label, icon }]);
      } catch (err) {}
  };

  const handleDeploy = async () => {
      setIsDeploying(true);
      try {
          await fetch('/api/hml/missions/deploy', { method: 'POST' });
      } catch (e) {
          console.error(e);
      }
      setTimeout(() => setIsDeploying(false), 2000);
  };

  const handleSave = () => {
      setSaveStatus("Saved!");
      setTimeout(() => setSaveStatus(""), 2000);
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-200">Mission Builder</h2>
          <p className="text-sm text-slate-400">Drag-and-drop visual mission orchestration</p>
        </div>
        <div className="flex gap-2 items-center">
           {saveStatus && <span className="text-emerald-400 text-sm">{saveStatus}</span>}
           <button onClick={handleSave} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded shadow">
             Save Draft
           </button>
           <button onClick={handleDeploy} disabled={isDeploying} className={`px-4 py-2 ${isDeploying ? 'bg-indigo-800 text-indigo-300' : 'bg-indigo-600 hover:bg-indigo-500 text-white'} text-sm font-medium rounded shadow flex items-center gap-2`}>
             <Play size={14} /> {isDeploying ? 'Deploying...' : 'Deploy Mission'}
           </button>
        </div>
      </div>
      
      <div className="flex flex-1 min-h-0 border border-slate-800 rounded-xl overflow-hidden bg-slate-900/50">
        <div className="w-64 border-r border-slate-800 bg-slate-900 flex flex-col">
          <div className="p-3 border-b border-slate-800 text-sm font-medium text-slate-400">Blocks</div>
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
             <div>
               <div className="text-xs text-slate-500 mb-2 font-medium">INPUTS</div>
               <div className="space-y-2">
                 <div draggable onDragStart={(e) => handleDragStart(e, 'input', 'Camera Feed')} className="p-2 bg-slate-800 rounded border border-slate-700 text-sm flex items-center gap-2 cursor-grab active:cursor-grabbing"><Camera size={14} className="text-slate-400" /> Camera Feed</div>
                 <div draggable onDragStart={(e) => handleDragStart(e, 'input', 'API Stream')} className="p-2 bg-slate-800 rounded border border-slate-700 text-sm flex items-center gap-2 cursor-grab active:cursor-grabbing"><Globe size={14} className="text-slate-400" /> API Stream</div>
                 <div draggable onDragStart={(e) => handleDragStart(e, 'input', 'Dataset')} className="p-2 bg-slate-800 rounded border border-slate-700 text-sm flex items-center gap-2 cursor-grab active:cursor-grabbing"><Database size={14} className="text-slate-400" /> Dataset</div>
               </div>
             </div>
             
             <div>
               <div className="text-xs text-slate-500 mb-2 font-medium">COGNITIVE BLOCKS</div>
               <div className="space-y-2">
                 <div draggable onDragStart={(e) => handleDragStart(e, 'cognitive', 'Set Goal')} className="p-2 bg-slate-800 rounded border border-slate-700 text-sm flex items-center gap-2 cursor-grab active:cursor-grabbing"><Target size={14} className="text-indigo-400" /> Set Goal</div>
                 <div draggable onDragStart={(e) => handleDragStart(e, 'cognitive', 'Simulation Config')} className="p-2 bg-slate-800 rounded border border-slate-700 text-sm flex items-center gap-2 cursor-grab active:cursor-grabbing"><Layers size={14} className="text-indigo-400" /> Simulation Config</div>
                 <div draggable onDragStart={(e) => handleDragStart(e, 'cognitive', 'Decision Policy')} className="p-2 bg-slate-800 rounded border border-slate-700 text-sm flex items-center gap-2 cursor-grab active:cursor-grabbing"><Share2 size={14} className="text-indigo-400" /> Decision Policy</div>
               </div>
             </div>
             
             <div>
               <div className="text-xs text-slate-500 mb-2 font-medium">OUTPUTS</div>
               <div className="space-y-2">
                 <div draggable onDragStart={(e) => handleDragStart(e, 'output', 'Evaluation')} className="p-2 bg-slate-800 rounded border border-slate-700 text-sm flex items-center gap-2 cursor-grab active:cursor-grabbing"><Activity size={14} className="text-emerald-400" /> Evaluation</div>
                 <div draggable onDragStart={(e) => handleDragStart(e, 'output', 'Actions')} className="p-2 bg-slate-800 rounded border border-slate-700 text-sm flex items-center gap-2 cursor-grab active:cursor-grabbing"><Monitor size={14} className="text-emerald-400" /> Actions</div>
               </div>
             </div>
          </div>
        </div>
        
        <div 
          className="flex-1 bg-slate-950 relative overflow-hidden flex items-center justify-center"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
           {/* Mockup Canvas */}
           <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
           
           <div className="relative z-10 flex flex-col items-center gap-8 min-h-full py-12 overflow-y-auto w-full">
              {nodes.map((node, index) => (
                  <React.Fragment key={node.id}>
                      <div className={`w-48 p-3 bg-slate-900 border ${node.type === 'input' ? 'border-slate-700' : node.type === 'cognitive' ? 'border-indigo-500/50 bg-indigo-900/50' : 'border-emerald-500/50 bg-emerald-900/10'} rounded-lg shadow-lg flex items-center justify-between gap-3 group relative cursor-pointer hover:border-indigo-400 transition-colors`}>
                         <div className="flex items-center gap-3">
                           <node.icon size={18} className={node.type === 'input' ? 'text-slate-400' : node.type === 'cognitive' ? 'text-indigo-400' : 'text-emerald-400'} />
                           <span className="text-sm font-medium truncate">{node.label}</span>
                         </div>
                         <button onClick={() => setNodes(nodes.filter(n => n.id !== node.id))} className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            &times;
                         </button>
                      </div>
                      {index < nodes.length - 1 && <div className="w-0.5 h-8 bg-slate-700"></div>}
                  </React.Fragment>
              ))}
              
              {nodes.length === 0 && (
                  <div className="text-slate-500 text-sm border-2 border-dashed border-slate-700 p-8 rounded-xl flex flex-col items-center">
                      <Target size={32} className="mb-2 opacity-50" />
                      Drag and drop blocks here to build a mission
                  </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}

function MissionControlView({ onLaunchNew }: { onLaunchNew: () => void }) {
  const missions = useHyperMindStore(state => state.missions) || [];
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-200">Active Missions</h2>
          <p className="text-sm text-slate-400">Monitoring real-time cognitive execution</p>
        </div>
        <button onClick={onLaunchNew} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded shadow">
          Launch New Mission
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1 min-h-0 overflow-y-auto pb-8">
        {missions.length === 0 ? (
          <div className="col-span-1 xl:col-span-2 text-slate-500 italic p-6">No active missions running.</div>
        ) : missions.map(m => (
            <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <h3 className="font-medium text-slate-200">{m.name}</h3>
                </div>
                <div className="text-xs px-2 py-1 bg-slate-800 text-slate-300 rounded">Status: {m.status}</div>
              </div>
              
              <div className="p-4 grid grid-cols-1 gap-4 flex-1">
                <div className="space-y-4">
                  <div className="bg-slate-950 p-3 rounded border border-slate-800">
                    <div className="text-xs text-slate-500 mb-1">Current Cognitive State</div>
                    <div className="text-indigo-400 text-sm font-medium flex items-center gap-2">
                       <BrainCircuit size={14} /> Active
                    </div>
                  </div>
                  
                  <div className="bg-slate-950 p-3 rounded border border-slate-800">
                    <div className="text-xs text-slate-500 mb-2">Metrics</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">HII</span>
                        <span className="text-emerald-400">{m.hii ? Number(m.hii).toFixed(1) : 0}%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">LLM Dependency</span>
                        <span className="text-amber-400">{m.llmDependency ? Number(m.llmDependency).toFixed(2) : 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        ))}
      </div>
    </div>
  );
}

function DashboardView({ metrics, hii, missions }: any) {
  if (!metrics || !hii) return <div className="text-slate-400 animate-pulse">Loading Mission Metrics...</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard title="Engine Status" value={metrics.engineStatus || "ONLINE"} trend={null} icon={Power} />
        <MetricCard title="Overall Intelligence (HII)" value={((hii?.overallIntelligence || 0) * 100).toFixed(1) + '%'} trend="+1.2%" icon={BrainCircuit} />
        <MetricCard title="Mission Success Rate" value={((hii?.metrics?.missionSuccessRate || 0) * 100).toFixed(1) + '%'} trend="+0.5%" icon={Target} />
        <MetricCard title="Active Missions" value={metrics.activeMissions} trend={null} icon={Play} />
        <MetricCard title="Active Plans" value={metrics.activePlans || 0} trend={null} icon={ListTree} />
        <MetricCard title="HCNS Throughput" value={metrics.hcnsThroughput + ' ev/s'} trend="+120" icon={Activity} />
      </div>

      <LiveCognitivePipelineView />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2"><Monitor size={18} className="text-indigo-400"/> Running Missions</h3>
            <div className="space-y-3">
              {missions?.map((m: any) => (
                <div key={m.id} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-lg border border-slate-800/50">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="font-medium text-slate-200">{m.name}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-slate-400">ID: {m.id}</span>
                    <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded">HII: {(m.hii || 0).toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-medium mb-4">Resource Utilization</h3>
            <div className="grid grid-cols-3 gap-4">
              <UsageBar label="CPU" percentage={metrics.cpuUsage} color="bg-blue-500" />
              <UsageBar label="GPU" percentage={metrics.gpuUsage} color="bg-purple-500" />
              <UsageBar label="Memory" percentage={metrics.memoryUsage} color="bg-emerald-500" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-medium mb-6">Subsystem HII Breakdown</h3>
          <div className="space-y-4">
            {Object.entries(hii.subsystems).map(([key, val]: any) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize text-slate-400">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="font-medium">{(val * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5">
                  <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${val * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-slate-800">
             <div className="flex justify-between items-center">
                <span className="text-slate-400">Certification</span>
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Award size={16} /> {hii.certificationLevel}
                </span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, icon: Icon }: any) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <span className="text-slate-400 text-sm">{title}</span>
        <Icon size={18} className="text-slate-500" />
      </div>
      <div className="flex items-end gap-3 mt-auto">
        <span className="text-2xl font-bold text-slate-100">{value}</span>
        {trend && <span className="text-emerald-400 text-sm mb-1">{trend}</span>}
      </div>
    </div>
  );
}

function UsageBar({ label, percentage, color }: any) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-400">{label}</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full bg-slate-950 rounded-full h-2">
        <div className={`${color} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}

function VideoStream({ isScreen }: { isScreen: boolean }) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  
  React.useEffect(() => {
    let stream: MediaStream;
    async function init() {
      try {
        if (isScreen) {
          stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        } else {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing media:", err);
      }
    }
    init();
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [isScreen]);

  return <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />;
}

function LiveInputsView() {
  const [inputs, setInputs] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newInputName, setNewInputName] = useState("");
  const [newInputUrl, setNewInputUrl] = useState("");
  const [newInputType, setNewInputType] = useState("RTSP");

  const handleAdd = () => {
    let url = newInputUrl;
    if (newInputType === 'Webcam') url = 'local://webcam';
    if (newInputType === 'Screen Capture') url = 'local://screen';
    
    if (newInputName && url) {
      setInputs([
        ...inputs,
        {
          id: Date.now(),
          name: newInputName,
          type: newInputType,
          fps: 30,
          latency: 25,
          status: "Connected",
          url: url
        }
      ]);
      setNewInputName("");
      setNewInputUrl("");
      setShowAdd(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-200">Live Inputs</h2>
          <p className="text-sm text-slate-400">Manage real-time sensors and data streams</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded shadow flex items-center gap-2">
           + Add Input Stream
        </button>
      </div>

      {showAdd && (
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-end gap-4 mb-6">
           <div className="flex-1">
             <label className="block text-xs text-slate-400 mb-1">Stream Name</label>
             <input value={newInputName} onChange={e => setNewInputName(e.target.value)} type="text" className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500" placeholder="e.g. Lobby Camera" />
           </div>
           <div className="flex-1">
             <label className="block text-xs text-slate-400 mb-1">URL / Endpoint (leave blank for webcam/screen)</label>
             <input value={newInputUrl} onChange={e => setNewInputUrl(e.target.value)} type="text" className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500" placeholder="rtsp://... or https://..." />
           </div>
           <div className="w-32">
             <label className="block text-xs text-slate-400 mb-1">Type</label>
             <select value={newInputType} onChange={e => setNewInputType(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500">
               <option>RTSP</option>
               <option>WebSocket</option>
               <option>WebRTC</option>
               <option>API</option>
               <option>Webcam</option>
               <option>Screen Capture</option>
             </select>
           </div>
           <div className="flex gap-2">
             <button onClick={() => setShowAdd(false)} className="px-4 py-1.5 border border-slate-700 text-slate-300 rounded text-sm hover:bg-slate-800">Cancel</button>
             <button onClick={handleAdd} className="px-4 py-1.5 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-500">Connect</button>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {inputs.map((input) => (
          <div key={input.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
            <div className="h-48 bg-slate-950 relative flex items-center justify-center border-b border-slate-800 overflow-hidden group">
              {(input.url === 'local://webcam' || input.url === 'local://screen') ? (
                  <VideoStream isScreen={input.url === 'local://screen'} />
              ) : (
                  <Camera size={32} className="text-slate-800" />
              )}
              <div className="absolute inset-0 bg-indigo-500/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="bg-slate-900/90 text-xs px-3 py-1.5 rounded font-mono text-slate-300 backdrop-blur-sm border border-slate-700 truncate max-w-[90%]">
                    {input.url}
                 </div>
              </div>
              <div className="absolute top-2 right-2 px-2 py-1 bg-slate-900/80 rounded text-xs border border-slate-700">
                {input.type}
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-medium text-slate-200 mb-3">{input.name}</h4>
              <div className="flex justify-between text-sm text-slate-400">
                <span>FPS: {input.fps}</span>
                <span>Latency: {input.latency}ms</span>
                <span className={input.status === 'Connected' ? 'text-emerald-400' : 'text-amber-400'}>{input.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function WorldModelView({ diagnostics }: any) {
  const entities = diagnostics?.worldModel?.entities?.length || 0;
  const relations = diagnostics?.worldModel?.relationships?.length || 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl h-full flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-slate-950 to-slate-950"></div>
        <Globe size={48} className="text-indigo-700 mb-4" />
        <h3 className="text-lg font-medium text-slate-300">World Model Graph Visualization</h3>
        <p className="text-slate-500 text-sm mt-2">Currently tracking {entities} entities and {relations} relationships.</p>
    </div>
  );
}

