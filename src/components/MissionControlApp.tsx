import React, { useState, useEffect } from "react";
import { 
  Activity, Monitor, LayoutDashboard, Search, Camera, Globe, 
  BrainCircuit, GitCommit, GitMerge, FileText, Share2, 
  Target, BarChart3, Settings, Play, Database, Award, 
  GitBranch, FlaskConical, Map, LineChart, BookOpen, Layers
} from "lucide-react";
import { safeFetchJSON } from "../fetchUtils";
import { ConceptGraphView } from "./mission/ConceptGraphView";
import { ThoughtExplorerView } from "./mission/ThoughtExplorerView";
import { ReasoningExplorerView } from "./mission/ReasoningExplorerView";
import { DecisionCenterView } from "./mission/DecisionCenterView";
import { LearningCenterView } from "./mission/LearningCenterView";
import { AnalyticsView } from "./mission/AnalyticsView";
import { PluginManagerView, ReportsView, LeaderboardView, BenchmarkView, RegressionView, SettingsView } from "./mission/OtherViews";

export function MissionControlApp() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [metrics, setMetrics] = useState<any>(null);
  const [hii, setHii] = useState<any>(null);
  const [missions, setMissions] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const dbRes = await safeFetchJSON("/api/hml/dashboard");
      if (dbRes) setMetrics(dbRes);

      const hiiRes = await safeFetchJSON("/api/hml/hii");
      if (hiiRes) setHii(hiiRes);

      const misRes = await safeFetchJSON("/api/hml/missions");
      if (misRes) setMissions(misRes);
    } catch (e) {
      console.error(e);
    }
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "mission_control", label: "Mission Control", icon: Target },
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
    { id: "settings", label: "Settings", icon: Settings }
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
              v2.0 HII: {hii?.overallIntelligence ? (hii.overallIntelligence * 100).toFixed(1) + '%' : 'CALCULATING...'}
            </div>
          </div>
        </div>

        {/* Dynamic Canvas */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'dashboard' && <DashboardView metrics={metrics} hii={hii} missions={missions} />}
          {activeTab === 'mission_control' && <MissionControlView />}
          {activeTab === 'mission_builder' && <MissionBuilderView />}
          {activeTab === 'live_inputs' && <LiveInputsView />}
          {activeTab === 'simulation_center' && <SimulationCenterView />}
          {activeTab === 'world_model' && <WorldModelView />}
          {activeTab === 'replay' && <ReplayCenterView />}
          {activeTab === 'concept_graph' && <ConceptGraphView />}
          {activeTab === 'thought_explorer' && <ThoughtExplorerView />}
          {activeTab === 'reasoning_explorer' && <ReasoningExplorerView />}
          {activeTab === 'decision_center' && <DecisionCenterView />}
          {activeTab === 'learning_center' && <LearningCenterView />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'plugin_manager' && <PluginManagerView />}
          {activeTab === 'reports' && <ReportsView />}
          {activeTab === 'leaderboard' && <LeaderboardView />}
          {activeTab === 'benchmark' && <BenchmarkView />}
          {activeTab === 'regression' && <RegressionView />}
          {activeTab === 'settings' && <SettingsView />}
          
          {/* Fallback for other tabs */}
          {['dashboard', 'mission_control', 'mission_builder', 'live_inputs', 'simulation_center', 'world_model', 'replay', 'concept_graph', 'thought_explorer', 'reasoning_explorer', 'decision_center', 'learning_center', 'analytics', 'plugin_manager', 'reports', 'leaderboard', 'benchmark', 'regression', 'settings'].indexOf(activeTab) === -1 && (
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
  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-200">Mission Builder</h2>
          <p className="text-sm text-slate-400">Drag-and-drop visual mission orchestration</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded shadow">
             Save Draft
           </button>
           <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded shadow flex items-center gap-2">
             <Play size={14} /> Deploy Mission
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
                 <div className="p-2 bg-slate-800 rounded border border-slate-700 text-sm flex items-center gap-2 cursor-grab"><Camera size={14} className="text-slate-400" /> Camera Feed</div>
                 <div className="p-2 bg-slate-800 rounded border border-slate-700 text-sm flex items-center gap-2 cursor-grab"><Globe size={14} className="text-slate-400" /> API Stream</div>
                 <div className="p-2 bg-slate-800 rounded border border-slate-700 text-sm flex items-center gap-2 cursor-grab"><Database size={14} className="text-slate-400" /> Dataset</div>
               </div>
             </div>
             
             <div>
               <div className="text-xs text-slate-500 mb-2 font-medium">COGNITIVE BLOCKS</div>
               <div className="space-y-2">
                 <div className="p-2 bg-slate-800 rounded border border-slate-700 text-sm flex items-center gap-2 cursor-grab"><Target size={14} className="text-indigo-400" /> Set Goal</div>
                 <div className="p-2 bg-slate-800 rounded border border-slate-700 text-sm flex items-center gap-2 cursor-grab"><Layers size={14} className="text-indigo-400" /> Simulation Config</div>
                 <div className="p-2 bg-slate-800 rounded border border-slate-700 text-sm flex items-center gap-2 cursor-grab"><Share2 size={14} className="text-indigo-400" /> Decision Policy</div>
               </div>
             </div>
             
             <div>
               <div className="text-xs text-slate-500 mb-2 font-medium">OUTPUTS</div>
               <div className="space-y-2">
                 <div className="p-2 bg-slate-800 rounded border border-slate-700 text-sm flex items-center gap-2 cursor-grab"><Activity size={14} className="text-emerald-400" /> Evaluation</div>
                 <div className="p-2 bg-slate-800 rounded border border-slate-700 text-sm flex items-center gap-2 cursor-grab"><Monitor size={14} className="text-emerald-400" /> Actions</div>
               </div>
             </div>
          </div>
        </div>
        
        <div className="flex-1 bg-slate-950 relative overflow-hidden flex items-center justify-center">
           {/* Mockup Canvas */}
           <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
           
           <div className="relative z-10 flex flex-col items-center gap-8">
              <div className="w-48 p-3 bg-slate-900 border border-slate-700 rounded-lg shadow-lg flex items-center gap-3">
                 <Camera size={18} className="text-slate-400" />
                 <span className="text-sm font-medium">RTSP: Warehouse</span>
              </div>
              
              <div className="w-0.5 h-8 bg-slate-700"></div>
              
              <div className="w-48 p-3 bg-indigo-900/50 border border-indigo-500/50 rounded-lg shadow-lg flex items-center gap-3">
                 <Target size={18} className="text-indigo-400" />
                 <span className="text-sm font-medium">Goal: Detect Anomalies</span>
              </div>
              
              <div className="w-0.5 h-8 bg-slate-700"></div>
              
              <div className="w-48 p-3 bg-slate-900 border border-emerald-500/50 rounded-lg shadow-lg flex items-center gap-3">
                 <Activity size={18} className="text-emerald-400" />
                 <span className="text-sm font-medium">Eval: Safety Standard</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function MissionControlView() {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-200">Active Missions</h2>
          <p className="text-sm text-slate-400">Monitoring real-time cognitive execution</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded shadow">
          Launch New Mission
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1 min-h-0 overflow-y-auto pb-8">
        {/* Active Mission 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <h3 className="font-medium text-slate-200">Traffic Optimization (gc-traffic-01)</h3>
            </div>
            <div className="text-xs px-2 py-1 bg-slate-800 text-slate-300 rounded">Running: 01:23:45</div>
          </div>
          
          <div className="p-4 grid grid-cols-2 gap-4 flex-1">
            <div className="bg-slate-950 rounded border border-slate-800 flex items-center justify-center relative overflow-hidden">
              {/* Fake video feed */}
              <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center flex-col">
                 <Camera size={24} className="text-slate-700 mb-2" />
                 <span className="text-xs text-slate-500">Live Traffic Feed</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-slate-950 p-3 rounded border border-slate-800">
                <div className="text-xs text-slate-500 mb-1">Current Cognitive State</div>
                <div className="text-indigo-400 text-sm font-medium flex items-center gap-2">
                   <BrainCircuit size={14} /> Planning Action Sequence
                </div>
              </div>
              
              <div className="bg-slate-950 p-3 rounded border border-slate-800">
                <div className="text-xs text-slate-500 mb-2">Subsystem Confidence</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Perception</span>
                    <span className="text-emerald-400">98%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1"><div className="bg-emerald-500 h-1 rounded-full" style={{width: '98%'}}></div></div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Reasoning</span>
                    <span className="text-indigo-400">85%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1"><div className="bg-indigo-500 h-1 rounded-full" style={{width: '85%'}}></div></div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-950 border-t border-slate-800 text-xs font-mono text-slate-500 overflow-hidden h-24 flex flex-col justify-end">
            <div>&gt; [HCNS] Entity Detected: Vehicle (Conf: 0.99)</div>
            <div>&gt; [HCNS] Update World Model: Intersection Node 42</div>
            <div>&gt; [HCNS] Goal Eval: Maximize Throughput</div>
            <div className="text-indigo-400">&gt; [HCNS] Thought: "Congestion forming on Northbound lane, altering signal timing..."</div>
          </div>
        </div>

        {/* Active Mission 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <h3 className="font-medium text-slate-200">Medicine Verification (gc-medicine-01)</h3>
            </div>
            <div className="text-xs px-2 py-1 bg-slate-800 text-slate-300 rounded">Running: 00:45:12</div>
          </div>
          
          <div className="p-4 grid grid-cols-2 gap-4 flex-1">
            <div className="bg-slate-950 rounded border border-slate-800 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center flex-col">
                 <Camera size={24} className="text-slate-700 mb-2" />
                 <span className="text-xs text-slate-500">Medicine Tray Feed</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-slate-950 p-3 rounded border border-slate-800">
                <div className="text-xs text-slate-500 mb-1">Current Cognitive State</div>
                <div className="text-emerald-400 text-sm font-medium flex items-center gap-2">
                   <Target size={14} /> Concept Matching
                </div>
              </div>
              
              <div className="bg-slate-950 p-3 rounded border border-slate-800">
                <div className="text-xs text-slate-500 mb-2">Subsystem Confidence</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Perception</span>
                    <span className="text-emerald-400">99%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1"><div className="bg-emerald-500 h-1 rounded-full" style={{width: '99%'}}></div></div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Reasoning</span>
                    <span className="text-emerald-400">92%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1"><div className="bg-emerald-500 h-1 rounded-full" style={{width: '92%'}}></div></div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-950 border-t border-slate-800 text-xs font-mono text-slate-500 overflow-hidden h-24 flex flex-col justify-end">
            <div>&gt; [HCNS] OCR Read: "Amoxicillin 500mg"</div>
            <div>&gt; [HCNS] Invoice Match: Confirmed</div>
            <div>&gt; [HCNS] Pill Count: 30/30 Detected</div>
            <div className="text-emerald-400">&gt; [HCNS] Decision: PASS TRAY</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardView({ metrics, hii, missions }: any) {
  if (!metrics || !hii) return <div className="text-slate-400 animate-pulse">Loading Mission Metrics...</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Overall Intelligence (HII)" value={(hii.overallIntelligence * 100).toFixed(1) + '%'} trend="+1.2%" icon={BrainCircuit} />
        <MetricCard title="Mission Success Rate" value={(hii.metrics.missionSuccessRate * 100).toFixed(1) + '%'} trend="+0.5%" icon={Target} />
        <MetricCard title="Active Missions" value={metrics.activeMissions} trend={null} icon={Play} />
        <MetricCard title="HCNS Throughput" value={metrics.hcnsThroughput + ' ev/s'} trend="+120" icon={Activity} />
      </div>

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
                    <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded">HII: {m.hii.toFixed(1)}%</span>
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

function LiveInputsView() {
  const inputs = [
    { name: "Traffic Camera 1", type: "RTSP", fps: 30, latency: 45, status: "Connected" },
    { name: "Traffic Camera 2", type: "RTSP", fps: 24, latency: 120, status: "Degraded" },
    { name: "Warehouse Drone", type: "WebSocket", fps: 60, latency: 15, status: "Connected" },
    { name: "Desktop Agent", type: "API", fps: '--', latency: 8, status: "Connected" }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {inputs.map((input, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
            <div className="h-48 bg-slate-950 relative flex items-center justify-center border-b border-slate-800">
              <Camera size={32} className="text-slate-800" />
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

function SimulationCenterView() {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[400px]">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col">
          <h4 className="text-slate-400 text-sm mb-4">Canonical World</h4>
          <div className="flex-1 border border-slate-800 rounded bg-slate-950 flex items-center justify-center text-slate-600">
             Ground Truth State
          </div>
        </div>
        <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-4 flex flex-col ring-1 ring-indigo-500/50">
          <h4 className="text-indigo-400 text-sm mb-4">Simulation 1 (High Probability)</h4>
          <div className="flex-1 border border-indigo-900 rounded bg-slate-950 flex flex-col items-center justify-center text-slate-500 space-y-2">
             <Layers size={32} className="text-indigo-500/50" />
             <div className="text-xs">Projected Success: 94%</div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col">
          <h4 className="text-slate-400 text-sm mb-4">Simulation 2 (Edge Case)</h4>
          <div className="flex-1 border border-slate-800 rounded bg-slate-950 flex items-center justify-center text-slate-600">
             Alternative Timeline
          </div>
        </div>
      </div>
    </div>
  );
}

function WorldModelView() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl h-full flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-slate-950 to-slate-950"></div>
        <Globe size={48} className="text-slate-700 mb-4" />
        <h3 className="text-lg font-medium text-slate-300">World Model Graph Visualization</h3>
        <p className="text-slate-500 text-sm mt-2">Entities, Relationships, and Event Timelines.</p>
    </div>
  );
}

function ReplayCenterView() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl h-full flex flex-col">
      <div className="flex-1 p-6 flex items-center justify-center bg-slate-950 rounded-t-xl">
        <Play size={48} className="text-slate-800" />
      </div>
      <div className="h-24 bg-slate-900 p-4 border-t border-slate-800 rounded-b-xl flex flex-col justify-center">
        <div className="w-full h-2 bg-slate-800 rounded-full mb-4 relative cursor-pointer">
          <div className="absolute left-0 top-0 bottom-0 bg-indigo-500 w-1/3 rounded-full"></div>
          <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow border-2 border-indigo-500"></div>
        </div>
        <div className="flex items-center justify-between text-slate-400 text-sm">
          <div className="flex gap-4">
             <button className="hover:text-slate-200">Rewind</button>
             <button className="hover:text-slate-200">Play</button>
             <button className="hover:text-slate-200">Forward</button>
          </div>
          <span>00:14:32 / 01:45:00</span>
        </div>
      </div>
    </div>
  );
}
