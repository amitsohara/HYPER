const fs = require('fs');

let path = 'src/server/core/hpe1/engines/goalDecompositionEngine.ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
    'export class GoalDecompositionEngine {',
    `export class GoalDecompositionEngine {
    private cache: Map<string, Record<string, AtomicTask>> = new Map();
    private activeRequests: Map<string, Promise<Record<string, AtomicTask>>> = new Map();`
);

const originalDecomposeStart = `async decompose(highLevelGoal: GoalObject): Promise<Record<string, AtomicTask>> {`;
const memoizedDecompose = `async decompose(highLevelGoal: GoalObject): Promise<Record<string, AtomicTask>> {
        const cacheKey = highLevelGoal.name + highLevelGoal.description;
        if (this.cache.has(cacheKey)) return this.cache.get(cacheKey)!;
        if (this.activeRequests.has(cacheKey)) return await this.activeRequests.get(cacheKey)!;
        
        const req = this.doDecompose(highLevelGoal).then(res => {
            this.cache.set(cacheKey, res);
            this.activeRequests.delete(cacheKey);
            return res;
        });
        this.activeRequests.set(cacheKey, req);
        return req;
    }
    
    private async doDecompose(highLevelGoal: GoalObject): Promise<Record<string, AtomicTask>> {`;

code = code.replace(originalDecomposeStart, memoizedDecompose);
fs.writeFileSync(path, code);
console.log("Patched GoalDecompositionEngine to memoize requests");
