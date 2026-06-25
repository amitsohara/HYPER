import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'persistent_brain.json');

export interface MemoryDB {
  episodic: any[];
  semantic: any[];
  procedural: any[];
  concepts: any[];
  beliefs: any[];
}

const defaultDB: MemoryDB = {
  episodic: [],
  semantic: [],
  procedural: [],
  concepts: [],
  beliefs: []
};

export class PersistentBrainDB {
  static async load(): Promise<MemoryDB> {
    try {
      if (fs.existsSync(DB_FILE)) {
        const data = await fs.promises.readFile(DB_FILE, 'utf-8');
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load DB', e);
    }
    return defaultDB;
  }

  static async save(db: MemoryDB) {
    try {
      await fs.promises.writeFile(DB_FILE, JSON.stringify(db, null, 2));
    } catch (e) {
      console.error('Failed to save DB', e);
    }
  }
}
