export interface ProcessEffect {
    effect_id: string;
    target_variable: string;
    operation: string; // e.g., 'ADD', 'SUBTRACT', 'SET'
    value: any;
    description: string;
}
