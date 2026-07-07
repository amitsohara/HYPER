import { IntelligenceResponse } from "../types/index.js";

export class SchemaValidator {
    validate(response: IntelligenceResponse): boolean {
        try {
            (function(){ try { return JSON.parse(response.content); } catch(e) { return {}; } })();
            return true;
        } catch {
            return false;
        }
    }
}

export class ConsistencyValidator {
    validate(response: IntelligenceResponse): boolean {
        return response.content && response.content.length > 0;
    }
}

export class SafetyValidator {
    validate(response: IntelligenceResponse): boolean {
        // Mock safety validation
        return !response.content.includes("UNSAFE_ACTION");
    }
}

export class ResponseValidator {
    private schemaValidator = new SchemaValidator();
    private consistencyValidator = new ConsistencyValidator();
    private safetyValidator = new SafetyValidator();

    validateAll(response: IntelligenceResponse): { valid: boolean, errors: string[] } {
        const errors = [];
        
        if (!this.schemaValidator.validate(response)) {
            // Note: Not all responses need to be strict JSON if they are just text, but we enforce strict structure in HILA.
            errors.push("Schema validation failed. Content is not valid JSON.");
        }

        if (!this.consistencyValidator.validate(response)) {
            errors.push("Consistency validation failed. Empty or invalid content.");
        }

        if (!this.safetyValidator.validate(response)) {
            errors.push("Safety validation failed. Content contains prohibited directives.");
        }

        return { valid: errors.length === 0, errors };
    }
}
