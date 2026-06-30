import React, { useState, useEffect } from "react";
import { Activity, Beaker, BrainCircuit, Play, Shield, Zap, Network, FlaskConical, Globe, Server, Users, Microscope, Eye, Scale, Trophy, Cpu, Database } from "lucide-react";
import { EvolutionDashboard } from "./components/EvolutionDashboard";
import { KnowledgeGraphDashboard } from "./components/KnowledgeGraphDashboard";
import { ResearchDashboard } from "./components/ResearchDashboard";
import { AutonomousDashboard } from "./components/AutonomousDashboard";
import { PersistentBrainDashboard } from "./components/PersistentBrainDashboard";
import { WorldModelDashboard } from "./components/WorldModelDashboard";
import { CognitiveDashboard } from "./components/CognitiveDashboard";
import { ExecutiveDashboard } from "./components/ExecutiveDashboard";
import { LearningDashboard } from "./components/LearningDashboard";
import { SocietyDashboard } from "./components/SocietyDashboard";
import { DiscoveryDashboard } from "./components/DiscoveryDashboard";
import { MissionReportDashboard } from "./components/MissionReportDashboard";
import { EmbodiedDashboard } from "./components/EmbodiedDashboard";
import { DigitalTwinDashboard } from "./components/DigitalTwinDashboard";
import { TheoryOfMindDashboard } from "./components/TheoryOfMindDashboard";
import { CommonSenseDashboard } from "./components/CommonSenseDashboard";
import { IntelligenceDashboard } from "./components/IntelligenceDashboard";
import { CollectiveIntelligenceDashboard } from "./components/CollectiveIntelligenceDashboard";
import { SocialIntelligenceDashboard } from "./components/SocialIntelligenceDashboard";
import { CognitiveCoreView } from "./components/CognitiveCoreView";
import { KnowledgeDashboard } from "./components/KnowledgeDashboard";
import MetaCognitionDashboard from "./components/MetaCognitionDashboard";
import { CognitiveCycleDashboard } from "./components/CognitiveCycleDashboard";

import { CognitiveAutopsyView } from "./components/CognitiveAutopsyView";
import { GoalLoopDashboard } from "./components/GoalLoopDashboard";
import { CognitiveGenomeDashboard } from "./components/CognitiveGenomeDashboard";

import { safeFetchJSON } from "./fetchUtils";

export default function App() {
  const [missions, setMissions] = useState<any[]>([]);
  const [newMission, setNewMission] = useState("");
  const [simulationMode, setSimulationMode] = useState("realistic");
  const [missionMode, setMissionMode] = useState("balanced");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"missions" | "evolution" | "knowledge_graph" | "research" | "autonomous" | "brain" | "world" | "cognitive" | "executive" | "learning" | "society" | "discovery" | "embodied" | "digital_twin" | "theory_of_mind" | "common_sense" | "intelligence" | "collective" | "social" | "core" | "meta" | "cycle" | "autopsy" | "loop" | "genome">("missions");

  const [showDeveloper, setShowDeveloper] = useState(false);

  const [agentVersions, setAgentVersions] = useState<any>({});
  const [agentPerformances, setAgentPerformances] = useState<any[]>([]);
  const [evolving, setEvolving] = useState(false);
  const [missionStage, setMissionStage] = useState("");

  const fetchMissions = async () => {
    try {
      const data = await safeFetchJSON("/missions", {}, []);
      if (Array.isArray(data)) {
        setMissions(data);
      } else {
        setMissions([]);
      }
      setError("");
    } catch (err) {
      setError("Could not connect to the Backend. Ensure the FastAPI server is running.");
    }
  };

  const fetchEvolutionData = async () => {
    try {
      const [vRes, pRes] = await Promise.all([
        safeFetchJSON("/agents/versions", {}, {}),
        safeFetchJSON("/agents/performance", {}, [])
      ]);
      setAgentVersions(vRes);
      setAgentPerformances(pRes);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMissions();
    fetchEvolutionData();
  }, []);

  useEffect(() => {
     if (loading) {
         const interval = setInterval(async () => {
             try {
                const res = await safeFetchJSON("/api/mission/status", {}, { stage: "" });
                if (res.stage && res.stage !== "idle") setMissionStage(res.stage);
             } catch(e) { /* ignore */ }
         }, 1000);
         return () => clearInterval(interval);
     } else {
         setMissionStage("");
     }
  }, [loading]);

  const handleEvolve = async () => {
    setEvolving(true);
    try {
      await fetch("/agents/evolve", { method: "POST" });
      await fetchEvolutionData();
    } catch(e) {
      console.error(e);
    }
    setEvolving(false);
  };

  const handleLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMission.trim()) return;
    
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/mission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mission_text: newMission, simulation_mode: simulationMode, mission_mode: missionMode }),
      });
      let d: any = {};
      try {
        const text = await res.text();
        d = text ? JSON.parse(text) : {};
      } catch (e) {
        // ignore json parse error
      }
      if (!res.ok) {
        throw new Error(d?.detail || "Launch failed");
      }
      setNewMission("");
      fetchMissions();
      fetchEvolutionData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-300 font-sans selection:bg-blue-500/30">
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        <header className="space-y-4">
          <div className="flex items-center space-x-3 text-blue-500 mb-2">
            <Zap className="w-5 h-5" />
            <span className="text-sm font-bold tracking-wider uppercase">HyperMind-X Control Panel</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-2">
                {activeTab === 'missions' ? 'Mission Command' : activeTab === 'evolution' ? 'Evolution Engine' : activeTab === 'research' ? 'Research Scientist' : activeTab === 'autonomous' ? 'Autonomous Loop' : activeTab === 'brain' ? 'Persistent Cognitive Brain' : activeTab === 'world' ? 'World Model Engine' : activeTab === 'cognitive' ? 'Cognitive Architecture' : activeTab === 'executive' ? 'Executive Function' : activeTab === 'learning' ? 'Autonomous Learning' : activeTab === 'society' ? 'Multi-Agent Society' : activeTab === 'discovery' ? 'Scientific Discovery' : 'Knowledge Graph Brain'}
              </h1>
              <p className="text-lg text-slate-400">
                {activeTab === 'missions' ? 'Define high-level objectives. The multi-agent system will decompose, assign, and execute them.' : activeTab === 'evolution' ? 'Track agent performance and evolve system prompts based on mission outcomes.' : activeTab === 'research' ? 'Formulate hypotheses, design experiments, and generate scientific reports.' : activeTab === 'autonomous' ? 'Identify knowledge gaps and autonomously pursue follow-up research.' : activeTab === 'brain' ? 'System memory, beliefs, and concept structures evolving over time.' : activeTab === 'world' ? 'Simulate future worlds and evaluate strategic interventions.' : activeTab === 'cognitive' ? 'Internal reasoning, autonomous goals, planning, and meta-reflection.' : activeTab === 'executive' ? 'Task prioritization, dependency management, and dynamic resource allocation.' : activeTab === 'learning' ? 'Extract reusable skills from missions, replay past missions, and track learning progress.' : activeTab === 'society' ? 'Hundreds of agents collaborating, forming teams, voting, and negotiating.' : activeTab === 'discovery' ? 'Generate hypotheses, test alternative explanations, and document findings across disciplines.' : 'A self-assembling network of entities, concepts, and relationships extracted from completed missions.'}
              </p>
            </div>
            <div className="flex justify-end mb-4 w-full">
              <button 
                onClick={() => setShowDeveloper(!showDeveloper)}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors border border-slate-700"
              >
                <Server className="w-3.5 h-3.5" />
                {showDeveloper ? "Hide Developer Tabs" : "Show Developer Tabs"}
              </button>
            </div>
            {showDeveloper && (
              <div className="flex flex-wrap gap-1 bg-[#111] p-1 rounded-xl border border-slate-800">
              <button 
                onClick={() => setActiveTab("missions")} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "missions" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"}`}
              >
                Missions
              </button>
              <button 
                onClick={() => setActiveTab("evolution")} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "evolution" ? "bg-purple-900/50 text-purple-200" : "text-slate-400 hover:text-purple-300"}`}
              >
                <BrainCircuit className="w-4 h-4" />
                Evolution Engine
              </button>
              <button 
                onClick={() => setActiveTab("knowledge_graph")} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "knowledge_graph" ? "bg-cyan-900/50 text-cyan-200" : "text-slate-400 hover:text-cyan-300"}`}
              >
                <Network className="w-4 h-4" />
                Knowledge Graph
              </button>
              <button 
                onClick={() => setActiveTab("research")} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "research" ? "bg-indigo-900/50 text-indigo-200" : "text-slate-400 hover:text-indigo-300"}`}
              >
                <FlaskConical className="w-4 h-4" />
                Research Scientist
              </button>
              <button 
                onClick={() => setActiveTab("autonomous")} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "autonomous" ? "bg-yellow-900/50 text-yellow-200" : "text-slate-400 hover:text-yellow-300"}`}
              >
                <Activity className="w-4 h-4" />
                Autonomous Loop
              </button>
              <button 
                onClick={() => setActiveTab("brain")} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "brain" ? "bg-emerald-900/50 text-emerald-200" : "text-slate-400 hover:text-emerald-300"}`}
              >
                <BrainCircuit className="w-4 h-4" />
                Persistent Brain
              </button>
              <button 
                onClick={() => setActiveTab("world")} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "world" ? "bg-blue-900/50 text-blue-200" : "text-slate-400 hover:text-blue-300"}`}
              >
                <Globe className="w-4 h-4" />
                World Model
              </button>
              <button 
                onClick={() => setActiveTab("cognitive")} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "cognitive" ? "bg-purple-900/50 text-purple-200" : "text-slate-400 hover:text-purple-300"}`}
              >
                <BrainCircuit className="w-4 h-4" />
                Cognitive Engine
              </button>
              <button 
                onClick={() => setActiveTab("meta")} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "meta" ? "bg-fuchsia-900/50 text-fuchsia-200" : "text-slate-400 hover:text-fuchsia-300"}`}
              >
                <Cpu className="w-4 h-4" />
                Meta-Cognition
              </button>
              <button 
                onClick={() => setActiveTab("executive")} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "executive" ? "bg-indigo-900/50 text-indigo-200" : "text-slate-400 hover:text-indigo-300"}`}
              >
                <Server className="w-4 h-4" />
                Executive
              </button>
              <button 
                onClick={() => setActiveTab("learning")} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "learning" ? "bg-pink-900/50 text-pink-200" : "text-slate-400 hover:text-pink-300"}`}
              >
                <FlaskConical className="w-4 h-4" />
                Learning
              </button>
              <button 
                onClick={() => setActiveTab("society")} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "society" ? "bg-blue-900/50 text-blue-200" : "text-slate-400 hover:text-blue-300"}`}
              >
                <Users className="w-4 h-4" />
                Society
              </button>
              <button 
                onClick={() => setActiveTab("discovery")} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "discovery" ? "bg-indigo-900/50 text-indigo-200" : "text-slate-400 hover:text-indigo-300"}`}
              >
                <Microscope className="w-4 h-4" />
                Discovery
              </button>
              <button 
                onClick={() => setActiveTab("cycle")} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "cycle" ? "bg-orange-900/50 text-orange-200" : "text-slate-400 hover:text-orange-300"}`}
              >
                <Activity className="w-4 h-4" />
                Cognitive Cycle
              </button>
              <button 
                onClick={() => setActiveTab("autopsy")} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "autopsy" ? "bg-red-900/50 text-red-200" : "text-slate-400 hover:text-red-300"}`}
              >
                <Activity className="w-4 h-4" />
                Cognitive Autopsy
              </button>
              <button 
                onClick={() => setActiveTab("loop")} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "loop" ? "bg-indigo-900/50 text-indigo-200" : "text-slate-400 hover:text-indigo-300"}`}
              >
                <Activity className="w-4 h-4" />
                Goal Loop
              </button>
              <button 
                onClick={() => setActiveTab("embodied")} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "embodied" ? "bg-emerald-900/50 text-emerald-200" : "text-slate-400 hover:text-emerald-300"}`}
              >
                <Eye className="w-4 h-4" />
                Embodied
              </button>
              <button 
                onClick={() => setActiveTab("digital_twin")} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "digital_twin" ? "bg-blue-900/50 text-blue-200" : "text-slate-400 hover:text-blue-300"}`}
              >
                <Globe className="w-4 h-4" />
                Digital Twin
              </button>
              <button 
                onClick={() => setActiveTab("genome")} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "genome" ? "bg-fuchsia-900/50 text-fuchsia-200" : "text-slate-400 hover:text-fuchsia-300"}`}
              >
                <Network className="w-4 h-4" />
                Cognitive Genome
              </button>
              <button 
                onClick={() => setActiveTab("theory_of_mind")} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "theory_of_mind" ? "bg-fuchsia-900/50 text-fuchsia-200" : "text-slate-400 hover:text-fuchsia-300"}`}
              >
                <BrainCircuit className="w-4 h-4" />
                Theory of Mind
              </button>
              <button 
                onClick={() => setActiveTab("common_sense")} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "common_sense" ? "bg-amber-900/50 text-amber-200" : "text-slate-400 hover:text-amber-300"}`}
              >
                <Scale className="w-4 h-4" />
                Common Sense
              </button>
              <button 
                onClick={() => setActiveTab("intelligence")} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "intelligence" ? "bg-red-900/50 text-red-200" : "text-slate-400 hover:text-red-300"}`}
              >
                <Trophy className="w-4 h-4" />
                Intelligence
              </button>
              <button 
                onClick={() => setActiveTab("collective")} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "collective" ? "bg-indigo-900/50 text-indigo-200" : "text-slate-400 hover:text-indigo-300"}`}
              >
                <Network className="w-4 h-4" />
                Collective
              </button>
              <button 
                onClick={() => setActiveTab("social")} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "social" ? "bg-pink-900/50 text-pink-200" : "text-slate-400 hover:text-pink-300"}`}
              >
                <Users className="w-4 h-4" />
                Social
              </button>
              <button 
                onClick={() => setActiveTab("core")} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "core" ? "bg-purple-900/50 text-purple-200" : "text-slate-400 hover:text-purple-300"}`}
              >
                <Cpu className="w-4 h-4" />
                Cognitive Core
              </button>
              <button 
                onClick={() => setActiveTab("knowledge")} 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === "knowledge" ? "bg-emerald-900/50 text-emerald-200" : "text-slate-400 hover:text-emerald-300"}`}
              >
                <Database className="w-4 h-4" />
                Knowledge
              </button>
            </div>
            )}
          </div>
        </header>

        {error && (
          <div className="bg-red-900/20 border border-red-900/50 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {activeTab === "evolution" ? (
          <EvolutionDashboard 
             agentVersions={agentVersions} 
             agentPerformances={agentPerformances} 
             evolving={evolving} 
             handleEvolve={handleEvolve} 
             mission={missions[0] || null}
          />
        ) : activeTab === "knowledge_graph" ? (
          <KnowledgeGraphDashboard mission={missions[0] || null} />
        ) : activeTab === "research" ? (
          <ResearchDashboard simulationMode={simulationMode} setSimulationMode={setSimulationMode} mission={missions[0] || null} />
        ) : activeTab === "autonomous" ? (
          <AutonomousDashboard mission={missions[0] || null} />
        ) : activeTab === "brain" ? (
          <PersistentBrainDashboard mission={missions[0] || null} />
        ) : activeTab === "world" ? (
          <WorldModelDashboard mission={missions[0] || null} />
        ) : activeTab === "meta" ? (
          <MetaCognitionDashboard />
        ) : activeTab === "cognitive" ? (
          <CognitiveDashboard mission={missions[0] || null} />
        ) : activeTab === "executive" ? (
          <ExecutiveDashboard mission={missions[0] || null} />
        ) : activeTab === "learning" ? (
          <LearningDashboard mission={missions[0] || null} />
        ) : activeTab === "society" ? (
          <SocietyDashboard mission={missions[0] || null} />
        ) : activeTab === "discovery" ? (
          <DiscoveryDashboard mission={missions[0] || null} />
        ) : activeTab === "embodied" ? (
          <EmbodiedDashboard mission={missions[0] || null} />
        ) : activeTab === "digital_twin" ? (
          <DigitalTwinDashboard mission={missions[0] || null} />
        ) : activeTab === "theory_of_mind" ? (
          <TheoryOfMindDashboard mission={missions[0] || null} />
        ) : activeTab === "common_sense" ? (
          <CommonSenseDashboard mission={missions[0] || null} />
        ) : activeTab === "intelligence" ? (
          <IntelligenceDashboard />
        ) : activeTab === "collective" ? (
          <CollectiveIntelligenceDashboard mission={missions[0] || null} />
        ) : activeTab === "social" ? (
          <SocialIntelligenceDashboard />
        ) : activeTab === "core" ? (
          <CognitiveCoreView />
        ) : activeTab === "knowledge" ? (
          <KnowledgeDashboard mission={missions[0] || null} />
        ) : activeTab === "cycle" ? (
          <CognitiveCycleDashboard missionId={missions[0]?.mission_id || ""} />
        ) : activeTab === "autopsy" ? (
          <CognitiveAutopsyView 
            autopsy={{
              mission_id: missions[0]?.mission_id || "M-101",
              mission_name: missions[0]?.mission || "Example Failed Mission",
              status: "FAILURE",
              timestamp: Date.now(),
              goals: {
                primary: "Analyze market trends",
                secondary: ["Identify key players", "Forecast next 5 years"],
                alignment: 45
              },
              reasoning: {
                assumptions: ["Data is publicly available", "Competitors haven't launched yet"],
                logic_chain: [
                  "If data is public, we can scrape it",
                  "If we scrape it, we can analyze it",
                  "If we analyze it, we can forecast"
                ],
                flaws_identified: ["Failed to account for IP blocking", "Competitors already launched shadow products"]
              },
              planning: {
                selected_strategy: "Web scraping and NLP analysis",
                alternatives_considered: ["Purchase dataset", "Manual analysis"],
                execution_steps: [
                  { step: "Initialize scrapers", status: "COMPLETED" },
                  { step: "Bypass captchas", status: "FAILED", error: "Captcha solving service timeout" },
                  { step: "Analyze data", status: "SKIPPED" }
                ]
              },
              outcome: {
                actual_result: "Mission aborted due to captcha block.",
                metrics: { pages_scraped: 50, captchas_failed: 120, time_elapsed: 12 },
                unintended_consequences: ["IP address temporarily banned from target domain"]
              },
              root_cause: {
                primary_cause: "Over-reliance on brittle web scraping without proxy rotation.",
                contributing_factors: ["Captcha service downtime", "Aggressive rate limits"],
                recommended_system_update: "Implement robust proxy rotation pool and fallback to alternative data sources when blocked."
              }
            }} 
          />
        ) : activeTab === "loop" ? (
          <GoalLoopDashboard />
        ) : activeTab === "genome" ? (
          <CognitiveGenomeDashboard />
        ) : (
          <>
            <form onSubmit={handleLaunch} className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-1 gap-4">
                <input
                  type="text"
                  value={newMission}
                  onChange={(e) => setNewMission(e.target.value)}
                  placeholder="E.g., Analyze the impact of quantum computing on modern cryptography..."
                  className="flex-1 bg-[#111111] border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  disabled={loading}
                />
                <select
                  value={missionMode}
                  onChange={(e) => setMissionMode(e.target.value)}
                  className="bg-[#111111] border border-slate-800 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-blue-500 transition-colors"
                  disabled={loading}
                >
                  <option value="fast">Fast</option>
                  <option value="balanced">Balanced</option>
                  <option value="deep">Deep</option>
                  <option value="research">Research</option>
                  <option value="simulation">Simulation</option>
                </select>
                <select
                  value={simulationMode}
                  onChange={(e) => setSimulationMode(e.target.value)}
                  className="bg-[#111111] border border-slate-800 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-blue-500 transition-colors"
                  disabled={loading}
                >
                  <option value="realistic">Realistic</option>
                  <option value="futuristic">Futuristic</option>
                  <option value="sci_fi">Sci-Fi</option>
                  <option value="business">Business</option>
                  <option value="scientific">Scientific</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading || !newMission.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed justify-center"
              >
                {loading ? (
                  <Activity className="w-5 h-5 animate-pulse" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
                <span>{loading ? "Engage Agents" : "Launch"}</span>
              </button>
            </form>

            {loading && missionStage && (
               <div className="bg-blue-900/20 border border-blue-900/50 p-4 rounded-xl flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Activity className="w-5 h-5 text-blue-400 animate-spin" />
                      <span className="text-blue-200 font-medium">{missionStage}</span>
                   </div>
                   <div className="text-xs text-blue-500 uppercase tracking-widest font-bold animate-pulse">Running Pipeline</div>
               </div>
            )}

                        <section className="space-y-6 mt-8">
              <MissionReportDashboard mission={missions[0] || null} />
            </section>
        </>
        )}
      </div>
    </div>
  );
}
