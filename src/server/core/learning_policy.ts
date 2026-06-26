export function evaluatePolicy(improvement: any, validationResult: any) {
    if (!validationResult.accepted) return false;
    if (validationResult.regression_detected) return false;
    
    // Auto-apply prompt/template/routing
    const autoApplyTypes = ['Prompt improvement', 'Report template improvement', 'Router improvement'];
    if (autoApplyTypes.some(t => improvement.target_component.includes(t))) {
        return true;
    }
    
    // Default to true for now, assuming validation passed
    return true;
}
