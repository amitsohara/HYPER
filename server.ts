import cors from "cors";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  const missions: any[] = [];
  const researchReports: any[] = [];
  
  const researchQueue: any[] = [];
  const knowledgeGaps: any[] = [];
  let autonomousStatus = { active: false, maxDepth: 3, maxMissions: 5, currentDepth: 0, currentMissions: 0 };
  
  // Agent Evolution Store
  const agentStore: Record<string, any> = {
    "Researcher": { version: 1, prompt: "A data-driven analyst focusing on empirical logic.", history: [] },
    "Optimist": { version: 1, prompt: "A visionary who sees positive potential and opportunities.", history: [] },
    "Pessimist": { version: 1, prompt: "A skeptic who identifies flaws, risks, and failure modes.", history: [] },
    "Economist": { version: 1, prompt: "A pragmatic thinker focused on resource allocation constraints.", history: [] },
    "Ethics": { version: 1, prompt: "A moral compass evaluating societal and human impact.", history: [] },
    "Critic": { version: 1, prompt: "A harsh reviewer demanding logical rigor and challenging assumptions.", history: [] }
  };
  const agentPerformances: any[] = [];

  const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;
  const { kgInstance } = await import("./src/server/knowledge_graph.js").catch(e => import("./src/server/knowledge_graph.ts"));

  // API routes FIRST
  app.get("/knowledge-graph", (req, res) => {
    res.json(kgInstance.exportGraph());
  });

  app.get("/missions", (req, res) => {
    res.json(missions);
  });
  
  app.get("/agents/versions", (req, res) => {
    res.json(agentStore);
  });
  
  app.get("/agents/performance", (req, res) => {
    res.json(agentPerformances);
  });
  
  app.post("/agents/evolve", async (req, res) => {
    if (!ai) return res.status(500).json({ error: "No AI" });
    const { EvolutionEngine } = await import("./src/server/evolution.js").catch(e => import("./src/server/evolution.ts"));
    
    // Find weak agents (avg score < 85 across their last 3 performances)
    const agentStats: Record<string, any[]> = {};
    Object.keys(agentStore).forEach(agent => agentStats[agent] = agentPerformances.filter(p => p.agent_name === agent));
    
    const weakAgentsData: any[] = [];
    Object.keys(agentStats).forEach(agent => {
        const perfs = agentStats[agent].slice(0, 3); // latest 3
        if (perfs.length > 0) {
            const avgQuality = perfs.reduce((a, b) => a + (b.output_quality_score || 0), 0) / perfs.length;
            const avgReasoning = perfs.reduce((a, b) => a + (b.reasoning_score || 0), 0) / perfs.length;
            const avgUsefulness = perfs.reduce((a, b) => a + (b.usefulness_score || 0), 0) / perfs.length;
            const overall = (avgQuality + avgReasoning + avgUsefulness) / 3;
            
            if (overall < 85) { 
                weakAgentsData.push({
                    agent_name: agent,
                    current_prompt: agentStore[agent].prompt,
                    average_score: overall,
                    recent_weaknesses: perfs.map(p => p.weakness_detected),
                    recent_suggestions: perfs.map(p => p.improvement_suggestion)
                });
            }
        }
    });

    if (weakAgentsData.length === 0) {
        return res.json({ message: "No weak agents identified at this time.", evolved_agents: [], agentStore });
    }

    const evolved = await EvolutionEngine.evolveAgentPrompts(ai, agentStore, weakAgentsData);
    const evolvedList: any[] = [];
    
    if (Array.isArray(evolved)) {
        evolved.forEach((e: any) => {
            if (agentStore[e.agent_name]) {
                const oldPrompt = agentStore[e.agent_name].prompt;
                const oldVersion = agentStore[e.agent_name].version;
                agentStore[e.agent_name].history.push({
                    version: oldVersion,
                    prompt: oldPrompt,
                    reason_for_change: e.reason_for_change,
                    timestamp: new Date().toISOString()
                });
                agentStore[e.agent_name].prompt = e.new_prompt;
                agentStore[e.agent_name].version += 1;
                evolvedList.push({
                    agent_name: e.agent_name,
                    old_prompt: oldPrompt,
                    new_prompt: e.new_prompt,
                    new_version: oldVersion + 1,
                    reason: e.reason_for_change
                });
            }
        });
    }

    res.json({ message: "Evolution complete.", evolved_agents: evolvedList, agentStore });
  });

  app.get("/research/reports", (req, res) => {
    res.json(researchReports);
  });

  app.get("/research/report/:id", (req, res) => {
    const report = researchReports.find(r => r.id === req.params.id);
    if (!report) return res.status(404).json({ error: "Not found" });
    res.json(report);
  });

  app.get("/research/queue", (req, res) => {
    res.json(researchQueue);
  });

  app.get("/research/gaps", (req, res) => {
    res.json(knowledgeGaps);
  });

  app.get("/research/autonomous/status", (req, res) => {
    res.json(autonomousStatus);
  });

  app.post("/research/autonomous/start", (req, res) => {
    const hasPending = researchQueue.some(q => q.status === "pending" && q.depth <= autonomousStatus.maxDepth);
    if (!hasPending && autonomousStatus.currentMissions === 0) {
        return res.status(400).json({ error: "Queue is empty. Please run a manual research mission first to generate follow-up questions." });
    }
    autonomousStatus.active = true;
    autonomousStatus.currentMissions = 0;
    autonomousStatus.currentDepth = 0;
    res.json(autonomousStatus);
    // Kick off background loop if needed
    runAutonomousLoop().catch(console.error);
  });

  app.post("/research/autonomous/stop", (req, res) => {
    autonomousStatus.active = false;
    res.json(autonomousStatus);
  });

  const performResearch = async (mission_text: string, simulation_mode: string = "realistic", depth: number = 0) => {
    const research_id = ""+Math.random().toString(36).substring(7);
    if (!ai) throw new Error("No AI");
    
    // We import from engines early to use the retry logic
    const { DynamicWorldGenerator, AgentDebateEngine, DiscoveryEngine, generateWithRetry, cleanJSON } = await import("./src/server/engines.js").catch(e => {
        return import("./src/server/engines.ts");
    });
    const { ResearchEngine } = await import("./src/server/research.js").catch(e => {
        return import("./src/server/research.ts");
    });

    // Memory Reuse
    let memoryContext = "No relevant past memories.";
    let reused_memories: string[] = [];
    if (missions.length > 0) {
      try {
        const memoryRes = await generateWithRetry(ai, {
           model: 'gemini-3.1-flash-lite',
           contents: `Given the new research mission "${mission_text}", review these past missions and their lessons. Return ONLY a JSON object with:\n{\n  "relevant_lessons": "Summarized relevant lessons / improvements. Say 'None' if completely unrelated.",\n  "reused_mission_ids": ["array of mission_ids that had relevant info"]\n}\nPast missions: ${JSON.stringify(missions.map(m => ({ id: m.mission_id, mission: m.mission_text, improvement_log: m.improvement_log || {} })))}`,
           config: { responseMimeType: "application/json" }
        });
        const memObj = await cleanJSON(memoryRes?.text || "{}", ai);
        if (memObj && memObj.relevant_lessons && memObj.relevant_lessons !== "None") {
           memoryContext = memObj.relevant_lessons;
           reused_memories = memObj.reused_mission_ids || [];
        }
      } catch(e) {
          console.error("Memory retrieval failed", e);
      }
    }

    // Knowledge Graph Search
    const kgSearch = await kgInstance.search(ai, mission_text);
    const kgContext = `Graph Insights: ${kgSearch.insights}\nConcepts: ${kgSearch.related_concepts.join(", ")}`;
    
    // Persistent Brain Context Reconstruction
    const { PersistentBrain } = await import("./src/server/brain/persistent_brain.js").catch(e => import("./src/server/brain/persistent_brain.ts"));
    const brainContext = await PersistentBrain.reconstructContext(ai, mission_text);
    
    const combinedMemoryContext = `${memoryContext}\nKnowledge Graph Context: ${kgContext}\nCognitive Brain Context: ${brainContext}`;

    // 1. Research Question Generator, Hypotheses, Evidence Planner, Experiment Designer
    const plan = await ResearchEngine.planResearch(ai, mission_text, memoryContext, kgContext);
    
    // 2. Synthetic Experiments (Worlds/Scenarios for testing)
    const worlds = await DynamicWorldGenerator.generate(ai, mission_text, simulation_mode, combinedMemoryContext);
    const topWorlds = worlds.slice(0, 10);
    
    // 3. Agent Debate
    const scenarios = await AgentDebateEngine.run(ai, mission_text, topWorlds, simulation_mode, combinedMemoryContext, Object.keys(agentStore).map(k => ({ name: k, prompt: agentStore[k].prompt })));
    
    // 4. Discovery Engine
    const discovery = await DiscoveryEngine.discover(ai, mission_text, scenarios, simulation_mode, combinedMemoryContext);

    // 5. Research Reporter
    const finalReportData = await ResearchEngine.generateReport(ai, mission_text, plan, scenarios, discovery);

    const reportFull = {
      id: research_id,
      mission_text,
      simulation_mode,
      memoryContext,
      kgContext,
      kgSearch,
      reused_memories,
      plan,
      worlds,
      scenarios,
      discovery,
      finalReportData,
      timestamp: new Date().toISOString(),
      depth
    };

    researchReports.unshift(reportFull);
    // Update Knowledge Graph asynchronously
    kgInstance.update(ai, { ...reportFull, goals: plan.research_questions }).catch(e => console.error("KG Update Failed", e));

    // Autonomous Follow-up Generation
    const { AutonomousResearchEngine } = await import("./src/server/autonomous.js").catch(e => import("./src/server/autonomous.ts"));
    const autoGaps = await AutonomousResearchEngine.identifyGapsAndFollowUps(ai, reportFull);
    
    // Cognitive Brain Mission Consolidation
    await PersistentBrain.processMissionComplete(ai, reportFull);
    
    if (autoGaps.knowledge_gaps && autoGaps.knowledge_gaps.length > 0) {
        knowledgeGaps.unshift({
            mission_id: research_id,
            gaps: autoGaps.knowledge_gaps,
            weak_assumptions: autoGaps.weak_assumptions,
            unanswered_questions: autoGaps.unanswered_questions,
            timestamp: new Date().toISOString()
        });
        
        // Trigger Cognitive Architecture Goal Generation
        import("./src/server/cognitive/cognitive_architecture.js").catch(e => import("./src/server/cognitive/cognitive_architecture.ts")).then(({ CognitiveArchitecture }) => {
            CognitiveArchitecture.generateGoalsFromGaps(ai, autoGaps.knowledge_gaps).then(goals => {
                // Also trigger planning for the first goal as an example
                if (goals.length > 0) {
                    CognitiveArchitecture.planMultiStepTask(ai, goals[0]);
                }
            });
        });
    }

    if (autoGaps.follow_up_questions && autoGaps.follow_up_questions.length > 0) {
        autoGaps.follow_up_questions.forEach((q: any) => {
            researchQueue.push({
                ...q,
                source_mission_id: research_id,
                status: "pending",
                depth: depth + 1,
                added_at: new Date().toISOString()
            });
        });
        // Sort queue by priority and value
        researchQueue.sort((a, b) => ((b.priority_score + b.research_value_score) - (a.priority_score + a.research_value_score)));
    }
    
    return reportFull;
  };

  const runAutonomousLoop = async () => {
     while (autonomousStatus.active && autonomousStatus.currentMissions < autonomousStatus.maxMissions) {
        const nextTaskIndex = researchQueue.findIndex(q => q.status === "pending" && q.depth <= autonomousStatus.maxDepth);
        if (nextTaskIndex === -1) {
            console.log("No more tasks within depth limits.");
            autonomousStatus.active = false;
            break;
        }
        
        const task = researchQueue[nextTaskIndex];
        // Mark running
        researchQueue[nextTaskIndex].status = "running";
        
        try {
            console.log("Autonomous executing:", task.question);
            await performResearch(task.question, "futuristic", task.depth);
            researchQueue[nextTaskIndex].status = "completed";
            autonomousStatus.currentMissions++;
        } catch(e) {
            console.error("Auto loop error:", e);
            researchQueue[nextTaskIndex].status = "failed";
        }
        // Small pause 
        await new Promise(r => setTimeout(r, 2000));
     }
     autonomousStatus.active = false;
  };

  // --- BRAIN API ROUTES ---
  app.get("/brain/db", async (req, res) => {
     const { PersistentBrain } = await import("./src/server/brain/persistent_brain.js").catch(e => import("./src/server/brain/persistent_brain.ts"));
     res.json(await PersistentBrain.getDB());
  });
  
  app.get("/brain/beliefs", async (req, res) => {
     const { PersistentBrain } = await import("./src/server/brain/persistent_brain.js").catch(e => import("./src/server/brain/persistent_brain.ts"));
     res.json((await PersistentBrain.getDB()).beliefs);
  });
  
  app.get("/brain/timeline", async (req, res) => {
     const { PersistentBrain } = await import("./src/server/brain/persistent_brain.js").catch(e => import("./src/server/brain/persistent_brain.ts"));
     res.json((await PersistentBrain.getDB()).episodic);
  });
  
  app.get("/brain/concepts", async (req, res) => {
     const { PersistentBrain } = await import("./src/server/brain/persistent_brain.js").catch(e => import("./src/server/brain/persistent_brain.ts"));
     res.json((await PersistentBrain.getDB()).concepts);
  });

  const simStore: any[] = [];
  app.post("/simulate/future", async (req, res) => {
    if (!ai) return res.status(500).json({ error: "No AI" });
    const { WorldModelEngine } = await import("./src/server/world/world_model.js").catch(e => import("./src/server/world/world_model.ts"));
    const data = await WorldModelEngine.simulateFuture(ai, req.body);
    if (!data.id) data.id = "sim_" + Math.random().toString(36).substring(7);
    simStore.push(data);
    res.json(data);
  });
  
  app.get("/simulation/results/:id", (req, res) => {
    const data = simStore.find(s => s.id === req.params.id);
    if (data) res.json(data);
    else res.status(404).json({ error: "Not found" });
  });

  app.get("/cognitive/state", async (req, res) => {
    const { CognitiveArchitecture } = await import("./src/server/cognitive/cognitive_architecture.js").catch(e => import("./src/server/cognitive/cognitive_architecture.ts"));
    res.json(await CognitiveArchitecture.getState());
  });

  app.get("/executive/state", async (req, res) => {
    const { ExecutiveFunction } = await import("./src/server/executive/executive_function.js").catch(e => import("./src/server/executive/executive_function.ts"));
    res.json(await ExecutiveFunction.getState());
  });

  app.post("/executive/pause/:id", async (req, res) => {
    const { ExecutiveFunction } = await import("./src/server/executive/executive_function.js").catch(e => import("./src/server/executive/executive_function.ts"));
    await ExecutiveFunction.pauseTask(req.params.id);
    res.json({ success: true });
  });

  app.post("/executive/resume/:id", async (req, res) => {
    const { ExecutiveFunction } = await import("./src/server/executive/executive_function.js").catch(e => import("./src/server/executive/executive_function.ts"));
    await ExecutiveFunction.resumeTask(req.params.id);
    res.json({ success: true });
  });

  // NEW ENDPOINTS FROM PHASE 13-15
  app.post("/cognitive/run", async (req, res) => {
      // Trigger a cognitive run manually
      res.json({ status: "Cognitive run initiated." });
  });

  app.get("/cognitive/beliefs", async (req, res) => {
      const { CognitiveArchitecture } = await import("./src/server/cognitive/cognitive_architecture.js").catch(e => import("./src/server/cognitive/cognitive_architecture.ts"));
      const state = await CognitiveArchitecture.getState();
      res.json({ beliefs: state.beliefs });
  });

  app.post("/cognitive/beliefs/update", async (req, res) => {
      res.json({ status: "Manual belief update not supported. Only AI can update beliefs." });
  });

  app.get("/cognitive/goals", async (req, res) => {
      const { CognitiveArchitecture } = await import("./src/server/cognitive/cognitive_architecture.js").catch(e => import("./src/server/cognitive/cognitive_architecture.ts"));
      const state = await CognitiveArchitecture.getState();
      res.json({ goals: state.goals });
  });

  app.get("/cognitive/plans", async (req, res) => {
      const { CognitiveArchitecture } = await import("./src/server/cognitive/cognitive_architecture.js").catch(e => import("./src/server/cognitive/cognitive_architecture.ts"));
      const state = await CognitiveArchitecture.getState();
      res.json({ plans: state.plans });
  });

  app.post("/tasks/create", async (req, res) => {
      const { ExecutiveFunction } = await import("./src/server/executive/executive_function.js").catch(e => import("./src/server/executive/executive_function.ts"));
      const task = await ExecutiveFunction.submitTask(req.body);
      res.json({ success: true, task });
  });

  app.get("/tasks", async (req, res) => {
      const { ExecutiveFunction } = await import("./src/server/executive/executive_function.js").catch(e => import("./src/server/executive/executive_function.ts"));
      res.json({ tasks: await ExecutiveFunction.getTasks() });
  });

  app.post("/tasks/:id/run", async (req, res) => {
      const { ExecutiveFunction } = await import("./src/server/executive/executive_function.js").catch(e => import("./src/server/executive/executive_function.ts"));
      await ExecutiveFunction.resumeTask(req.params.id);
      res.json({ success: true });
  });

  app.post("/tasks/:id/pause", async (req, res) => {
      const { ExecutiveFunction } = await import("./src/server/executive/executive_function.js").catch(e => import("./src/server/executive/executive_function.ts"));
      await ExecutiveFunction.pauseTask(req.params.id);
      res.json({ success: true });
  });

  app.post("/tasks/:id/complete", async (req, res) => {
      const { ExecutiveFunction } = await import("./src/server/executive/executive_function.js").catch(e => import("./src/server/executive/executive_function.ts"));
      await ExecutiveFunction.completeTask(req.params.id);
      res.json({ success: true });
  });

  app.get("/learning/skills", async (req, res) => {
      const { AutonomousLearningEngine } = await import("./src/server/learning/autonomous_learning.js").catch(e => import("./src/server/learning/autonomous_learning.ts"));
      res.json({ skills: await AutonomousLearningEngine.getSkills() });
  });

  app.post("/learning/extract", async (req, res) => {
      const { AutonomousLearningEngine } = await import("./src/server/learning/autonomous_learning.js").catch(e => import("./src/server/learning/autonomous_learning.ts"));
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const skill = await AutonomousLearningEngine.extractSkill(ai, req.body.mission || { mission_text: "Manual extraction" });
      res.json({ success: true, skill });
  });

  app.post("/learning/replay", async (req, res) => {
    const { AutonomousLearningEngine } = await import("./src/server/learning/autonomous_learning.js").catch(e => import("./src/server/learning/autonomous_learning.ts"));
    // Replay a random past mission
    const replay = await AutonomousLearningEngine.replayMission("mission_" + Math.random().toString(36).substring(7));
    res.json({ success: true, replay });
  });

  app.get("/learning/progress", async (req, res) => {
      const { AutonomousLearningEngine } = await import("./src/server/learning/autonomous_learning.js").catch(e => import("./src/server/learning/autonomous_learning.ts"));
      res.json({ progress: await AutonomousLearningEngine.getProgress() });
  });

  app.get("/society/state", async (req, res) => {
    const { MultiAgentSociety } = await import("./src/server/society/multi_agent_society.js").catch(e => import("./src/server/society/multi_agent_society.ts"));
    res.json(await MultiAgentSociety.getState());
  });

  app.post("/society/vote", async (req, res) => {
    const { MultiAgentSociety } = await import("./src/server/society/multi_agent_society.js").catch(e => import("./src/server/society/multi_agent_society.ts"));
    await MultiAgentSociety.holdVote(req.body.proposal);
    res.json({ success: true });
  });

  app.post("/society/negotiate", async (req, res) => {
    const { MultiAgentSociety } = await import("./src/server/society/multi_agent_society.js").catch(e => import("./src/server/society/multi_agent_society.ts"));
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    await MultiAgentSociety.simulateNegotiation(ai, req.body.issue);
    res.json({ success: true });
  });

  app.get("/discovery/state", async (req, res) => {
    const { ScientificDiscoveryPlatform } = await import("./src/server/discovery/scientific_discovery.js").catch(e => import("./src/server/discovery/scientific_discovery.ts"));
    res.json(await ScientificDiscoveryPlatform.getState());
  });

  app.post("/discovery/run", async (req, res) => {
    const { ScientificDiscoveryPlatform } = await import("./src/server/discovery/scientific_discovery.js").catch(e => import("./src/server/discovery/scientific_discovery.ts"));
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    await ScientificDiscoveryPlatform.discover(ai, req.body.topic, req.body.discipline);
    res.json({ success: true });
  });

  app.post("/research/run", async (req, res) => {
    const { mission_text, simulation_mode = "realistic" } = req.body;
    try {
        const report = await performResearch(mission_text, simulation_mode, 0);
        res.json(report);
    } catch(e: any) {
        res.status(500).json({ error: e.message || "Failed" });
    }
  });

  app.post("/mission", async (req, res) => {
    const { mission_text, simulation_mode = "realistic" } = req.body;
    const mission_id = Math.random().toString(36).substring(7);
    
    if (!ai) {
      return res.status(500).json({ error: "Gemini API key is missing. No AI engine available." });
    }

    // We import from engines early to use the retry logic
    const { DynamicWorldGenerator, AgentDebateEngine, CriticScoringEngine, DiscoveryEngine, generateWithRetry, cleanJSON } = await import("./src/server/engines.js").catch(e => {
        return import("./src/server/engines.ts");
    });
    
    // Memory Reuse
    let memoryContext = "No relevant past memories.";
    let reused_memories: string[] = [];
    if (missions.length > 0) {
      try {
        const memoryRes = await generateWithRetry(ai, {
           model: 'gemini-3.1-flash-lite',
           contents: `Given the new mission "${mission_text}", review these past missions and their lessons. Return ONLY a JSON object with:
{
  "relevant_lessons": "Summarized relevant lessons / improvements. Say 'None' if completely unrelated.",
  "reused_mission_ids": ["array of mission_ids that had relevant info"]
}
Past missions: ${JSON.stringify(missions.map(m => ({ id: m.mission_id, mission: m.mission_text, improvement_log: m.improvement_log || {} })))}`,
           config: { responseMimeType: "application/json" }
        });
        const memObj = await cleanJSON(memoryRes?.text || "{}", ai);
        
        if (memObj && memObj.relevant_lessons && memObj.relevant_lessons !== "None") {
           memoryContext = memObj.relevant_lessons;
           reused_memories = memObj.reused_mission_ids || [];
        }
      } catch(e) {
          console.error("Memory retrieval failed", e);
      }
    }

    // Knowledge Graph Search
    const kgSearch = await kgInstance.search(ai, mission_text);
    const kgContext = `Graph Insights: ${kgSearch.insights}\nConcepts: ${kgSearch.related_concepts.join(", ")}`;
    
    // Persistent Brain Context Reconstruction
    const { PersistentBrain } = await import("./src/server/brain/persistent_brain.js").catch(e => import("./src/server/brain/persistent_brain.ts"));
    const brainContext = await PersistentBrain.reconstructContext(ai, mission_text);
    
    // We combine memory and knowledge graph insights securely:
    const combinedMemoryContext = `${memoryContext}\nKnowledge Graph Context: ${kgContext}\nCognitive Brain Context: ${brainContext}`;

    // 1. Generate Goals
    let goals: string[] = [];

    try {
      const goalsRes = await generateWithRetry(ai, {
         model: 'gemini-3.1-flash-lite',
         contents: `Break this mission into 3-5 specific, actionable goals. Mission: "${mission_text}". 
Simulation Mode: ${simulation_mode}
Relevant Past Lessons and Insights: ${combinedMemoryContext}
Return ONLY a JSON array of strings.`,
         config: { responseMimeType: "application/json" }
      });
      const text = goalsRes?.text || "[]";
      goals = await cleanJSON(text, ai) || [];
    } catch(e) {
      console.error("Goals generation failed", e);
    }

    // 2. Dynamic Worlds (10)
    const worlds = await DynamicWorldGenerator.generate(ai, mission_text, simulation_mode, combinedMemoryContext);

    // 3. Agents Debate (Pick top 10 worlds to match prompt)
    const topWorlds = worlds.slice(0, 10);
    const scenarios = await AgentDebateEngine.run(ai, mission_text, topWorlds, simulation_mode, combinedMemoryContext, Object.keys(agentStore).map(k => ({ name: k, prompt: agentStore[k].prompt })));

    // 4. Critic Scoring
    const scores = await CriticScoringEngine.scoreAll(ai, scenarios, simulation_mode, combinedMemoryContext);
    scenarios.forEach((s: any, i: number) => {
       const scoreData = scores[i] || {};
       s.score = scoreData.final_score || 0;
       s.detailed_scores = scoreData;
    });

    scenarios.sort((a: any, b: any) => (b.score || 0) - (a.score || 0));
    const best_solution = scenarios[0] || {
      world: "No world generated",
      scenario: "No scenario generated",
      solution: "No solution reached",
      score: 0,
      debates: []
    };

    // 5. Discovery Engine
    const discovery = await DiscoveryEngine.discover(ai, mission_text, scenarios, simulation_mode, combinedMemoryContext);

    // 6. Improvement Log / Reflection
    let improvement_log = { what_worked: "N/A", what_failed: "N/A", next_improvement: "N/A", confidence_score: 0 };
    try {
       const reflectRes = await generateWithRetry(ai, {
         model: 'gemini-3.1-flash-lite',
         contents: `Based on the best solution for mission "${mission_text}" (World: "${best_solution?.world || "unknown"}"), what worked well, what failed or needs improvement, what is the next step to improve, and what is your overall confidence score (0-100)?
Simulation Mode: ${simulation_mode}
Return ONLY a JSON object with strictly these keys: "what_worked" (string), "what_failed" (string), "next_improvement" (string), "confidence_score" (number).`,
         config: { responseMimeType: "application/json" }
       });
       const text = reflectRes?.text || "{}";
       const parsedLog = await cleanJSON(text, ai);
       if (parsedLog && typeof parsedLog === 'object') {
           improvement_log = { ...improvement_log, ...parsedLog };
       }
    } catch(e) {
      console.error("Reflection generation failed", e);
    }

    const evaluation = {
      quality_score: best_solution?.score || 0,
      feedback: best_solution?.detailed_scores?.feedback || "Completed evaluation."
    }
    
    // Evaluate agent performance
    const { EvolutionEngine } = await import("./src/server/evolution.js").catch(e => import("./src/server/evolution.ts"));
    const perfEval = await EvolutionEngine.evaluateAgents(ai, mission_text, best_solution?.debates || []);
    if (Array.isArray(perfEval) && perfEval.length > 0) {
        perfEval.forEach(p => {
             agentPerformances.unshift({
                  ...p,
                  mission_id,
                  timestamp: new Date().toISOString()
             });
        });
    }

    const mission = {
      mission_id,
      mission_text,
      simulation_mode,
      kg_insights: kgSearch,
      reused_memories,
      improvement_log,
      goals: goals,
      discovery,
      synthetic_worlds: worlds,
      scenario_results: scenarios,
      best_solution: best_solution,
      assigned_agents: best_solution?.debates?.map((d: any) => d.agent) || [],
      debate_log: best_solution?.debates || [],
      // Preserving old keys for backward compatibility in UI just in case
      scenarios: scenarios,
      agents: best_solution?.debates?.map((d: any) => ({ agent_type: d.agent, output: d.argument })) || [],
      evaluation: evaluation,
      lessons_learned: improvement_log.what_worked,
      next_improvement: improvement_log.next_improvement,
      reflection: { lessons_learned: improvement_log.what_worked, improvement_suggestion: improvement_log.next_improvement }
    };
    missions.unshift(mission);
    res.json(mission);
    
    // Cognitive Brain Mission Consolidation
    PersistentBrain.processMissionComplete(ai, { ...mission, finalReportData: { executive_summary: mission.improvement_log.what_worked, key_findings: mission.discovery } }).catch(e => console.error(e));
    
    // Cognitive Architecture Reflection & Update
    import("./src/server/cognitive/cognitive_architecture.js").catch(e => import("./src/server/cognitive/cognitive_architecture.ts")).then(({ CognitiveArchitecture }) => {
        CognitiveArchitecture.updateStateFromMission(ai, mission).then(() => {
             CognitiveArchitecture.reflectOnMission(ai, mission);
             CognitiveArchitecture.generateGoalsFromGaps(ai, ["Mission gap analysis", "Unknown variables"]).then(goals => {
                 if (goals && goals.length > 0) CognitiveArchitecture.planMultiStepTask(ai, goals[0]);
             });
        });
    });

    // Executive Function
    import("./src/server/executive/executive_function.js").catch(e => import("./src/server/executive/executive_function.ts")).then(({ ExecutiveFunction }) => {
        ExecutiveFunction.submitTask({
             name: `Follow-up on ${mission_id}`,
             description: `Analyze outcome of mission ${mission_id} and extract actionable items.`,
             priority: 80,
             estimated_difficulty: 6,
             expected_value: 70
        });
    });

    // Autonomous Learning Skill Extraction
    import("./src/server/learning/autonomous_learning.js").catch(e => import("./src/server/learning/autonomous_learning.ts")).then(({ AutonomousLearningEngine }) => {
        AutonomousLearningEngine.extractSkill(ai, mission);
        AutonomousLearningEngine.evaluateMission(ai, mission);
    });

    // Update Knowledge Graph asynchronously
    kgInstance.update(ai, mission).catch(e => console.error("KG Update Failed", e));
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
