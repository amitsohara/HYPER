import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'strategies.json');

export interface Strategy {
    id: string;
    name: string;
    domain: string;
    steps: string[];
    version: number;
}

function ensureDb() {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, '[]');
}

export function getStrategies(): Strategy[] {
    ensureDb();
    try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); } catch(e) { return [] as any; }
}

export function saveStrategy(strategy: Strategy) {
    const strategies = getStrategies();
    const index = strategies.findIndex(s => s.id === strategy.id);
    if (index >= 0) {
        strategies[index] = strategy;
    } else {
        strategies.push(strategy);
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(strategies, null, 2));
}
