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
  let autonomousStatus = {
    active: false,
    maxDepth: 3,
    maxMissions: 5,
    currentDepth: 0,
    currentMissions: 0,
  };

  // Agent Evolution Store
  const agentStore: Record<string, any> = {
    Researcher: {
      version: 1,
      prompt: "A data-driven analyst focusing on empirical logic.",
      history: [],
    },
    Optimist: {
      version: 1,
      prompt: "A visionary who sees positive potential and opportunities.",
      history: [],
    },
    Pessimist: {
      version: 1,
      prompt: "A skeptic who identifies flaws, risks, and failure modes.",
      history: [],
    },
    Economist: {
      version: 1,
      prompt: "A pragmatic thinker focused on resource allocation constraints.",
      history: [],
    },
    Ethics: {
      version: 1,
      prompt: "A moral compass evaluating societal and human impact.",
      history: [],
    },
    Critic: {
      version: 1,
      prompt:
        "A harsh reviewer demanding logical rigor and challenging assumptions.",
      history: [],
    },
  };
  const agentPerformances: any[] = [];

  const ai = process.env.GEMINI_API_KEY
    ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
    : (process.env.MODEL_MODE === "dev_stub" ? new GoogleGenAI({ apiKey: "dummy_dev_stub_key" }) : null);
  const { kgInstance } = await import("./src/server/knowledge_graph.js").catch(
    (e) => import("./src/server/knowledge_graph.ts"),
  );

  // API routes FIRST
  app.get("/knowledge-graph", (req, res) => {
    res.json(kgInstance.exportGraph());
  });

  app.get("/api/meta/mission", async (req, res) => {
    const { MasterOrchestrator } = await import("./src/server/core/master_orchestrator.js").catch(e => import("./src/server/core/master_orchestrator.ts"));
    res.json(MasterOrchestrator.currentMetaCognition?.understanding || {});
  });

  app.get("/api/meta/capabilities", async (req, res) => {
    const { MasterOrchestrator } = await import("./src/server/core/master_orchestrator.js").catch(e => import("./src/server/core/master_orchestrator.ts"));
    res.json(MasterOrchestrator.currentMetaCognition?.capabilities || []);
  });

  app.get("/api/meta/execution-plan", async (req, res) => {
    const { MasterOrchestrator } = await import("./src/server/core/master_orchestrator.js").catch(e => import("./src/server/core/master_orchestrator.ts"));
    res.json(MasterOrchestrator.currentMetaCognition?.execution_plan || {});
  });

  app.get("/api/meta/module-scores", async (req, res) => {
    const { MasterOrchestrator } = await import("./src/server/core/master_orchestrator.js").catch(e => import("./src/server/core/master_orchestrator.ts"));
    const cap = MasterOrchestrator.currentMetaCognition?.capabilities || [];
    res.json(cap.map((c: any) => ({
      module: c.module,
      utility_score: ((c.relevance_score || 0) + (c.contribution_score || 0)) / 2,
      relevance_score: c.relevance_score,
      contribution_score: c.contribution_score,
      expected_benefit: c.expected_benefit,
      confidence: c.confidence
    })));
  });

  app.get("/api/meta/mission-graph", async (req, res) => {
    const { MasterOrchestrator } = await import("./src/server/core/master_orchestrator.js").catch(e => import("./src/server/core/master_orchestrator.ts"));
    res.json(MasterOrchestrator.currentMetaCognition?.mission_graph || { nodes: [], edges: [] });
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
    const { EvolutionEngine } = await import("./src/server/evolution.js").catch(
      (e) => import("./src/server/evolution.ts"),
    );

    // Find weak agents (avg score < 85 across their last 3 performances)
    const agentStats: Record<string, any[]> = {};
    Object.keys(agentStore).forEach(
      (agent) =>
        (agentStats[agent] = agentPerformances.filter(
          (p) => p.agent_name === agent,
        )),
    );

    const weakAgentsData: any[] = [];
    Object.keys(agentStats).forEach((agent) => {
      const perfs = agentStats[agent].slice(0, 3); // latest 3
      if (perfs.length > 0) {
        const avgQuality =
          perfs.reduce((a, b) => a + (b.output_quality_score || 0), 0) /
          perfs.length;
        const avgReasoning =
          perfs.reduce((a, b) => a + (b.reasoning_score || 0), 0) /
          perfs.length;
        const avgUsefulness =
          perfs.reduce((a, b) => a + (b.usefulness_score || 0), 0) /
          perfs.length;
        const overall = (avgQuality + avgReasoning + avgUsefulness) / 3;

        if (overall < 85) {
          weakAgentsData.push({
            agent_name: agent,
            current_prompt: agentStore[agent].prompt,
            average_score: overall,
            recent_weaknesses: perfs.map((p) => p.weakness_detected),
            recent_suggestions: perfs.map((p) => p.improvement_suggestion),
          });
        }
      }
    });

    if (weakAgentsData.length === 0) {
      return res.json({
        message: "No weak agents identified at this time.",
        evolved_agents: [],
        agentStore,
      });
    }

    const evolved = await EvolutionEngine.evolveAgentPrompts(
      ai,
      agentStore,
      weakAgentsData,
    );
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
            timestamp: new Date().toISOString(),
          });
          agentStore[e.agent_name].prompt = e.new_prompt;
          agentStore[e.agent_name].version += 1;
          evolvedList.push({
            agent_name: e.agent_name,
            old_prompt: oldPrompt,
            new_prompt: e.new_prompt,
            new_version: oldVersion + 1,
            reason: e.reason_for_change,
          });
        }
      });
    }

    res.json({
      message: "Evolution complete.",
      evolved_agents: evolvedList,
      agentStore,
    });
  });

  app.get("/research/reports", (req, res) => {
    res.json(researchReports);
  });

  app.get("/research/report/:id", (req, res) => {
    const report = researchReports.find((r) => r.id === req.params.id);
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
    const hasPending = researchQueue.some(
      (q) => q.status === "pending" && q.depth <= autonomousStatus.maxDepth,
    );
    if (!hasPending && autonomousStatus.currentMissions === 0) {
      return res
        .status(400)
        .json({
          error:
            "Queue is empty. Please run a manual research mission first to generate follow-up questions.",
        });
    }
    autonomousStatus.active = true;
    autonomousStatus.currentMissions = 0;
    autonomousStatus.currentDepth = 0;
    res.json(autonomousStatus);
    // Kick off background loop if needed
    runAutonomousLoop().catch(console.warn);
  });

  app.post("/research/autonomous/stop", (req, res) => {
    autonomousStatus.active = false;
    res.json(autonomousStatus);
  });

  const performResearch = async (
    mission_text: string,
    simulation_mode: string = "realistic",
    depth: number = 0,
  ) => {
    const research_id = "" + Math.random().toString(36).substring(7);
    if (!ai) throw new Error("No AI");

    // We import from engines early to use the retry logic
    const {
      DynamicWorldGenerator,
      AgentDebateEngine,
      DiscoveryEngine,
      generateWithRetry,
      cleanJSON,
    } = await import("./src/server/engines.js").catch((e) => {
      return import("./src/server/engines.ts");
    });
    const { ResearchEngine } = await import("./src/server/research.js").catch(
      (e) => {
        return import("./src/server/research.ts");
      },
    );

    // Memory Reuse
    let memoryContext = "No relevant past memories.";
    let reused_memories: string[] = [];
    if (missions.length > 0) {
      try {
        const memoryRes = await generateWithRetry(ai, {
          model: "gemini-3.1-flash-lite",
          contents: `Given the new research mission "${mission_text}", review these past missions and their lessons. Return ONLY a JSON object with:\n{\n  "relevant_lessons": "Summarized relevant lessons / improvements. Say 'None' if completely unrelated.",\n  "reused_mission_ids": ["array of mission_ids that had relevant info"]\n}\nPast missions: ${JSON.stringify(missions.map((m) => ({ id: m.mission_id, mission: m.mission_text, improvement_log: m.improvement_log || {} })))}`,
          config: { responseMimeType: "application/json" },
        });
        const memObj = await cleanJSON(memoryRes?.text || "{}", ai);
        if (
          memObj &&
          memObj.relevant_lessons &&
          memObj.relevant_lessons !== "None"
        ) {
          memoryContext = memObj.relevant_lessons;
          reused_memories = memObj.reused_mission_ids || [];
        }
      } catch (e) {
        console.error("Memory retrieval failed", e);
      }
    }

    // Knowledge Graph Search
    const kgSearch = await kgInstance.search(ai, mission_text);
    const kgContext = `Graph Insights: ${kgSearch.insights}\nConcepts: ${kgSearch.related_concepts.join(", ")}`;

    // Persistent Brain Context Reconstruction
    const { PersistentBrain } =
      await import("./src/server/brain/persistent_brain.js").catch(
        (e) => import("./src/server/brain/persistent_brain.ts"),
      );
    const brainContext = await PersistentBrain.reconstructContext(
      ai,
      mission_text,
    );

    const combinedMemoryContext = `${memoryContext}\nKnowledge Graph Context: ${kgContext}\nCognitive Brain Context: ${brainContext}`;

    // 1. Research Question Generator, Hypotheses, Evidence Planner, Experiment Designer
    const plan = await ResearchEngine.planResearch(
      ai,
      mission_text,
      memoryContext,
      kgContext,
    );

    // 2. Synthetic Experiments (Worlds/Scenarios for testing)
    const worlds = await DynamicWorldGenerator.generate(
      ai,
      mission_text,
      simulation_mode,
      combinedMemoryContext,
    );
    const topWorlds = worlds.slice(0, 10);

    // 3. Agent Debate
    const scenarios = await AgentDebateEngine.run(
      ai,
      mission_text,
      topWorlds,
      simulation_mode,
      combinedMemoryContext,
      Object.keys(agentStore).map((k) => ({
        name: k,
        prompt: agentStore[k].prompt,
      })),
    );

    // 4. Discovery Engine
    const discovery = await DiscoveryEngine.discover(
      ai,
      mission_text,
      scenarios,
      simulation_mode,
      combinedMemoryContext,
    );

    // 5. Research Reporter
    const finalReportData = await ResearchEngine.generateReport(
      ai,
      mission_text,
      plan,
      scenarios,
      discovery,
    );

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
      depth,
    };

    researchReports.unshift(reportFull);
    // Update Knowledge Graph asynchronously
    kgInstance
      .update(ai, { ...reportFull, goals: plan.research_questions })
      .catch((e) => console.error("KG Update Failed", e));

    // Autonomous Follow-up Generation
    const { AutonomousResearchEngine } =
      await import("./src/server/autonomous.js").catch(
        (e) => import("./src/server/autonomous.ts"),
      );
    const autoGaps = await AutonomousResearchEngine.identifyGapsAndFollowUps(
      ai,
      reportFull,
    );

    // Cognitive Brain Mission Consolidation
    await PersistentBrain.processMissionComplete(ai, reportFull);

    if (autoGaps.knowledge_gaps && autoGaps.knowledge_gaps.length > 0) {
      knowledgeGaps.unshift({
        mission_id: research_id,
        gaps: autoGaps.knowledge_gaps,
        weak_assumptions: autoGaps.weak_assumptions,
        unanswered_questions: autoGaps.unanswered_questions,
        timestamp: new Date().toISOString(),
      });

      // Trigger Cognitive Architecture Goal Generation
      import("./src/server/cognitive/cognitive_architecture.js")
        .catch(
          (e) => import("./src/server/cognitive/cognitive_architecture.ts"),
        )
        .then(({ CognitiveArchitecture }) => {
          CognitiveArchitecture.generateGoalsFromGaps(
            ai,
            autoGaps.knowledge_gaps,
          ).then((goal) => {
            // Also trigger planning for the first goal as an example
            if (goal) {
              CognitiveArchitecture.planMultiStepTask(ai, goal);
            }
          });
        });
    }

    if (
      autoGaps.follow_up_questions &&
      autoGaps.follow_up_questions.length > 0
    ) {
      autoGaps.follow_up_questions.forEach((q: any) => {
        researchQueue.push({
          ...q,
          source_mission_id: research_id,
          status: "pending",
          depth: depth + 1,
          added_at: new Date().toISOString(),
        });
      });
      // Sort queue by priority and value
      researchQueue.sort(
        (a, b) =>
          b.priority_score +
          b.research_value_score -
          (a.priority_score + a.research_value_score),
      );
    }

    return reportFull;
  };

  const runAutonomousLoop = async () => {
    while (
      autonomousStatus.active &&
      autonomousStatus.currentMissions < autonomousStatus.maxMissions
    ) {
      const nextTaskIndex = researchQueue.findIndex(
        (q) => q.status === "pending" && q.depth <= autonomousStatus.maxDepth,
      );
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
      } catch (e) {
        console.error("Auto loop error:", e);
        researchQueue[nextTaskIndex].status = "failed";
      }
      // Small pause
      await new Promise((r) => setTimeout(r, 2000));
    }
    autonomousStatus.active = false;
  };

  // --- BRAIN API ROUTES ---
  app.get("/brain/db", async (req, res) => {
    try {
      const { db } = await import("./src/server/firebase.js").catch(
        (e) => import("./src/server/firebase.ts"),
      );
      const { collection, getDocs } = await import("firebase/firestore");
      const episodicSnap = await getDocs(collection(db, 'episodic_memories'));
      const semanticSnap = await getDocs(collection(db, 'semantic_memories'));
      const proceduralSnap = await getDocs(collection(db, 'procedural_memories'));
      const beliefsSnap = await getDocs(collection(db, 'beliefs'));
      const conceptsSnap = await getDocs(collection(db, 'concepts'));
      
      res.json({
        episodic: episodicSnap.docs.map(d => ({id: d.id, ...d.data()})),
        semantic: semanticSnap.docs.map(d => ({id: d.id, ...d.data()})),
        procedural: proceduralSnap.docs.map(d => ({id: d.id, ...d.data()})),
        beliefs: beliefsSnap.docs.map(d => ({id: d.id, ...d.data()})),
        concepts: conceptsSnap.docs.map(d => ({id: d.id, ...d.data()})),
      });
    } catch(e: any) {
      res.status(500).json({error: e.message});
    }
  });

  app.get("/brain/beliefs", async (req, res) => {
    try {
      const { db } = await import("./src/server/firebase.js").catch(
        (e) => import("./src/server/firebase.ts"),
      );
      const { collection, getDocs } = await import("firebase/firestore");
      const beliefsSnap = await getDocs(collection(db, 'beliefs'));
      res.json(beliefsSnap.docs.map(d => ({id: d.id, ...d.data()})));
    } catch(e: any) {
      res.status(500).json({error: e.message});
    }
  });

  app.get("/brain/timeline", async (req, res) => {
    try {
      const { db } = await import("./src/server/firebase.js").catch(
        (e) => import("./src/server/firebase.ts"),
      );
      const { collection, getDocs, query, orderBy } = await import("firebase/firestore");
      const q = query(collection(db, 'episodic_memories'), orderBy('timestamp', 'desc'));
      const episodicSnap = await getDocs(q);
      res.json(episodicSnap.docs.map(d => ({id: d.id, ...d.data()})));
    } catch(e: any) {
      res.status(500).json({error: e.message});
    }
  });

  app.get("/brain/concepts", async (req, res) => {
    try {
      const { db } = await import("./src/server/firebase.js").catch(
        (e) => import("./src/server/firebase.ts"),
      );
      const { collection, getDocs } = await import("firebase/firestore");
      const conceptsSnap = await getDocs(collection(db, 'concepts'));
      res.json(conceptsSnap.docs.map(d => ({id: d.id, ...d.data()})));
    } catch(e: any) {
      res.status(500).json({error: e.message});
    }
  });

  // --- COGNITIVE CYCLE API ROUTES ---
  app.post("/api/cycle/run", async (req, res) => {
    if (!ai) return res.status(500).json({ error: "No AI" });
    const { mission_text, mode = "balanced" } = req.body;
    try {
      const { CognitiveCycleEngine } = await import("./src/server/core/cognitive_cycle/cognitive_cycle_engine.js").catch(
        (e) => import("./src/server/core/cognitive_cycle/cognitive_cycle_engine.ts")
      );
      const cycleState = await CognitiveCycleEngine.runMissionCycle(ai, `cycle_${Date.now()}`, mission_text, mode);
      res.json(cycleState);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/cycle/:cycle_id", async (req, res) => {
    try {
      const { hccStorage } = await import("./src/server/core/hcc/hcc_storage.js").catch(
        (e) => import("./src/server/core/hcc/hcc_storage.ts")
      );
      // Because cycle_id is unique per cycle, we might need to lookup by mission_id or store by cycle_id.
      // MasterOrchestrator uses cycle_id as mission_id if useLegacy is false.
      const state = await hccStorage.getCognitiveState(req.params.cycle_id, "cycle_state");
      res.json(state || {});
    } catch(e: any) {
      res.status(500).json({error: e.message});
    }
  });

  app.get("/api/cycle/:cycle_id/trace", async (req, res) => {
    try {
      const { hccStorage } = await import("./src/server/core/hcc/hcc_storage.js").catch(
        (e) => import("./src/server/core/hcc/hcc_storage.ts")
      );
      const state = await hccStorage.getCognitiveState(req.params.cycle_id, "cycle_state");
      res.json(state?.trace || []);
    } catch(e: any) {
      res.status(500).json({error: e.message});
    }
  });

  app.get("/api/cycle/:cycle_id/state", async (req, res) => {
    try {
      const { hccStorage } = await import("./src/server/core/hcc/hcc_storage.js").catch(
        (e) => import("./src/server/core/hcc/hcc_storage.ts")
      );
      const state = await hccStorage.getCognitiveState(req.params.cycle_id, "cycle_state");
      res.json(state || {});
    } catch(e: any) {
      res.status(500).json({error: e.message});
    }
  });

  app.get("/api/cycle/:cycle_id/experience", async (req, res) => {
    try {
      const { hccStorage } = await import("./src/server/core/hcc/hcc_storage.js").catch(
        (e) => import("./src/server/core/hcc/hcc_storage.ts")
      );
      const state = await hccStorage.getCognitiveState(req.params.cycle_id, "cycle_state");
      res.json(state?.experience || {});
    } catch(e: any) {
      res.status(500).json({error: e.message});
    }
  });

  app.get("/api/cycle/:cycle_id/reflection", async (req, res) => {
    try {
      const { hccStorage } = await import("./src/server/core/hcc/hcc_storage.js").catch(
        (e) => import("./src/server/core/hcc/hcc_storage.ts")
      );
      const state = await hccStorage.getCognitiveState(req.params.cycle_id, "cycle_state");
      res.json(state?.reflection || {});
    } catch(e: any) {
      res.status(500).json({error: e.message});
    }
  });

  app.get("/api/cycle/:cycle_id/learning", async (req, res) => {
    try {
      const { hccStorage } = await import("./src/server/core/hcc/hcc_storage.js").catch(
        (e) => import("./src/server/core/hcc/hcc_storage.ts")
      );
      const state = await hccStorage.getCognitiveState(req.params.cycle_id, "cycle_state");
      res.json(state?.learning || {});
    } catch(e: any) {
      res.status(500).json({error: e.message});
    }
  });

  // --- IMAGINATION ENGINE API ROUTES ---
  app.post("/api/imagination/analyze", async (req, res) => {
    if (!ai) return res.status(500).json({ error: "No AI" });
    const { mission_id, mission_text } = req.body;
    const { ImaginationEngine } = await import("./src/server/core/imagination/imagination_engine.js").catch(
      (e) => import("./src/server/core/imagination/imagination_engine.ts")
    );
    try {
      const data = await ImaginationEngine.runImagination(ai, mission_id, mission_text);
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/imagination/:mission_id", async (req, res) => {
    try {
      const { MasterOrchestrator } = await import("./src/server/core/master_orchestrator.js").catch(
        (e) => import("./src/server/core/master_orchestrator.ts")
      );
      const data = MasterOrchestrator.activeCore?.getState()?.imagination_trace || {};
      res.json(data);
    } catch(e: any) {
      res.status(500).json({error: e.message});
    }
  });

  app.get("/api/imagination/:mission_id/scene-graph", async (req, res) => {
    try {
      const { MasterOrchestrator } = await import("./src/server/core/master_orchestrator.js").catch(
        (e) => import("./src/server/core/master_orchestrator.ts")
      );
      const data = MasterOrchestrator.activeCore?.getState()?.imagination_trace;
      res.json(data?.scene_graph || { nodes: [], edges: [] });
    } catch(e: any) {
      res.status(500).json({error: e.message});
    }
  });

  app.get("/api/imagination/:mission_id/scenarios", async (req, res) => {
    try {
      const { MasterOrchestrator } = await import("./src/server/core/master_orchestrator.js").catch(
        (e) => import("./src/server/core/master_orchestrator.ts")
      );
      const data = MasterOrchestrator.activeCore?.getState()?.imagination_trace;
      res.json(data?.scenarios || []);
    } catch(e: any) {
      res.status(500).json({error: e.message});
    }
  });

  app.get("/api/imagination/:mission_id/counterfactuals", async (req, res) => {
    try {
      const { MasterOrchestrator } = await import("./src/server/core/master_orchestrator.js").catch(
        (e) => import("./src/server/core/master_orchestrator.ts")
      );
      const data = MasterOrchestrator.activeCore?.getState()?.imagination_trace;
      res.json(data?.counterfactuals || []);
    } catch(e: any) {
      res.status(500).json({error: e.message});
    }
  });

  // --- SOCIAL COGNITIVE INTELLIGENCE API ROUTES ---
  app.post("/api/social/analyze", async (req, res) => {
    if (!ai) return res.status(500).json({ error: "No AI" });
    const { mission_text } = req.body;
    const { SocialCognitiveEngine } = await import("./src/server/social/social_cognitive_engine.js").catch(
      (e) => import("./src/server/social/social_cognitive_engine.ts")
    );
    try {
      const data = await SocialCognitiveEngine.analyzeSocialContext(ai, mission_text);
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/social/history", async (req, res) => {
    try {
      const { db } = await import("./src/server/firebase.js").catch(
        (e) => import("./src/server/firebase.ts"),
      );
      const { collection, getDocs, query, orderBy } = await import("firebase/firestore");
      const q = query(collection(db, 'social_memory'), orderBy('timestamp', 'desc'));
      const snap = await getDocs(q);
      res.json(snap.docs.map(d => ({id: d.id, ...d.data()})));
    } catch(e: any) {
      res.status(500).json({error: e.message});
    }
  });

  app.get("/api/social/relationships", async (req, res) => {
    try {
      const { db } = await import("./src/server/firebase.js").catch(
        (e) => import("./src/server/firebase.ts"),
      );
      const { collection, getDocs, query, orderBy, limit } = await import("firebase/firestore");
      const q = query(collection(db, 'social_memory'), orderBy('timestamp', 'desc'), limit(10));
      const snap = await getDocs(q);
      
      const allNodes: any[] = [];
      const allEdges: any[] = [];
      
      snap.docs.forEach(d => {
        const data = d.data();
        if (data.relationship_graph?.nodes) {
          allNodes.push(...data.relationship_graph.nodes);
        }
        if (data.relationship_graph?.edges) {
          allEdges.push(...data.relationship_graph.edges);
        }
      });
      
      res.json({ nodes: allNodes, edges: allEdges });
    } catch(e: any) {
      res.status(500).json({error: e.message});
    }
  });

  app.get("/api/social/trust", async (req, res) => {
    try {
      const { db } = await import("./src/server/firebase.js").catch(
        (e) => import("./src/server/firebase.ts"),
      );
      const { collection, getDocs, query, orderBy, limit } = await import("firebase/firestore");
      const q = query(collection(db, 'social_memory'), orderBy('timestamp', 'desc'), limit(10));
      const snap = await getDocs(q);
      
      const allTrust: any[] = [];
      
      snap.docs.forEach(d => {
        const data = d.data();
        if (data.trust_model && Array.isArray(data.trust_model)) {
          allTrust.push(...data.trust_model);
        }
      });
      
      res.json({ trust_models: allTrust });
    } catch(e: any) {
      res.status(500).json({error: e.message});
    }
  });

  const simStore: any[] = [];
  app.post("/simulate/future", async (req, res) => {
    if (!ai) return res.status(500).json({ error: "No AI" });
    const { WorldModelEngine } =
      await import("./src/server/world/world_model.js").catch(
        (e) => import("./src/server/world/world_model.ts"),
      );
    const data = await WorldModelEngine.simulateFuture(ai, req.body);
    if (!data.id) data.id = "sim_" + Math.random().toString(36).substring(7);
    simStore.push(data);
    res.json(data);
  });

  app.post("/causal_model/update", async (req, res) => {
    if (!ai) return res.status(500).json({ error: "No AI" });
    const { action, outcome, context } = req.body;
    const { WorldModelEngine } =
      await import("./src/server/world/world_model.js").catch(
        (e) => import("./src/server/world/world_model.ts"),
      );
    const newEvidence = `Action: ${action}, Outcome: ${outcome}, Context: ${context}`;
    const result = await WorldModelEngine.evolveFromEvidence(ai, newEvidence);
    res.json({
      success: true,
      new_rules: result.causal_graph,
      evolution_summary: result.evolution_summary,
    });
  });

  app.get("/causal_model/graph", async (req, res) => {
    const { WorldModelEngine } =
      await import("./src/server/world/world_model.js").catch(
        (e) => import("./src/server/world/world_model.ts"),
      );
    const graph = WorldModelEngine.getCausalGraph();
    res.json({ causal_graph: graph });
  });

  app.get("/simulation/results/:id", (req, res) => {
    const data = simStore.find((s) => s.id === req.params.id);
    if (data) res.json(data);
    else res.status(404).json({ error: "Not found" });
  });

  app.get("/cognitive/state", async (req, res) => {
    const { CognitiveArchitecture } =
      await import("./src/server/cognitive/cognitive_architecture.js").catch(
        (e) => import("./src/server/cognitive/cognitive_architecture.ts"),
      );
    res.json(await CognitiveArchitecture.getState());
  });

  app.get("/executive/state", async (req, res) => {
    const { ExecutiveFunction } =
      await import("./src/server/executive/executive_function.js").catch(
        (e) => import("./src/server/executive/executive_function.ts"),
      );
    res.json(await ExecutiveFunction.getState());
  });

  app.post("/executive/pause/:id", async (req, res) => {
    const { ExecutiveFunction } =
      await import("./src/server/executive/executive_function.js").catch(
        (e) => import("./src/server/executive/executive_function.ts"),
      );
    await ExecutiveFunction.pauseTask(req.params.id);
    res.json({ success: true });
  });

  app.post("/executive/resume/:id", async (req, res) => {
    const { ExecutiveFunction } =
      await import("./src/server/executive/executive_function.js").catch(
        (e) => import("./src/server/executive/executive_function.ts"),
      );
    await ExecutiveFunction.resumeTask(req.params.id);
    res.json({ success: true });
  });

  // NEW ENDPOINTS FROM PHASE 13-15
  app.post("/cognitive/run", async (req, res) => {
    // Trigger a cognitive run manually
    res.json({ status: "Cognitive run initiated." });
  });

  app.post("/cognitive/loop/start", async (req, res) => {
    if (!ai) return res.status(500).json({ error: "No AI" });
    const { CognitiveArchitecture } =
      await import("./src/server/cognitive/cognitive_architecture.js").catch(
        (e) => import("./src/server/cognitive/cognitive_architecture.ts"),
      );
    const result = await CognitiveArchitecture.startContinuousLoop(ai);
    res.json(result);
  });

  app.post("/cognitive/loop/stop", async (req, res) => {
    const { CognitiveArchitecture } =
      await import("./src/server/cognitive/cognitive_architecture.js").catch(
        (e) => import("./src/server/cognitive/cognitive_architecture.ts"),
      );
    const result = await CognitiveArchitecture.stopContinuousLoop();
    res.json(result);
  });

  app.post("/cognitive/meta", async (req, res) => {
    if (!ai) return res.status(500).json({ error: "No AI" });
    const { CognitiveArchitecture } =
      await import("./src/server/cognitive/cognitive_architecture.js").catch(
        (e) => import("./src/server/cognitive/cognitive_architecture.ts"),
      );
    const result = await CognitiveArchitecture.runMetaCognition(ai);
    res.json(result);
  });

  app.post("/cognitive/agi", async (req, res) => {
    if (!ai) return res.status(500).json({ error: "No AI" });
    const { CognitiveArchitecture } =
      await import("./src/server/cognitive/cognitive_architecture.js").catch(
        (e) => import("./src/server/cognitive/cognitive_architecture.ts"),
      );
    const result =
      await CognitiveArchitecture.runGeneralIntelligenceSynthesis(ai);
    res.json(result);
  });

  app.get("/cognitive/loop/status", async (req, res) => {
    const { CognitiveArchitecture } =
      await import("./src/server/cognitive/cognitive_architecture.js").catch(
        (e) => import("./src/server/cognitive/cognitive_architecture.ts"),
      );
    res.json({ running: CognitiveArchitecture.isLoopRunning });
  });

  app.get("/cognitive/beliefs", async (req, res) => {
    const { CognitiveArchitecture } =
      await import("./src/server/cognitive/cognitive_architecture.js").catch(
        (e) => import("./src/server/cognitive/cognitive_architecture.ts"),
      );
    const state = await CognitiveArchitecture.getState();
    res.json({ beliefs: state.beliefs });
  });

  app.post("/cognitive/beliefs/update", async (req, res) => {
    res.json({
      status: "Manual belief update not supported. Only AI can update beliefs.",
    });
  });

  app.get("/cognitive/goals", async (req, res) => {
    const { CognitiveArchitecture } =
      await import("./src/server/cognitive/cognitive_architecture.js").catch(
        (e) => import("./src/server/cognitive/cognitive_architecture.ts"),
      );
    const state = await CognitiveArchitecture.getState();
    res.json({ goals: state.goals });
  });

  app.get("/cognitive/plans", async (req, res) => {
    const { CognitiveArchitecture } =
      await import("./src/server/cognitive/cognitive_architecture.js").catch(
        (e) => import("./src/server/cognitive/cognitive_architecture.ts"),
      );
    const state = await CognitiveArchitecture.getState();
    res.json({ plans: state.plans });
  });

  app.post("/tasks/create", async (req, res) => {
    const { ExecutiveFunction } =
      await import("./src/server/executive/executive_function.js").catch(
        (e) => import("./src/server/executive/executive_function.ts"),
      );
    const task = await ExecutiveFunction.submitTask(req.body);
    res.json({ success: true, task });
  });

  app.get("/tasks", async (req, res) => {
    const { ExecutiveFunction } =
      await import("./src/server/executive/executive_function.js").catch(
        (e) => import("./src/server/executive/executive_function.ts"),
      );
    res.json({ tasks: await ExecutiveFunction.getTasks() });
  });

  app.post("/tasks/:id/run", async (req, res) => {
    const { ExecutiveFunction } =
      await import("./src/server/executive/executive_function.js").catch(
        (e) => import("./src/server/executive/executive_function.ts"),
      );
    await ExecutiveFunction.resumeTask(req.params.id);
    res.json({ success: true });
  });

  app.post("/tasks/:id/pause", async (req, res) => {
    const { ExecutiveFunction } =
      await import("./src/server/executive/executive_function.js").catch(
        (e) => import("./src/server/executive/executive_function.ts"),
      );
    await ExecutiveFunction.pauseTask(req.params.id);
    res.json({ success: true });
  });

  app.post("/tasks/:id/complete", async (req, res) => {
    const { ExecutiveFunction } =
      await import("./src/server/executive/executive_function.js").catch(
        (e) => import("./src/server/executive/executive_function.ts"),
      );
    await ExecutiveFunction.completeTask(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/learning/skills", async (req, res) => {
    const fs = require('fs');
    const path = require('path');
    const LEARNING_DB = path.join(process.cwd(), 'data', 'learning_history.json');
    if (!fs.existsSync(LEARNING_DB)) return res.json({ skills: [] });
    const history = JSON.parse(fs.readFileSync(LEARNING_DB, 'utf8'));
    const skills = history.flatMap((h: any) => h.skills_extracted || []);
    res.json({ skills });
  });

  app.get("/api/learning/strategies", async (req, res) => {
    const { getStrategies } = await import("./src/server/core/strategy_library.js");
    res.json({ strategies: getStrategies() });
  });

  app.get("/api/learning/improvements", async (req, res) => {
    const fs = require('fs');
    const path = require('path');
    const LEARNING_DB = path.join(process.cwd(), 'data', 'learning_history.json');
    if (!fs.existsSync(LEARNING_DB)) return res.json({ improvements: [] });
    const history = JSON.parse(fs.readFileSync(LEARNING_DB, 'utf8'));
    const improvements = history.flatMap((h: any) => h.improvements_accepted || []);
    res.json({ improvements });
  });

  app.get("/api/learning/competence", async (req, res) => {
    const { getCompetence } = await import("./src/server/core/competence_tracker.js");
    res.json(getCompetence());
  });

  app.post("/api/learning/replay", async (req, res) => {
    const { replayMission } = await import("./src/server/core/experience_replay.js");
    res.json(await replayMission(req.body.mission_id || "test_mission"));
  });

  app.get("/api/learning/history", async (req, res) => {
    const fs = require('fs');
    const path = require('path');
    const LEARNING_DB = path.join(process.cwd(), 'data', 'learning_history.json');
    if (!fs.existsSync(LEARNING_DB)) return res.json({ history: [] });
    res.json({ history: JSON.parse(fs.readFileSync(LEARNING_DB, 'utf8')) });
  });

  app.post("/api/learning/evaluate-mission", async (req, res) => {
    try {
      const { evaluateMission } = await import("./src/server/core/mission_evaluator.js");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      res.json(await evaluateMission(ai, req.body.report));
    } catch(e: any) {
      res.status(500).json({ error: e.message || String(e) });
    }
  });

  app.post("/api/learning/run", async (req, res) => {
    try {
      const { runLearningCycle } = await import("./src/server/core/autonomous_learning_engine.js");
      const { HyperMindCognitiveCore } = await import("./src/server/core/hcc/cognitive_core.js");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const core = new HyperMindCognitiveCore("manual_run");
      const summary = await runLearningCycle(ai, req.body.mission_id, req.body.report, core);
      res.json(summary);
    } catch(e: any) {
      res.status(500).json({ error: e.message || String(e) });
    }
  });

  app.get("/api/knowledge/evidence", async (req, res) => {
    try {
      const { getEvidence } = await import("./src/server/core/knowledge/evidence_store.js");
      res.json({ evidence: getEvidence() });
    } catch(e: any) {
      res.status(500).json({ error: e.message || String(e) });
    }
  });

  app.post("/api/knowledge/plan", async (req, res) => {
    try {
      const { planKnowledgeAcquisition } = await import("./src/server/core/knowledge/knowledge_planner.js");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      res.json({ needs: await planKnowledgeAcquisition(ai, req.body.mission) });
    } catch(e: any) {
      res.status(500).json({ error: e.message || String(e) });
    }
  });

  app.get("/society/state", async (req, res) => {
    const { MultiAgentSociety } =
      await import("./src/server/society/multi_agent_society.js").catch(
        (e) => import("./src/server/society/multi_agent_society.ts"),
      );
    res.json(await MultiAgentSociety.getState());
  });

  app.post("/society/vote", async (req, res) => {
    const { MultiAgentSociety } =
      await import("./src/server/society/multi_agent_society.js").catch(
        (e) => import("./src/server/society/multi_agent_society.ts"),
      );
    await MultiAgentSociety.holdVote(req.body.proposal);
    res.json({ success: true });
  });

  app.post("/society/negotiate", async (req, res) => {
    const { MultiAgentSociety } =
      await import("./src/server/society/multi_agent_society.js").catch(
        (e) => import("./src/server/society/multi_agent_society.ts"),
      );
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    await MultiAgentSociety.simulateNegotiation(ai, req.body.issue);
    res.json({ success: true });
  });

  app.get("/discovery/state", async (req, res) => {
    const { ScientificDiscoveryPlatform } =
      await import("./src/server/discovery/scientific_discovery.js").catch(
        (e) => import("./src/server/discovery/scientific_discovery.ts"),
      );
    res.json(await ScientificDiscoveryPlatform.getState());
  });

  app.post("/discovery/run", async (req, res) => {
    const { ScientificDiscoveryPlatform } =
      await import("./src/server/discovery/scientific_discovery.js").catch(
        (e) => import("./src/server/discovery/scientific_discovery.ts"),
      );
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    await ScientificDiscoveryPlatform.discover(
      ai,
      req.body.topic,
      req.body.discipline,
    );
    res.json({ success: true });
  });

  app.post("/research/run", async (req, res) => {
    const { mission_text, simulation_mode = "realistic" } = req.body;
    try {
      const report = await performResearch(mission_text, simulation_mode, 0);
      res.json(report);
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Failed" });
    }
  });

  app.post("/mission", async (req, res) => {
    const { mission_text, simulation_mode = "realistic" } = req.body;

    if (!ai) {
      return res
        .status(500)
        .json({ error: "Gemini API key is missing. No AI engine available." });
    }

    try {
      const { MasterOrchestrator } =
        await import("./src/server/core/master_orchestrator.js").catch(
          (e) => import("./src/server/core/master_orchestrator.ts"),
        );
      const result = await MasterOrchestrator.runMission(
        ai,
        { mission_text, simulation_mode },
        kgInstance,
      );

      const { MissionCompiler } = await import("./src/server/core/mission_compiler.js").catch(
        (e) => import("./src/server/core/mission_compiler.ts")
      );
      
      const compiledReport = await MissionCompiler.compile(ai, result, { viewMode: "user" });
      const devReport = await MissionCompiler.compile(ai, result, { viewMode: "developer" });

      if (Array.isArray(result.recursive_improvement)) {
        result.recursive_improvement.forEach((p: any) => {
          agentPerformances.unshift({
            ...p,
            mission_id: result.mission_id,
            timestamp: new Date().toISOString(),
          });
        });
      }

      missions.unshift({
        ...result,
        compiled_user: compiledReport,
        compiled_dev: devReport,
      });
      res.json(compiledReport);
    } catch (e: any) {
      console.error("MasterOrchestrator error:", e);
      res.status(500).json({ error: e.message || "Failed" });
    }
  });

  app.get("/api/mission/status", async (req, res) => {
    try {
      const { MasterOrchestrator } =
        await import("./src/server/core/master_orchestrator.js").catch(
          (e) => import("./src/server/core/master_orchestrator.ts"),
        );
      res.json(MasterOrchestrator.currentStatus);
    } catch (e) {
      res.json({ stage: "idle" });
    }
  });

  app.get("/api/core/state", async (req, res) => {
    try {
      const { MasterOrchestrator } = await import("./src/server/core/master_orchestrator.js").catch(e => import("./src/server/core/master_orchestrator.ts"));
      if (MasterOrchestrator.activeCore) {
        res.json(MasterOrchestrator.activeCore.getState());
      } else {
        res.status(404).json({ error: "No active core" });
      }
    } catch(e) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/api/core/events", async (req, res) => {
    try {
        const { MasterOrchestrator } = await import("./src/server/core/master_orchestrator.js").catch(e => import("./src/server/core/master_orchestrator.ts"));
        if (MasterOrchestrator.activeCore) {
        res.json(MasterOrchestrator.activeCore.getState().events);
        } else {
        res.status(404).json({ error: "No active core" });
        }
    } catch(e) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/api/core/working-memory", async (req, res) => {
    try {
        const { MasterOrchestrator } = await import("./src/server/core/master_orchestrator.js").catch(e => import("./src/server/core/master_orchestrator.ts"));
        if (MasterOrchestrator.activeCore) {
        res.json(MasterOrchestrator.activeCore.getState().working_memory);
        } else {
        res.status(404).json({ error: "No active core" });
        }
    } catch(e) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/api/core/attention", async (req, res) => {
    try {
        const { MasterOrchestrator } = await import("./src/server/core/master_orchestrator.js").catch(e => import("./src/server/core/master_orchestrator.ts"));
        if (MasterOrchestrator.activeCore) {
        res.json(MasterOrchestrator.activeCore.getState().attention);
        } else {
        res.status(404).json({ error: "No active core" });
        }
    } catch(e) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/api/core/goals", async (req, res) => {
    try {
        const { MasterOrchestrator } = await import("./src/server/core/master_orchestrator.js").catch(e => import("./src/server/core/master_orchestrator.ts"));
        if (MasterOrchestrator.activeCore) {
        res.json(MasterOrchestrator.activeCore.getState().goal_stack);
        } else {
        res.status(404).json({ error: "No active core" });
        }
    } catch(e) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/api/core/confidence", async (req, res) => {
    try {
        const { MasterOrchestrator } = await import("./src/server/core/master_orchestrator.js").catch(e => import("./src/server/core/master_orchestrator.ts"));
        if (MasterOrchestrator.activeCore) {
        res.json(MasterOrchestrator.activeCore.getState().confidence);
        } else {
        res.status(404).json({ error: "No active core" });
        }
    } catch(e) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/api/mission/:mission_id/full", (req, res) => {
    const m = missions.find((x) => x.mission_id === req.params.mission_id);
    if (m) res.json(m);
    else res.status(404).json({ error: "Not found" });
  });

  app.get("/api/mission/:mission_id/report", (req, res) => {
    const m = missions.find((x) => x.mission_id === req.params.mission_id);
    if (m && m.compiled_user) res.json(m.compiled_user);
    else res.status(404).json({ error: "Not found" });
  });

  app.get("/api/mission/:mission_id/debug", (req, res) => {
    const m = missions.find((x) => x.mission_id === req.params.mission_id);
    if (m && m.compiled_dev) res.json(m.compiled_dev);
    else res.status(404).json({ error: "Not found" });
  });

  const decisionHistory: any[] = [];

  app.post("/api/decision/evaluate", async (req, res) => {
    try {
      const { missionText, missionData } = req.body;
      const { StrategicDecisionEngine } = await import("./src/server/core/strategic_decision_engine.js").catch((e) => import("./src/server/core/strategic_decision_engine.ts"));
      const recommendation = await StrategicDecisionEngine.evaluate(ai, missionText, missionData || {});
      decisionHistory.push({
        id: Math.random().toString(36).substring(7),
        mission: missionText,
        recommendation,
        timestamp: new Date().toISOString()
      });
      res.json(recommendation);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/decision/history", (req, res) => {
    res.json(decisionHistory);
  });

  app.get("/api/decision/explain", (req, res) => {
    const { id } = req.query;
    if (id) {
       const dec = decisionHistory.find((d) => d.id === id);
       if (dec) return res.json(dec.recommendation.decision_trace);
    }
    res.json(decisionHistory.map((d) => ({ id: d.id, trace: d.recommendation.decision_trace })));
  });

  app.get("/benchmark/history", async (req, res) => {
    const { BenchmarkEngine } =
      await import("./src/server/benchmark/benchmark_engine.js").catch(
        (e) => import("./src/server/benchmark/benchmark_engine.ts"),
      );
    const history = await BenchmarkEngine.getHistory();
    res.json(history);
  });

  app.post("/benchmark/run", async (req, res) => {
    if (!ai) return res.status(500).json({ error: "No AI" });
    const { BenchmarkEngine } =
      await import("./src/server/benchmark/benchmark_engine.js").catch(
        (e) => import("./src/server/benchmark/benchmark_engine.ts"),
      );
    const version =
      req.body.version ||
      "HyperMind-X v" +
        (Math.floor(Math.random() * 10) + 1) +
        "." +
        Math.floor(Math.random() * 9);
    const result = await BenchmarkEngine.runSuite(ai, version);
    res.json(result);
  });

  // --- HECS API ROUTES ---
  app.get("/api/hecs/competence", async (req, res) => {
    try {
        const { CompetenceProfileManager } = await import("./src/server/core/hecs/competence_profile.js");
        res.json(CompetenceProfileManager.getProfile());
    } catch (e) {
        res.status(500).json({ error: "HECS not initialized" });
    }
  });

  app.get("/api/hecs/competence/domain/:domain", async (req, res) => {
    try {
        const { CompetenceProfileManager } = await import("./src/server/core/hecs/competence_profile.js");
        const profile = CompetenceProfileManager.getProfile();
        const domain = req.params.domain.toLowerCase();
        res.json({
            domain,
            competence: profile.domain_competence[domain] || 0,
            confidence: profile.confidence_by_domain[domain] || 0,
            experience_count: profile.experience_counts.domains[domain] || 0
        });
    } catch (e) {
        res.status(500).json({ error: "HECS not initialized" });
    }
  });

  app.get("/api/hecs/competence/skills", async (req, res) => {
    try {
        const { SkillRegistry } = await import("./src/server/core/hecs/skill_registry.js");
        res.json(SkillRegistry.getSkills());
    } catch (e) {
        res.status(500).json({ error: "HECS not initialized" });
    }
  });

  app.get("/api/hecs/competence/trends", async (req, res) => {
    try {
        const { CompetenceProfileManager } = await import("./src/server/core/hecs/competence_profile.js");
        res.json(CompetenceProfileManager.getProfile().improvement_trends);
    } catch (e) {
        res.status(500).json({ error: "HECS not initialized" });
    }
  });

  // --- HKES API ROUTES ---
  app.get("/api/hkes/patterns", async (req, res) => {
    try {
        const { AbstractionStore } = await import("./src/server/core/hkes/abstraction_store.js");
        const { AbstractionType } = await import("./src/server/core/hkes/abstraction_types.js");
        res.json(AbstractionStore.searchByType(AbstractionType.PATTERN));
    } catch (e) {
        res.status(500).json({ error: "HKES not initialized" });
    }
  });

  app.get("/api/hkes/patterns/:id", async (req, res) => {
    try {
        const { AbstractionStore } = await import("./src/server/core/hkes/abstraction_store.js");
        const pattern = AbstractionStore.getAbstraction(req.params.id);
        if (pattern) res.json(pattern);
        else res.status(404).json({ error: "Pattern not found" });
    } catch (e) {
        res.status(500).json({ error: "HKES not initialized" });
    }
  });

  app.get("/api/hkes/patterns/domain/:domain", async (req, res) => {
    try {
        const { AbstractionStore } = await import("./src/server/core/hkes/abstraction_store.js");
        const { AbstractionType } = await import("./src/server/core/hkes/abstraction_types.js");
        const patterns = AbstractionStore.searchByDomain(req.params.domain)
            .filter(a => a.abstraction_type === AbstractionType.PATTERN);
        res.json(patterns);
    } catch (e) {
        res.status(500).json({ error: "HKES not initialized" });
    }
  });

  app.get("/api/hkes/patterns/category/:category", async (req, res) => {
    try {
        const { AbstractionStore } = await import("./src/server/core/hkes/abstraction_store.js");
        const { AbstractionType } = await import("./src/server/core/hkes/abstraction_types.js");
        const patterns = AbstractionStore.searchByType(AbstractionType.PATTERN)
            .filter((a: any) => a.pattern_category === req.params.category);
        res.json(patterns);
    } catch (e) {
        res.status(500).json({ error: "HKES not initialized" });
    }
  });

  app.get("/api/hkes/heuristics", async (req, res) => {
    try {
        const { AbstractionStore } = await import("./src/server/core/hkes/abstraction_store.js");
        const { AbstractionType } = await import("./src/server/core/hkes/abstraction_types.js");
        res.json(AbstractionStore.searchByType(AbstractionType.HEURISTIC));
    } catch (e) {
        res.status(500).json({ error: "HKES not initialized" });
    }
  });

  app.get("/api/hkes/heuristics/:id", async (req, res) => {
    try {
        const { AbstractionStore } = await import("./src/server/core/hkes/abstraction_store.js");
        const heuristic = AbstractionStore.getAbstraction(req.params.id);
        if (heuristic) res.json(heuristic);
        else res.status(404).json({ error: "Heuristic not found" });
    } catch (e) {
        res.status(500).json({ error: "HKES not initialized" });
    }
  });

  app.get("/api/hkes/heuristics/domain/:domain", async (req, res) => {
    try {
        const { AbstractionStore } = await import("./src/server/core/hkes/abstraction_store.js");
        const { AbstractionType } = await import("./src/server/core/hkes/abstraction_types.js");
        const heuristics = AbstractionStore.searchByDomain(req.params.domain)
            .filter(a => a.abstraction_type === AbstractionType.HEURISTIC);
        res.json(heuristics);
    } catch (e) {
        res.status(500).json({ error: "HKES not initialized" });
    }
  });

  app.get("/api/hkes/heuristics/applicable", async (req, res) => {
    try {
        const mission = req.query.mission as string || "";
        const domain = req.query.domain as string || "";
        const { AbstractionStore } = await import("./src/server/core/hkes/abstraction_store.js");
        const { AbstractionType } = await import("./src/server/core/hkes/abstraction_types.js");
        const { HeuristicApplicabilityScorer } = await import("./src/server/core/hkes/heuristic_applicability_scorer.js");
        
        const allHeuristics = AbstractionStore.searchByType(AbstractionType.HEURISTIC) as any[];
        const scored = HeuristicApplicabilityScorer.score(mission, domain, allHeuristics);
        res.json(scored);
    } catch (e) {
        res.status(500).json({ error: "HKES not initialized" });
    }
  });

  app.get("/api/hkes/causal-models", async (req, res) => {
    try {
        const { AbstractionStore } = await import("./src/server/core/hkes/abstraction_store.js");
        const { AbstractionType } = await import("./src/server/core/hkes/abstraction_types.js");
        res.json(AbstractionStore.searchByType(AbstractionType.CAUSAL_MODEL));
    } catch (e) {
        res.status(500).json({ error: "HKES not initialized" });
    }
  });

  app.get("/api/hkes/causal-models/:id", async (req, res) => {
    try {
        const { AbstractionStore } = await import("./src/server/core/hkes/abstraction_store.js");
        const model = AbstractionStore.getAbstraction(req.params.id);
        if (model) res.json(model);
        else res.status(404).json({ error: "Causal model not found" });
    } catch (e) {
        res.status(500).json({ error: "HKES not initialized" });
    }
  });

  app.get("/api/hkes/causal-models/domain/:domain", async (req, res) => {
    try {
        const { AbstractionStore } = await import("./src/server/core/hkes/abstraction_store.js");
        const { AbstractionType } = await import("./src/server/core/hkes/abstraction_types.js");
        const models = AbstractionStore.searchByDomain(req.params.domain)
            .filter(a => a.abstraction_type === AbstractionType.CAUSAL_MODEL);
        res.json(models);
    } catch (e) {
        res.status(500).json({ error: "HKES not initialized" });
    }
  });

  app.get("/api/hkes/causal-models/applicable", async (req, res) => {
    try {
        const domain = req.query.domain as string || "";
        const { AbstractionStore } = await import("./src/server/core/hkes/abstraction_store.js");
        const { AbstractionType } = await import("./src/server/core/hkes/abstraction_types.js");
        
        const allCausalModels = AbstractionStore.searchByType(AbstractionType.CAUSAL_MODEL) as any[];
        const applicable = allCausalModels.filter(m => m.applicable_domains.includes(domain));
        res.json(applicable);
    } catch (e) {
        res.status(500).json({ error: "HKES not initialized" });
    }
  });

  app.get("/api/hkes/causal-models/:id/graph", async (req, res) => {
    try {
        const { AbstractionStore } = await import("./src/server/core/hkes/abstraction_store.js");
        const model: any = AbstractionStore.getAbstraction(req.params.id);
        if (model) {
            res.json({
                nodes: model.causal_nodes,
                edges: model.causal_edges
            });
        } else {
            res.status(404).json({ error: "Causal model not found" });
        }
    } catch (e) {
        res.status(500).json({ error: "HKES not initialized" });
    }
  });

  // --- HCW API ROUTES ---
  app.post("/api/hcw/workspace", async (req, res) => {
      try {
          const { CognitiveWorkspace } = await import("./src/server/core/hcw/cognitive_workspace.js");
          const { mission } = req.body;
          const id = CognitiveWorkspace.createWorkspace(mission || "Unknown Mission");
          res.json({ workspace_id: id });
      } catch (e) {
          res.status(500).json({ error: "HCW not initialized" });
      }
  });
  
  app.get("/api/hcw/workspace/:id", async (req, res) => {
      try {
          const { CognitiveWorkspace } = await import("./src/server/core/hcw/cognitive_workspace.js");
          const ws = CognitiveWorkspace.getWorkspace(req.params.id);
          if (ws) res.json(ws);
          else res.status(404).json({ error: "Workspace not found" });
      } catch (e) {
          res.status(500).json({ error: "HCW not initialized" });
      }
  });
  
  app.get("/api/hcw/workspace/:id/summary", async (req, res) => {
      try {
          const { CognitiveWorkspace } = await import("./src/server/core/hcw/cognitive_workspace.js");
          const ws = CognitiveWorkspace.getWorkspace(req.params.id);
          if (ws) res.json({ id: ws.workspace_id, mission: ws.mission, status: ws.status });
          else res.status(404).json({ error: "Workspace not found" });
      } catch (e) {
          res.status(500).json({ error: "HCW not initialized" });
      }
  });

  app.get("/api/hcw/workspace/:id/graph", async (req, res) => {
      try {
          const { CognitiveWorkspace } = await import("./src/server/core/hcw/cognitive_workspace.js");
          const ws = CognitiveWorkspace.getWorkspace(req.params.id);
          if (ws) res.json({ nodes: Array.from(ws.graph.nodes.values()), edges: Array.from(ws.graph.edges.values()) });
          else res.status(404).json({ error: "Workspace not found" });
      } catch (e) {
          res.status(500).json({ error: "HCW not initialized" });
      }
  });

  app.get("/api/hcw/workspace/:id/nodes", async (req, res) => {
      try {
          const { CognitiveWorkspace } = await import("./src/server/core/hcw/cognitive_workspace.js");
          const ws = CognitiveWorkspace.getWorkspace(req.params.id);
          if (ws) res.json(Array.from(ws.graph.nodes.values()));
          else res.status(404).json({ error: "Workspace not found" });
      } catch (e) {
          res.status(500).json({ error: "HCW not initialized" });
      }
  });
  
  app.get("/api/hcw/workspace/:id/edges", async (req, res) => {
      try {
          const { CognitiveWorkspace } = await import("./src/server/core/hcw/cognitive_workspace.js");
          const ws = CognitiveWorkspace.getWorkspace(req.params.id);
          if (ws) res.json(Array.from(ws.graph.edges.values()));
          else res.status(404).json({ error: "Workspace not found" });
      } catch (e) {
          res.status(500).json({ error: "HCW not initialized" });
      }
  });
  
  app.get("/api/hcw/workspace/:id/patches", async (req, res) => {
      try {
          const { CognitiveWorkspace } = await import("./src/server/core/hcw/cognitive_workspace.js");
          const ws = CognitiveWorkspace.getWorkspace(req.params.id);
          if (ws) res.json(ws.patches);
          else res.status(404).json({ error: "Workspace not found" });
      } catch (e) {
          res.status(500).json({ error: "HCW not initialized" });
      }
  });
  
  app.get("/api/hcw/workspace/:id/snapshots", async (req, res) => {
      try {
          const { CognitiveWorkspace } = await import("./src/server/core/hcw/cognitive_workspace.js");
          const ws = CognitiveWorkspace.getWorkspace(req.params.id);
          if (ws) res.json(ws.snapshots);
          else res.status(404).json({ error: "Workspace not found" });
      } catch (e) {
          res.status(500).json({ error: "HCW not initialized" });
      }
  });

  app.get("/api/hcw/workspace/:id/metrics", async (req, res) => {
      try {
          const { CognitiveWorkspace } = await import("./src/server/core/hcw/cognitive_workspace.js");
          const metrics = CognitiveWorkspace.getWorkspaceMetrics(req.params.id);
          if (metrics) res.json(metrics);
          else res.status(404).json({ error: "Workspace not found" });
      } catch (e) {
          res.status(500).json({ error: "HCW not initialized" });
      }
  });

  app.post("/api/hcw/workspace/:id/query", async (req, res) => {
      try {
          const { CognitiveWorkspace } = await import("./src/server/core/hcw/cognitive_workspace.js");
          const { type, module } = req.body;
          if (type && module) {
             const nodes1 = CognitiveWorkspace.queryNodes(req.params.id, { type });
             const nodes2 = CognitiveWorkspace.queryNodes(req.params.id, { module });
             res.json(nodes1.filter((n: any) => nodes2.find((n2: any) => n.id === n2.id)));
          } else if (type) {
             res.json(CognitiveWorkspace.queryNodes(req.params.id, { type }));
          } else if (module) {
             res.json(CognitiveWorkspace.queryNodes(req.params.id, { module }));
          } else {
             res.status(400).json({ error: "Must provide type or module filter" });
          }
      } catch (e) {
          res.status(500).json({ error: "HCW not initialized" });
      }
  });

  // --- HWME API ROUTES ---
  app.post("/api/hwme/world", async (req, res) => {
      try {
          const { RealityRepresentationCore } = await import("./src/server/core/hwme/reality_representation_core.js");
          const { GoogleGenAI } = await import("@google/genai");
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'stub' });
          const { mission } = req.body;
          const world = await RealityRepresentationCore.parseMission(ai, mission || "Unknown Mission");
          // Here we would typically store it, but for testing we return it directly, or store in a dummy map if we had a WorldStore
          // Actually HCW holds it, but HWME prompt wants these exact routes
          res.json(world);
      } catch (e) {
          res.status(500).json({ error: "HWME not initialized" });
      }
  });

  app.get("/api/hwme/world/:id", async (req, res) => {
      try {
          const { CognitiveWorkspace } = await import("./src/server/core/hcw/cognitive_workspace.js");
          const ws = CognitiveWorkspace.getWorkspace(req.params.id);
          if (ws && ws.world_model && ws.world_model.real_world) res.json(ws.world_model.real_world);
          else res.status(404).json({ error: "World not found in workspace" });
      } catch (e) {
          res.status(500).json({ error: "HWME not initialized" });
      }
  });

  app.get("/api/hwme/world/:id/entities", async (req, res) => {
      try {
          const { CognitiveWorkspace } = await import("./src/server/core/hcw/cognitive_workspace.js");
          const ws = CognitiveWorkspace.getWorkspace(req.params.id);
          if (ws && ws.world_model && ws.world_model.real_world) res.json(Array.from(ws.world_model.real_world.entities.values()));
          else res.status(404).json({ error: "World not found in workspace" });
      } catch (e) {
          res.status(500).json({ error: "HWME not initialized" });
      }
  });

  app.get("/api/hwme/world/:id/systems", async (req, res) => {
      try {
          const { CognitiveWorkspace } = await import("./src/server/core/hcw/cognitive_workspace.js");
          const ws = CognitiveWorkspace.getWorkspace(req.params.id);
          if (ws && ws.world_model && ws.world_model.real_world) res.json(Array.from(ws.world_model.real_world.systems.values()));
          else res.status(404).json({ error: "World not found in workspace" });
      } catch (e) {
          res.status(500).json({ error: "HWME not initialized" });
      }
  });

  app.get("/api/hwme/world/:id/relationships", async (req, res) => {
      try {
          const { CognitiveWorkspace } = await import("./src/server/core/hcw/cognitive_workspace.js");
          const ws = CognitiveWorkspace.getWorkspace(req.params.id);
          if (ws && ws.world_model && ws.world_model.real_world) res.json(Array.from(ws.world_model.real_world.relationships.values()));
          else res.status(404).json({ error: "World not found in workspace" });
      } catch (e) {
          res.status(500).json({ error: "HWME not initialized" });
      }
  });

  app.get("/api/hwme/world/:id/resources", async (req, res) => {
      try {
          const { CognitiveWorkspace } = await import("./src/server/core/hcw/cognitive_workspace.js");
          const ws = CognitiveWorkspace.getWorkspace(req.params.id);
          if (ws && ws.world_model && ws.world_model.real_world) res.json(Array.from(ws.world_model.real_world.resources.values()));
          else res.status(404).json({ error: "World not found in workspace" });
      } catch (e) {
          res.status(500).json({ error: "HWME not initialized" });
      }
  });

  // --- DWSE API ROUTES ---
  app.post("/api/hwme/state", async (req, res) => {
      try {
          const { DynamicWorldStateEngine } = await import("./src/server/core/hwme/dynamic/dynamic_world_state_engine.js");
          const world = DynamicWorldStateEngine.createWorld(req.body.world_id || Date.now().toString());
          res.json(world.getState());
      } catch (e) {
          res.status(500).json({ error: "DWSE not initialized" });
      }
  });

  app.get("/api/hwme/state/:id", async (req, res) => {
      try {
          const { DynamicWorldStateEngine } = await import("./src/server/core/hwme/dynamic/dynamic_world_state_engine.js");
          const world = DynamicWorldStateEngine.getWorld(req.params.id);
          if (world) res.json(world.getState());
          else res.status(404).json({ error: "State not found" });
      } catch (e) {
          res.status(500).json({ error: "DWSE not initialized" });
      }
  });

  app.get("/api/hwme/state/:id/history", async (req, res) => {
      try {
          const { DynamicWorldStateEngine } = await import("./src/server/core/hwme/dynamic/dynamic_world_state_engine.js");
          const world = DynamicWorldStateEngine.getWorld(req.params.id);
          if (world) res.json(world.history);
          else res.status(404).json({ error: "State not found" });
      } catch (e) {
          res.status(500).json({ error: "DWSE not initialized" });
      }
  });

  app.get("/api/hwme/state/:id/snapshots", async (req, res) => {
      try {
          const { DynamicWorldStateEngine } = await import("./src/server/core/hwme/dynamic/dynamic_world_state_engine.js");
          const world = DynamicWorldStateEngine.getWorld(req.params.id);
          if (world) res.json(world.history.snapshots);
          else res.status(404).json({ error: "State not found" });
      } catch (e) {
          res.status(500).json({ error: "DWSE not initialized" });
      }
  });

  app.get("/api/hwme/state/:id/timeline", async (req, res) => {
      try {
          const { DynamicWorldStateEngine } = await import("./src/server/core/hwme/dynamic/dynamic_world_state_engine.js");
          const world = DynamicWorldStateEngine.getWorld(req.params.id);
          if (world) res.json(world.history.getTimeline());
          else res.status(404).json({ error: "State not found" });
      } catch (e) {
          res.status(500).json({ error: "DWSE not initialized" });
      }
  });

  app.get("/api/hwme/state/:id/predictions", async (req, res) => {
      try {
          const { DynamicWorldStateEngine } = await import("./src/server/core/hwme/dynamic/dynamic_world_state_engine.js");
          const world = DynamicWorldStateEngine.getWorld(req.params.id);
          if (world) res.json(world.predictions);
          else res.status(404).json({ error: "State not found" });
      } catch (e) {
          res.status(500).json({ error: "DWSE not initialized" });
      }
  });

  app.post("/api/hwme/state/:id/update", async (req, res) => {
      try {
          const { DynamicWorldStateEngine } = await import("./src/server/core/hwme/dynamic/dynamic_world_state_engine.js");
          const world = DynamicWorldStateEngine.getWorld(req.params.id);
          if (world) {
              const update = req.body;
              const result = world.applyUpdate(update);
              if (result.success) {
                  res.json(world.getState());
              } else {
                  res.status(400).json({ error: "Validation failed", details: result.errors });
              }
          }
          else res.status(404).json({ error: "State not found" });
      } catch (e) {
          res.status(500).json({ error: "DWSE not initialized" });
      }
  });

  // --- WPE API ROUTES ---
  app.post("/api/hwme/process", async (req, res) => {
      try {
          const { WorldProcessEngine } = await import("./src/server/core/hwme/process/world_process_engine.js");
          const model = req.body.model;
          const simulation = req.body.simulation_mode || false;
          const instance = WorldProcessEngine.createInstance(model, simulation);
          if (instance) {
              res.json(instance);
          } else {
              res.status(400).json({ error: "Process validation failed" });
          }
      } catch (e) {
          res.status(500).json({ error: "WPE not initialized" });
      }
  });

  app.get("/api/hwme/process/:id", async (req, res) => {
      try {
          const { WorldProcessEngine } = await import("./src/server/core/hwme/process/world_process_engine.js");
          const instance = WorldProcessEngine.getInstance(req.params.id);
          if (instance) res.json(instance);
          else res.status(404).json({ error: "Instance not found" });
      } catch (e) {
          res.status(500).json({ error: "WPE not initialized" });
      }
  });

  app.get("/api/hwme/process/:id/history", async (req, res) => {
      try {
          const { WorldProcessEngine } = await import("./src/server/core/hwme/process/world_process_engine.js");
          const instance = WorldProcessEngine.getInstance(req.params.id);
          if (instance) res.json(instance.history);
          else res.status(404).json({ error: "Instance not found" });
      } catch (e) {
          res.status(500).json({ error: "WPE not initialized" });
      }
  });

  app.post("/api/hwme/process/:id/start", async (req, res) => {
      try {
          const { WorldProcessEngine } = await import("./src/server/core/hwme/process/world_process_engine.js");
          const { world_id } = req.body;
          const result = WorldProcessEngine.startProcess(req.params.id, world_id);
          if (result.success) {
              res.json(WorldProcessEngine.getInstance(req.params.id));
          } else {
              res.status(400).json({ error: result.error });
          }
      } catch (e) {
          res.status(500).json({ error: "WPE not initialized" });
      }
  });

  // --- WME API ROUTES ---
  app.post("/api/hwme/mechanism", async (req, res) => {
      try {
          const { WorldMechanismEngine } = await import("./src/server/core/hwme/mechanism/world_mechanism_engine.js");
          const engine = new WorldMechanismEngine();
          const result = engine.registerMechanism(req.body.model);
          if (result.success) {
              res.json({ success: true, mechanism: req.body.model });
          } else {
              res.status(400).json({ error: "Mechanism validation failed", details: result.errors });
          }
      } catch (e) {
          res.status(500).json({ error: "WME not initialized" });
      }
  });

  // --- HPDE API ROUTES ---
  app.post("/api/hpde/principle", async (req, res) => {
      try {
          const { PrincipleDiscoveryEngine } = await import("./src/server/core/hpde/principle_discovery_engine.js");
          const engine = new PrincipleDiscoveryEngine();
          const principles = engine.discoverFromMechanisms(req.body.mechanisms || []);
          res.json({ principles });
      } catch (e) {
          res.status(500).json({ error: "HPDE not initialized" });
      }
  });
  
  app.get("/api/hpde/principles", async (req, res) => {
      try {
          const { PrincipleDiscoveryEngine } = await import("./src/server/core/hpde/principle_discovery_engine.js");
          const engine = new PrincipleDiscoveryEngine(); // Note: in reality we'd have a singleton
          res.json(engine.getAll());
      } catch (e) {
          res.status(500).json({ error: "HPDE not initialized" });
      }
  });

  app.get("/api/hpde/principle/:id", async (req, res) => {
      try {
          const { PrincipleDiscoveryEngine } = await import("./src/server/core/hpde/principle_discovery_engine.js");
          const engine = new PrincipleDiscoveryEngine();
          const principle = engine.getPrinciple(req.params.id);
          if (principle) res.json(principle);
          else res.status(404).json({ error: "Principle not found" });
      } catch (e) {
          res.status(500).json({ error: "HPDE not initialized" });
      }
  });

  app.get("/api/hpde/principle/:id/evidence", async (req, res) => {
      try {
          const { PrincipleDiscoveryEngine } = await import("./src/server/core/hpde/principle_discovery_engine.js");
          const engine = new PrincipleDiscoveryEngine();
          const principle = engine.getPrinciple(req.params.id);
          if (principle) res.json({ evidence: principle.evidence, counter_examples: principle.counter_examples });
          else res.status(404).json({ error: "Principle not found" });
      } catch (e) {
          res.status(500).json({ error: "HPDE not initialized" });
      }
  });

  app.get("/api/hpde/principle/:id/mechanisms", async (req, res) => {
      try {
          const { PrincipleDiscoveryEngine } = await import("./src/server/core/hpde/principle_discovery_engine.js");
          const engine = new PrincipleDiscoveryEngine();
          const principle = engine.getPrinciple(req.params.id);
          if (principle) res.json(principle.supporting_mechanisms);
          else res.status(404).json({ error: "Principle not found" });
      } catch (e) {
          res.status(500).json({ error: "HPDE not initialized" });
      }
  });

  app.post("/api/hpde/principle/:id/validate", async (req, res) => {
      try {
          const { PrincipleDiscoveryEngine } = await import("./src/server/core/hpde/principle_discovery_engine.js");
          const engine = new PrincipleDiscoveryEngine(); // Normally need singleton to get the state... Let's just create and inject. But this is just stub API for now.
          // Because it's not a singleton, this won't actually work on a real previously generated ID unless we mock it or make it a singleton.
          // For now, return a basic success.
          res.json({ success: true, message: "Use the engine directly in tests for proper state." });
      } catch (e) {
          res.status(500).json({ error: "HPDE not initialized" });
      }
  });

  // --- HHGFS API ROUTES ---
  app.post("/api/hhgfs/hypothesis", async (req, res) => {
      try {
          const { HypothesisGenerationEngine } = await import("./src/server/core/hhgfs/hypothesis_generation_engine.js");
          const engine = new HypothesisGenerationEngine();
          const hypotheses = engine.generateHypotheses(req.body.context || "");
          res.json({ hypotheses });
      } catch (e) {
          res.status(500).json({ error: "HHGFS not initialized" });
      }
  });

  app.get("/api/hhgfs/hypotheses", async (req, res) => {
      try {
          const { HypothesisGenerationEngine } = await import("./src/server/core/hhgfs/hypothesis_generation_engine.js");
          const engine = new HypothesisGenerationEngine();
          res.json(engine.getAll());
      } catch (e) {
          res.status(500).json({ error: "HHGFS not initialized" });
      }
  });

  app.get("/api/hhgfs/hypothesis/:id", async (req, res) => {
      try {
          const { HypothesisGenerationEngine } = await import("./src/server/core/hhgfs/hypothesis_generation_engine.js");
          const engine = new HypothesisGenerationEngine();
          const hypothesis = engine.getHypothesis(req.params.id);
          if (hypothesis) res.json(hypothesis);
          else res.status(404).json({ error: "Hypothesis not found" });
      } catch (e) {
          res.status(500).json({ error: "HHGFS not initialized" });
      }
  });

  app.get("/api/hhgfs/hypothesis/:id/evidence", async (req, res) => {
      try {
          const { HypothesisGenerationEngine } = await import("./src/server/core/hhgfs/hypothesis_generation_engine.js");
          const engine = new HypothesisGenerationEngine();
          const hypothesis = engine.getHypothesis(req.params.id);
          if (hypothesis) res.json({ supporting_evidence: hypothesis.supporting_evidence, counter_examples: hypothesis.counter_examples });
          else res.status(404).json({ error: "Hypothesis not found" });
      } catch (e) {
          res.status(500).json({ error: "HHGFS not initialized" });
      }
  });

  app.get("/api/hhgfs/hypothesis/:id/predictions", async (req, res) => {
      try {
          const { HypothesisGenerationEngine } = await import("./src/server/core/hhgfs/hypothesis_generation_engine.js");
          const engine = new HypothesisGenerationEngine();
          const hypothesis = engine.getHypothesis(req.params.id);
          if (hypothesis) res.json(hypothesis.predictions);
          else res.status(404).json({ error: "Hypothesis not found" });
      } catch (e) {
          res.status(500).json({ error: "HHGFS not initialized" });
      }
  });

  app.get("/api/hhgfs/hypothesis/:id/counterexamples", async (req, res) => {
      try {
          const { HypothesisGenerationEngine } = await import("./src/server/core/hhgfs/hypothesis_generation_engine.js");
          const engine = new HypothesisGenerationEngine();
          const hypothesis = engine.getHypothesis(req.params.id);
          if (hypothesis) res.json(hypothesis.counter_examples);
          else res.status(404).json({ error: "Hypothesis not found" });
      } catch (e) {
          res.status(500).json({ error: "HHGFS not initialized" });
      }
  });

  app.post("/api/hhgfs/hypothesis/:id/falsify", async (req, res) => {
      try {
          const { HypothesisGenerationEngine } = await import("./src/server/core/hhgfs/hypothesis_generation_engine.js");
          const engine = new HypothesisGenerationEngine();
          const result = engine.falsify(req.params.id);
          res.json(result);
      } catch (e) {
          res.status(500).json({ error: "HHGFS not initialized" });
      }
  });

  app.post("/api/hhgfs/hypothesis/:id/validate", async (req, res) => {
      try {
          res.json({ success: true, message: "Use the engine directly in tests for proper state." });
      } catch (e) {
          res.status(500).json({ error: "HHGFS not initialized" });
      }
  });

  // --- HCRPE API ROUTES ---
  app.post("/api/hcrpe/research", async (req, res) => {
      try {
          const { CuriosityEngine } = await import("./src/server/core/hcrpe/curiosity_engine.js");
          const engine = new CuriosityEngine();
          const plans = engine.process(req.body.context || "");
          res.json(plans);
      } catch (e) {
          res.status(500).json({ error: "HCRPE not initialized" });
      }
  });

  app.get("/api/hcrpe/questions", async (req, res) => {
      try {
          const { CuriosityEngine } = await import("./src/server/core/hcrpe/curiosity_engine.js");
          const engine = new CuriosityEngine();
          res.json(engine.getQuestions());
      } catch (e) {
          res.status(500).json({ error: "HCRPE not initialized" });
      }
  });

  app.get("/api/hcrpe/gaps", async (req, res) => {
      try {
          const { CuriosityEngine } = await import("./src/server/core/hcrpe/curiosity_engine.js");
          const engine = new CuriosityEngine();
          res.json(engine.getGaps());
      } catch (e) {
          res.status(500).json({ error: "HCRPE not initialized" });
      }
  });

  app.get("/api/hcrpe/priorities", async (req, res) => {
      try {
          const { CuriosityEngine } = await import("./src/server/core/hcrpe/curiosity_engine.js");
          const engine = new CuriosityEngine();
          res.json(engine.getPriorities());
      } catch (e) {
          res.status(500).json({ error: "HCRPE not initialized" });
      }
  });

  app.get("/api/hcrpe/research/:id", async (req, res) => {
      try {
          const { CuriosityEngine } = await import("./src/server/core/hcrpe/curiosity_engine.js");
          const engine = new CuriosityEngine();
          const plan = engine.getPlan(req.params.id);
          if (plan) res.json(plan);
          else res.status(404).json({ error: "Plan not found" });
      } catch (e) {
          res.status(500).json({ error: "HCRPE not initialized" });
      }
  });

  app.post("/api/hcrpe/research/:id/start", async (req, res) => {
      try {
          const { CuriosityEngine } = await import("./src/server/core/hcrpe/curiosity_engine.js");
          const engine = new CuriosityEngine();
          const plan = engine.getPlan(req.params.id);
          if (plan) {
              plan.status = "ACTIVE" as any;
              res.json({ success: true, plan });
          } else {
              res.status(404).json({ error: "Plan not found" });
          }
      } catch (e) {
          res.status(500).json({ error: "HCRPE not initialized" });
      }
  });

  // --- HSDE API ROUTES ---
  app.post("/api/hsde/simulate", async (req, res) => {
      try {
          const { SimulationEngine } = await import("./src/server/core/hsde/simulation_engine.js");
          const engine = new SimulationEngine();
          const branches = engine.simulate(req.body.mission || "", req.body.context || {});
          res.json({ branches });
      } catch (e) {
          res.status(500).json({ error: "HSDE not initialized" });
      }
  });
  
  app.get("/api/hsde/simulations", async (req, res) => {
      try {
          const { SimulationEngine } = await import("./src/server/core/hsde/simulation_engine.js");
          const engine = new SimulationEngine();
          res.json(engine.manager.getAllBranches());
      } catch (e) {
          res.status(500).json({ error: "HSDE not initialized" });
      }
  });
  
  app.get("/api/hsde/simulation/:id", async (req, res) => {
      try {
          const { SimulationEngine } = await import("./src/server/core/hsde/simulation_engine.js");
          const engine = new SimulationEngine();
          const branch = engine.manager.getBranch(req.params.id);
          if (branch) res.json(branch);
          else res.status(404).json({ error: "Branch not found" });
      } catch (e) {
          res.status(500).json({ error: "HSDE not initialized" });
      }
  });
  
  app.get("/api/hsde/discoveries", async (req, res) => {
      try {
          const { SimulationEngine } = await import("./src/server/core/hsde/simulation_engine.js");
          const engine = new SimulationEngine();
          res.json(engine.getDiscoveries());
      } catch (e) {
          res.status(500).json({ error: "HSDE not initialized" });
      }
  });
  
  app.get("/api/hsde/discovery/:id", async (req, res) => {
      try {
          const { SimulationEngine } = await import("./src/server/core/hsde/simulation_engine.js");
          const engine = new SimulationEngine();
          const discovery = engine.repository.get(req.params.id);
          if (discovery) res.json(discovery);
          else res.status(404).json({ error: "Discovery not found" });
      } catch (e) {
          res.status(500).json({ error: "HSDE not initialized" });
      }
  });
  
  app.post("/api/hsde/compare", async (req, res) => {
      try {
          const { SimulationEngine } = await import("./src/server/core/hsde/simulation_engine.js");
          const { SimulationComparator } = await import("./src/server/core/hsde/simulation_comparator.js");
          const engine = new SimulationEngine();
          const branchA = engine.manager.getBranch(req.body.branchA);
          const branchB = engine.manager.getBranch(req.body.branchB);
          
          if (branchA && branchB) {
              const result = SimulationComparator.compare(branchA, branchB);
              res.json(result);
          } else {
              res.status(404).json({ error: "Branches not found" });
          }
      } catch (e) {
          res.status(500).json({ error: "HSDE not initialized" });
      }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
