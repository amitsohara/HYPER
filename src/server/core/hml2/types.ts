export interface LiveInput {
    id: string;
    type: "RTSP" | "WEBSOCKET" | "API" | "FILE" | "SIMULATION";
    source: string;
    status: "CONNECTED" | "DISCONNECTED" | "ERROR";
}

export interface MissionInsights {
    id: string;
    missionId: string;
    bottlenecks: string[];
    anomalies: string[];
    learningOpportunities: string[];
}

export interface DashboardMetrics {
    activeMissions: number;
    overallHII: number;
    cpuUsage: number;
    gpuUsage: number;
    memoryUsage: number;
    hcnsThroughput: number;
    activeSpecialists: number;
}
