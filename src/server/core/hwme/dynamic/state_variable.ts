export enum StateVariableType {
    NUMERIC = "NUMERIC",
    BOOLEAN = "BOOLEAN",
    ENUM = "ENUM",
    VECTOR = "VECTOR",
    MATRIX = "MATRIX",
    DISTRIBUTION = "DISTRIBUTION",
    PROBABILITY = "PROBABILITY"
}

export interface StateVariable {
    id: string;
    name: string;
    type: StateVariableType;
    value: any;
    confidence: number;
    uncertainty: number;
    source: string;
    last_update: number;
}
