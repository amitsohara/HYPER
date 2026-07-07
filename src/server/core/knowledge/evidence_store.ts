import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'evidence_store.json');

function ensureDb() {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, '[]');
}

export function saveEvidence(evidenceList: any[]) {
    ensureDb();
    let existing = []; try { existing = JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); } catch(e) { existing = []; }
    existing.push(...evidenceList);
    fs.writeFileSync(DB_PATH, JSON.stringify(existing, null, 2));
}

export function getEvidence() {
    ensureDb();
    try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); } catch(e) { return [] as any; }
}