export class StateValidator {
    static validate(state: any, update: any): { valid: boolean, errors: string[] } {
        const errors: string[] = [];
        
        // Example logic to detect impossible transitions or negative resources
        if (update && update.changes) {
            for (const [key, val] of Object.entries(update.changes)) {
                if (typeof val === 'number' && val < 0 && key.includes('population')) {
                     errors.push(`Negative population not allowed: ${val}`);
                }
                // Check negative resources
                if (typeof val === 'number' && val < 0 && (key.includes('resource') || key.includes('water') || key.includes('energy'))) {
                     errors.push(`Negative resource not allowed: ${key} = ${val}`);
                }
            }
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }
}
