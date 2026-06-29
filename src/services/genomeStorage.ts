const STORAGE_KEY = 'hypermind_genome_history';

export const GenomeStorageService = {
  saveSnapshot: (genome: any) => {
    try {
      const history = GenomeStorageService.getHistory();
      const existingIndex = history.findIndex((g: any) => g.version === genome.version);
      
      if (existingIndex >= 0) {
        history[existingIndex] = genome;
      } else {
        history.push(genome);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      return true;
    } catch (e) {
      console.error('Failed to save genome to localStorage', e);
      return false;
    }
  },

  getHistory: (): any[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load genome history from localStorage', e);
    }
    return [];
  },

  getSnapshot: (version: string): any | null => {
    const history = GenomeStorageService.getHistory();
    return history.find((g: any) => g.version === version) || null;
  }
};
