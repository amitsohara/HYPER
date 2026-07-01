import { WorldEntityType, WorldRelationshipType } from "../hwme/world_types.js";

export { WorldEntityType, WorldRelationshipType };

export interface WorldObjectBase {
    id: string;
    version: number;
    confidence: number;
    provenance: string;
    createdAt: number;
    updatedAt: number;
    researchTraceability?: {
        hirqIds: string[];
        wcpId: string;
        hctIds: string[];
    };
    metadata: Record<string, any>;
}

export interface HWMEEntity extends WorldObjectBase {
    type: WorldEntityType | string;
    name: string;
    attributes: Record<string, any>;
    state: string;
    temporalState: string;
    spatialContext?: string;
    evidence: string[];
}

export interface HWMERelationship extends WorldObjectBase {
    sourceId: string;
    targetId: string;
    type: WorldRelationshipType | string;
    weight: number;
    isCausal: boolean;
    temporalValidity?: {
        start: number;
        end?: number;
    };
    evidence: string[];
}

export interface HWMEGoal extends WorldObjectBase {
    name: string;
    description: string;
    status: 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'SUSPENDED';
    priority: number;
    subGoalIds: string[];
    parentGoalId?: string;
    constraints: string[];
    dependencies: string[];
    completionCriteria: string[];
}

export interface TemporalSnapshot {
    snapshotId: string;
    timestamp: number;
    description: string;
    entities: Map<string, HWMEEntity>;
    relationships: Map<string, HWMERelationship>;
}

export interface CanonicalWorld {
    id: string;
    version: number;
    entities: Map<string, HWMEEntity>;
    relationships: Map<string, HWMERelationship>;
    goals: Map<string, HWMEGoal>;
    context: Record<string, any>;
}

export interface SimulationBranch {
    branchId: string;
    baseVersion: number;
    entities: Map<string, HWMEEntity>;
    relationships: Map<string, HWMERelationship>;
    goals: Map<string, HWMEGoal>;
    description: string;
}
