const fs = require('fs');

const path = 'server.ts';
let code = fs.readFileSync(path, 'utf-8');

const target = `        // Periodic Global State Sync for frontend (Dashboard, HII, Missions, Diagnostics)
        setInterval(async () => {
            try {
                // Dashboard metrics
                let hcnsThroughput = 1250;
                let metrics = {
                    activeMissions: missions.length,
                    overallHII: 91.8,
                    cpuUsage: Math.floor(Math.random() * 15 + 30),
                    gpuUsage: Math.floor(Math.random() * 10 + 10),
                    memoryUsage: Math.floor((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100),
                    hcnsThroughput: hcnsThroughput,
                    activeSpecialists: 15,
                    certificationStatus: "PLATINUM",
                    llmDependencyRatio: 0.05, 
                    autonomousIntelligenceScore: 0.95
                };

                // HII
                const hcoMetrics = hco.getMetrics().getMetrics();
                let hii = {
                    overallIntelligence: 0.918,
                    metrics: {
                        missionSuccessRate: 0.94,
                        reasoningDepth: 0.88,
                        simulationAccuracy: 0.92,
                        anomalyDetectionRate: 0.96
                    },
                    subsystems: {
                        perception: 0.96,
                        workingMemory: 0.88,
                        longTermMemory: 0.90,
                        reasoning: 0.92,
                        simulation: 0.94,
                        arbitration: 0.91
                    },
                    certificationLevel: "PLATINUM"
                };

                // Diagnostics
                const state = hco.getTelemetry().getState();
                let diagnostics = {
                    worldModel: state.worldModel || { entities: [], relationships: [] },
                    decisionCandidates: state.decisionCandidates || [],
                    activeModules: state.activeModules || [],
                    workingMemory: state.workingMemory || [],
                    beliefs: state.beliefs || [],
                    missionStage: state.missionStage || "IDLE",
                    trace: hcoMetrics || {}
                };`;

const replacement = `        // Periodic Global State Sync for frontend (Dashboard, HII, Missions, Diagnostics)
        setInterval(async () => {
            try {
                const state = hco.getTelemetry().getState();
                const hcoMetrics = hco.getMetrics().getMetrics();
                const hiiCalc = HIICalculator.calculate(hco.getTelemetry(), hco.getMetrics());

                let activeMissionsList = missions.map(m => ({
                    id: m.mission_id || m.id,
                    name: m.mission_text || m.name,
                    status: m.status || "RUNNING",
                    hii: hiiCalc.overallIntelligence * 100,
                    llmDependency: hcoMetrics.llmDependencyRatio
                }));
                try {
                    const { HyperMindOS } = await import("./src/server/core/hos1/index.js");
                    const hos = HyperMindOS.getInstance();
                    if (hos && hos.missionManager) {
                        const ams = hos.missionManager.getActiveMissions();
                        if (ams && ams.length > 0) {
                            activeMissionsList = ams.map(m => ({
                                id: m.id,
                                name: m.objective,
                                status: m.status,
                                hii: hiiCalc.overallIntelligence * 100,
                                llmDependency: hcoMetrics.llmDependencyRatio
                            }));
                        }
                    }
                } catch(e) {}

                let metrics = {
                    activeMissions: activeMissionsList.length,
                    activePlans: hcoMetrics.activePlans || 0,
                    overallHII: hiiCalc.overallIntelligence * 100,
                    cpuUsage: hcoMetrics.cpuUsage,
                    gpuUsage: hcoMetrics.gpuUsage,
                    memoryUsage: hcoMetrics.memoryUsage,
                    hcnsThroughput: hcoMetrics.throughput,
                    activeSpecialists: hcoMetrics.activeSpecialists,
                    certificationStatus: hiiCalc.certificationLevel,
                    llmDependencyRatio: hcoMetrics.llmDependencyRatio, 
                    autonomousIntelligenceScore: hcoMetrics.autonomousIntelligenceScore,
                    engineStatus: hcoMetrics.engineStatus || "ONLINE"
                };

                let hii = {
                    overallIntelligence: hiiCalc.overallIntelligence,
                    metrics: hiiCalc.metrics,
                    subsystems: hiiCalc.subsystems,
                    certificationLevel: hiiCalc.certificationLevel
                };

                let diagnostics = {
                    worldModel: state.worldModel || { entities: [], relationships: [] },
                    decisionCandidates: state.decisionCandidates || [],
                    activeModules: state.activeModules || [],
                    workingMemory: state.workingMemory || [],
                    beliefs: state.beliefs || [],
                    missionStage: state.missionStage || "IDLE",
                    trace: hcoMetrics || {}
                };`;

code = code.replace(target, replacement);
fs.writeFileSync(path, code);
console.log("Replaced!");
