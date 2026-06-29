export enum WorldEntityType {
    PERSON = "PERSON",
    ROBOT = "ROBOT",
    AI_AGENT = "AI_AGENT",
    CITY = "CITY",
    COUNTRY = "COUNTRY",
    PLANET = "PLANET",
    SATELLITE = "SATELLITE",
    BUILDING = "BUILDING",
    VEHICLE = "VEHICLE",
    COMPANY = "COMPANY",
    ORGANIZATION = "ORGANIZATION",
    RESOURCE = "RESOURCE",
    MATERIAL = "MATERIAL",
    ENERGY_SOURCE = "ENERGY_SOURCE",
    DEVICE = "DEVICE",
    SOFTWARE = "SOFTWARE",
    PROCESS = "PROCESS",
    SYSTEM = "SYSTEM",
    DOCUMENT = "DOCUMENT",
    EVENT = "EVENT",
    LOCATION = "LOCATION",
    ENVIRONMENT = "ENVIRONMENT",
    LAW = "LAW",
    RULE = "RULE",
    UNKNOWN = "UNKNOWN"
}

export enum WorldRelationshipType {
    PART_OF = "PART_OF",
    CONNECTED_TO = "CONNECTED_TO",
    USES = "USES",
    PRODUCES = "PRODUCES",
    CONSUMES = "CONSUMES",
    CAUSES = "CAUSES",
    DEPENDS_ON = "DEPENDS_ON",
    SUPPORTS = "SUPPORTS",
    CONFLICTS_WITH = "CONFLICTS_WITH",
    LOCATED_IN = "LOCATED_IN",
    OWNS = "OWNS",
    CONTROLS = "CONTROLS",
    AFFECTS = "AFFECTS",
    ENABLES = "ENABLES",
    BLOCKS = "BLOCKS",
    INTERACTS_WITH = "INTERACTS_WITH"
}

export interface WorldEntity {
    entity_id: string;
    entity_type: WorldEntityType;
    name: string;
    description: string;
    properties: Record<string, any>;
    capabilities: string[];
    limitations: string[];
    state: string;
    confidence: number;
    source: string;
    created_at: number;
    updated_at: number;
}

export interface WorldRelationship {
    relationship_id: string;
    source_entity: string;
    target_entity: string;
    relationship_type: WorldRelationshipType;
    strength: number;
    confidence: number;
    evidence: string;
    source_module: string;
}

export interface WorldSystem {
    system_id: string;
    name: string;
    subsystems: string[]; // Entity IDs
    dependencies: string[]; // Entity IDs
    inputs: string[]; // Resource IDs
    outputs: string[]; // Resource IDs
    constraints: string[]; // Constraint IDs
}

export interface WorldProcess {
    process_id: string;
    name: string;
    inputs: string[];
    outputs: string[];
    resources: string[];
    dependencies: string[];
    duration: string;
    risk: string;
}

export interface WorldConstraint {
    constraint_id: string;
    name: string;
    type: string; // Budget, Time, Physics, Energy, Law, Safety, Distance, Mass, Radiation, Gravity, Temperature, Communication Delay
    description: string;
    severity: string;
}

export interface WorldResource {
    resource_id: string;
    name: string;
    type: string; // Energy, Food, Water, Money, People, Machines, Data, Time, Materials, Computing, Bandwidth
    quantity?: string;
    status: string;
}

export interface WorldEnvironment {
    environment_id: string;
    name: string;
    conditions: string[];
    hazards: string[];
    resources: string[]; // Resource IDs
    limitations: string[];
}

export interface WorldAgent {
    agent_id: string;
    name: string;
    type: string; // Human, Robot, AI, Organization, Government
    goals: string[];
    capabilities: string[];
    resources: string[]; // Resource IDs
    knowledge: string[];
    authority: string;
    responsibilities: string[];
}

export interface WorldEvent {
    event_id: string;
    name: string;
    type: string;
    description: string;
    probability?: number;
    impact?: string;
}

export interface WorldModel {
    entities: Map<string, WorldEntity>;
    relationships: Map<string, WorldRelationship>;
    systems: Map<string, WorldSystem>;
    processes: Map<string, WorldProcess>;
    constraints: Map<string, WorldConstraint>;
    resources: Map<string, WorldResource>;
    environments: Map<string, WorldEnvironment>;
    agents: Map<string, WorldAgent>;
    events: Map<string, WorldEvent>;
}
