import { MissionResultManager } from "./src/server/core/hmrc1/managers/MissionResultManager.js";
import * as fs from 'fs';
const logFile = 'server_logs.txt';
fs.writeFileSync(logFile, '--- START ---\n');
const origLog = console.log;
const origError = console.error;
console.log = function(...args) {
    origLog.apply(console, args);
    fs.appendFileSync(logFile, args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ') + '\n');
};
console.error = function(...args) {
    origError.apply(console, args);
    fs.appendFileSync(logFile, 'ERROR: ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ') + '\n');
};
import cors from "cors";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { initHyperMindPlatform } from "./bootstrap.js";
import { initSociety } from "./src/server/core/pipeline/init_society.js";
import { HILASpecialist } from "./src/server/core/hila1/hilaSpecialist.js";
import { HyperMindEventMesh } from "./src/server/core/hcns01/eventMesh.js";
import { CognitiveDomain } from "./src/server/core/hcns01/types.js";
import { HIICalculator } from "./src/server/core/hco1/metrics/HII_Calculator.js";
import { MissionLogger } from "./src/server/core/logging/MissionLogger.js";

async function startServer() {
  await initHyperMindPlatform();
  const app = express();
  initSociety().catch(console.error);
  MissionLogger.getInstance();
  MissionResultManager.getInstance();

  const PORT = 3000;
  app.use(cors());
  app.use(express.json());

  // API ROUTES
  app.post("/api/hml/missions/deploy", async (req, res) => {
    try {
        const directive = req.body.directive || "Optimize heavy traffic at Target Area.";
        HyperMindEventMesh.getInstance().publish({
            type: "WORLD_OBSERVATION",
            domain: CognitiveDomain.OBSERVATION,
            priority: 1,
            source: "MissionControlUI",
            payload: {
                missionDirective: directive,
                context: {
                    type: "USER_DIRECTIVE",
                    description: directive
                },
                entity: { name: "User Request", type: "MISSION_DIRECTIVE" },
                additionalEntities: [
                    { id: "e1", name: "Target Area", type: "INTERSECTION", properties: { status: "congested" } },
                    { id: "e2", name: "Main Road", type: "ROAD", properties: { lanes: 4 } },
                    { id: "e3", name: "Vehicle 101", type: "VEHICLE", properties: { speed: 5, status: "stopped" } },
                    { id: "e4", name: "Vehicle 102", type: "VEHICLE", properties: { speed: 0, status: "stopped" } },
                    { id: "e5", name: "Signal A", type: "SIGNAL", properties: { state: "red", timer: 45 } },
                    { id: "e6", name: "Pedestrian Flow", type: "PEDESTRIAN", properties: { density: "high" } },
                    { id: "e7", name: "Minor Accident", type: "ACCIDENT", properties: { severity: "low", blockingLanes: 1 } },
                    { id: "e8", name: "Debris", type: "OBSTACLE", properties: { size: "small" } }
                ]
            }
        });
        res.json({ success: true });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/hml/dashboard", async (req, res) => {
      try {
          const mesh = HyperMindEventMesh.getInstance();
          const meshMetrics = mesh.getMetrics();
          
          const hila = HILASpecialist.getInstance();
          const metrics = hila?.arbitrator?.telemetry?.getMetrics();
          
          res.json({
              throughput: meshMetrics.throughput,
              latency: meshMetrics.latency,
              confidence: 0.92,
              activeModules: 14,
              totalEvents: meshMetrics.throughput,
              hilaCalls: metrics ? metrics.totalRequests : 0
          });
      } catch (e: any) {
          res.status(500).json({ error: e.message });
      }
  });

  app.get("/api/hml/hii", async (req, res) => {
      try {
          const { CognitiveObservatory } = await import("./src/server/core/hco1/core/CognitiveObservatory.js");
          const obs = CognitiveObservatory.getInstance();
          const hii = HIICalculator.calculate(obs.getTelemetry(), obs.getMetrics());
          res.json(hii);
      } catch (e: any) {
          res.status(500).json({ error: e.message });
      }
  });

  app.get("/api/hml/missions", async (req, res) => {
      res.json([{
          id: "m_1",
          name: "Global Threat Assessment",
          status: "RUNNING",
          progress: 45
      }]);
  });

  app.get("/api/hml/diagnostics", async (req, res) => {
      try {
          const hila = HILASpecialist.getInstance();
          res.json({
              cpu: 45,
              memory: 62,
              network: 12,
              uptime: process.uptime(),
              engineStatus: "OPTIMAL",
              workingMemory: [],
              hilaProviders: []
          });
      } catch (e: any) {
          res.status(500).json({ error: e.message });
      }
  });

  app.get("/api/hmrc/results", (req, res) => { 
    try {
      const manager = MissionResultManager.getInstance();
      res.json(manager.getResults());
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/hmrc/result/:missionId", (req, res) => {
    try {
      const manager = MissionResultManager.getInstance();
      const result = manager.getResult(req.params.missionId);
      if (result) res.json(result); else res.status(404).json({ error: "Not found" });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // VITE MIDDLEWARE
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

  const server = app.listen(PORT, "0.0.0.0", async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    
    // Attach HCO Streamer
    try {
        const { CognitiveObservatory } = await import("./src/server/core/hco1/core/CognitiveObservatory.js");
        const hco = CognitiveObservatory.getInstance();
        hco.getStreamer().attach(server);
        console.log("HyperMind Cognitive Observatory (HCO) Streaming attached.");
    } catch (err) {
        console.error("Failed to attach HCO:", err);
    }
  });
}

startServer();
