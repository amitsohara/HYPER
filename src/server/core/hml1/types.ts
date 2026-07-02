export interface HyperMindIntelligenceIndex {
    version: string;
    timestamp: number;
    overallIntelligence: number;
    
    subsystems: {
        perception: number;
        worldModel: number;
        conceptFormation: number;
        reasoning: number;
        planning: number;
        simulation: number;
        decisionMaking: number;
        actionExecution: number;
        lifelongLearning: number;
        sensorimotorSkills: number;
    };

    metrics: {
        missionSuccessRate: number;
        recoveryRate: number;
        explainability: number;
        safetyCompliance: number;
    };

    certificationLevel: "NONE" | "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
}

export interface MissionScore {
    missionId: string;
    scenarioId: string;
    timestamp: number;
    overallScore: number;
    success: boolean;
    durationMs: number;
    subsystemScores: Record<string, number>;
}

export interface MissionScenarioDefinition {
    id: string;
    name: string;
    domain: string;
    description: string;
    inputs: any[];
    expectedOutcomes: any[];
    constraints: any;
}

export interface MissionTrace {
    missionId: string;
    events: any[]; // Array of HCNS events
    startTime: number;
    endTime: number;
}
