import React, { useState, useEffect } from "react";
import { Activity, Network, Box, Link2, Zap, LayoutDashboard, Cpu, Database, Save, Check } from "lucide-react";
import { safeFetchJSON } from "../fetchUtils";
import { GenomeStorageService } from "../services/genomeStorage";

export function CognitiveGenomeDashboard() {
  const [genome, setGenome] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [compareVersion, setCompareVersion] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchGenomeData();
    const interval = setInterval(fetchGenomeData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchGenomeData = async () => {
    try {
      const currentData = await safeFetchJSON("/api/genome", {}, null);
      // We will still fetch server history, but also consider local storage history.
      const serverHistoryData = await safeFetchJSON("/api/genome/history", {}, []);
      const localHistoryData = GenomeStorageService.getHistory();
      
      // Merge unique versions from both
      const mergedHistory = [...serverHistoryData];
      for (const lh of localHistoryData) {
          if (!mergedHistory.find(h => h.version === lh.version)) {
              mergedHistory.push(lh);
          }
      }
      
      // Sort merged history by timestamp descending
      mergedHistory.sort((a, b) => b.timestamp - a.timestamp);
      
      if (mergedHistory.length > 0) setHistory(mergedHistory);
      
      // If a specific version is selected, find it in history, otherwise use current
      let displayData = currentData;
      if (selectedVersion) {
         const pastVersion = mergedHistory.find((g: any) => g.version === selectedVersion);
         if (pastVersion) displayData = pastVersion;
      }

      if (displayData) {
        setGenome(displayData);
        if (!selectedModule && displayData.modules?.length > 0) {
          setSelectedModule(displayData.modules[0]);
        } else if (selectedModule) {
            const updatedMod = displayData.modules.find((m: any) => m.id === selectedModule.id);
            if (updatedMod) setSelectedModule(updatedMod);
        }
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
     fetchGenomeData();
  }, [selectedVersion]);

  const handleSaveToLocalStorage = () => {
      if (genome) {
          const success = GenomeStorageService.saveSnapshot(genome);
          if (success) {
              setSaveSuccess(true);
              setTimeout(() => setSaveSuccess(false), 2000);
              fetchGenomeData(); // Refresh history
          }
      }
  };

  if (loading && !genome) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400">
        <Activity className="w-8 h-8 animate-spin mb-4" />
        <p>Loading Cognitive Genome Map...</p>
      </div>
    );
  }

  if (error || !genome) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-red-400 bg-red-900/20 border border-red-900/50 rounded-xl">
        <p>Failed to load genome data: {error}</p>
      </div>
    );
  }

  const getLayerColor = (layer: string) => {
    switch (layer) {
        case 'Core': return 'bg-fuchsia-900/30 text-fuchsia-300 border-fuchsia-800/50';
        case 'Cognitive': return 'bg-purple-900/30 text-purple-300 border-purple-800/50';
        case 'Agents': return 'bg-blue-900/30 text-blue-300 border-blue-800/50';
        case 'Learning': return 'bg-emerald-900/30 text-emerald-300 border-emerald-800/50';
        case 'Execution': return 'bg-amber-900/30 text-amber-300 border-amber-800/50';
        case 'Observability': return 'bg-cyan-900/30 text-cyan-300 border-cyan-800/50';
        default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getStatusIndicator = (status: string) => {
      if (status === 'Active') return <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>;
      if (status === 'Degraded') return <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>;
      return <span className="w-2 h-2 rounded-full bg-slate-500"></span>;
  };

  const compareGenome = compareVersion ? history.find(h => h.version === compareVersion) : null;

  const allModules = React.useMemo(() => {
     if (!compareGenome) return genome.modules.map((m: any) => ({ ...m, _diff: 'unchanged' }));
     const map = new Map();
     compareGenome.modules.forEach((m: any) => map.set(m.id, { ...m, _diff: 'removed' }));
     genome.modules.forEach((m: any) => {
        if (map.has(m.id)) {
            const pastMod = map.get(m.id);
            if (pastMod.status !== m.status || pastMod.layer !== m.layer || pastMod.description !== m.description) {
                map.set(m.id, { ...m, _diff: 'modified', _past: pastMod });
            } else {
                map.set(m.id, { ...m, _diff: 'unchanged' });
            }
        } else {
            map.set(m.id, { ...m, _diff: 'added' });
        }
     });
     return Array.from(map.values());
  }, [genome, compareGenome]);

  const allRelationships = React.useMemo(() => {
     if (!compareGenome) return genome.relationships.map((r: any) => ({ ...r, _diff: 'unchanged' }));
     const map = new Map();
     const keyFn = (r: any) => `${r.source}->${r.target}(${r.type})`;
     compareGenome.relationships.forEach((r: any) => map.set(keyFn(r), { ...r, _diff: 'removed' }));
     genome.relationships.forEach((r: any) => {
         const k = keyFn(r);
         if (map.has(k)) {
             map.set(k, { ...r, _diff: 'unchanged' });
         } else {
             map.set(k, { ...r, _diff: 'added' });
         }
     });
     return Array.from(map.values());
  }, [genome, compareGenome]);

  const selectedModuleDeps = allRelationships.filter((r: any) => r.source === selectedModule?.id);
  const selectedModuleProvides = allRelationships.filter((r: any) => r.target === selectedModule?.id);

  const getDiffStyles = (diff: string) => {
      if (diff === 'added') return 'border-emerald-500/50 bg-emerald-900/20';
      if (diff === 'removed') return 'border-red-500/50 bg-red-900/20 opacity-70';
      if (diff === 'modified') return 'border-amber-500/50 bg-amber-900/20';
      return 'border-slate-800 bg-black/30';
  };
  
  const getDiffBadge = (diff: string) => {
      if (diff === 'added') return <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-900/50 text-emerald-400 border border-emerald-500/30">+ Added</span>;
      if (diff === 'removed') return <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-red-900/50 text-red-400 border border-red-500/30">- Removed</span>;
      if (diff === 'modified') return <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-900/50 text-amber-400 border border-amber-500/30">~ Modified</span>;
      return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-fuchsia-500" />
            Cognitive Genome
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Versioned structural map of HyperMind's cognitive architecture and capability dependencies.
          </p>
        </div>
        <div className="flex flex-col items-end">
            <div className="flex items-center gap-3 mb-2">
                <button
                    onClick={handleSaveToLocalStorage}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        saveSuccess 
                            ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/50' 
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                    }`}
                >
                    {saveSuccess ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                    {saveSuccess ? 'Saved' : 'Save Snapshot'}
                </button>
                <div className="w-px h-6 bg-slate-800"></div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 uppercase tracking-widest">Compare</span>
                    <select 
                       value={compareVersion || ""} 
                       onChange={(e) => setCompareVersion(e.target.value || null)}
                       className="bg-slate-900 border border-slate-700 text-amber-300 font-mono font-bold text-sm rounded-lg px-2 py-1 outline-none focus:border-amber-500 transition-colors"
                    >
                        <option value="">None</option>
                        {history.filter(h => h.version !== (selectedVersion || genome.version)).map((h: any) => (
                            <option key={h.version} value={h.version}>v{h.version}</option>
                        ))}
                    </select>
                </div>
                <div className="w-px h-6 bg-slate-800"></div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 uppercase tracking-widest">Version</span>
                    <select 
                       value={selectedVersion || genome.version} 
                       onChange={(e) => setSelectedVersion(e.target.value === genome.version && history[0]?.version === genome.version ? null : e.target.value)}
                       className="bg-slate-900 border border-slate-700 text-fuchsia-300 font-mono font-bold text-sm rounded-lg px-2 py-1 outline-none focus:border-fuchsia-500 transition-colors"
                    >
                        {history.map((h: any) => (
                            <option key={h.version} value={h.version}>v{h.version}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1">
                <Activity className="w-3 h-3" /> Updated {new Date(genome.timestamp).toLocaleTimeString()}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Modules List */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#111] border border-slate-800 p-5 rounded-2xl shadow-sm h-[600px] flex flex-col">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Box className="w-4 h-4 text-slate-400" /> System Modules
            </h3>
            
            <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-2">
              {allModules.map((mod: any) => (
                <button
                  key={mod.id}
                  onClick={() => setSelectedModule(mod)}
                  className={`w-full text-left p-3 rounded-xl border transition-colors ${
                      selectedModule?.id === mod.id 
                        ? "ring-2 ring-fuchsia-500/50" 
                        : "hover:border-slate-600"
                  } ${getDiffStyles(mod._diff)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        {getStatusIndicator(mod.status)}
                        <span className={`font-semibold text-slate-200 ${mod._diff === 'removed' ? 'line-through text-slate-500' : ''}`}>{mod.name}</span>
                    </div>
                    <span className="text-xs font-mono text-slate-500">{mod.id}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getLayerColor(mod.layer)}`}>
                        {mod.layer}
                      </span>
                      {getDiffBadge(mod._diff)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Module Details & Graph */}
        <div className="lg:col-span-2 space-y-6">
          {selectedModule ? (
            <div className="bg-[#111] border border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[600px]">
              {/* Detail Header */}
              <div className="p-6 border-b border-slate-800 bg-slate-900/30 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-xs uppercase font-bold px-2 py-0.5 rounded border ${getLayerColor(selectedModule.layer)}`}>
                      {selectedModule.layer} Layer
                    </span>
                    <span className="text-xs font-mono text-slate-500 bg-black/40 px-2 py-0.5 rounded border border-slate-800">
                      {selectedModule.id}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                      {selectedModule.name}
                  </h3>
                  <p className="text-slate-400 mt-2 max-w-lg">{selectedModule.description}</p>
                </div>
                
                <div className="shrink-0 flex flex-col items-end bg-black/40 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Status</span>
                  <div className="flex items-center gap-2">
                      {getStatusIndicator(selectedModule.status)}
                      <span className={`text-sm font-semibold ${selectedModule.status === 'Active' ? 'text-emerald-400' : selectedModule.status === 'Degraded' ? 'text-yellow-400' : 'text-slate-400'}`}>
                          {selectedModule.status}
                      </span>
                  </div>
                </div>
              </div>

              {/* Dependencies & Capabilities Panel */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 bg-black/10">
                  
                  {/* Dependencies */}
                  <div className="space-y-6">
                      {/* Outgoing */}
                      <div>
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <Link2 className="w-3 h-3" /> Connects To
                          </h4>
                          {selectedModuleDeps.length === 0 ? (
                              <p className="text-sm text-slate-600 italic">No outgoing dependencies.</p>
                          ) : (
                              <div className="space-y-2">
                                  {selectedModuleDeps.map((rel: any, i: number) => {
                                      const targetMod = allModules.find((m: any) => m.id === rel.target);
                                      return (
                                          <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg border ${getDiffStyles(rel._diff)}`}>
                                              <span className="text-[10px] text-fuchsia-400 uppercase font-bold bg-fuchsia-900/20 px-1.5 py-0.5 rounded border border-fuchsia-900/50 w-24 text-center shrink-0">
                                                  {rel.type}
                                              </span>
                                              <div className="flex flex-col min-w-0">
                                                  <span className={`text-sm font-medium text-slate-300 truncate ${rel._diff === 'removed' ? 'line-through text-slate-500' : ''}`}>{targetMod?.name || rel.target}</span>
                                                  <span className="text-[10px] text-slate-500">{targetMod?.layer}</span>
                                              </div>
                                              <div className="ml-auto">{getDiffBadge(rel._diff)}</div>
                                          </div>
                                      );
                                  })}
                              </div>
                          )}
                      </div>

                      {/* Incoming */}
                      <div>
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                              <Database className="w-3 h-3" /> Receives From
                          </h4>
                          {selectedModuleProvides.length === 0 ? (
                              <p className="text-sm text-slate-600 italic">No incoming dependencies.</p>
                          ) : (
                              <div className="space-y-2">
                                  {selectedModuleProvides.map((rel: any, i: number) => {
                                      const sourceMod = allModules.find((m: any) => m.id === rel.source);
                                      return (
                                          <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg border ${getDiffStyles(rel._diff)}`}>
                                              <div className="mr-auto">{getDiffBadge(rel._diff)}</div>
                                              <div className="flex flex-col min-w-0 flex-1 items-end text-right">
                                                  <span className={`text-sm font-medium text-slate-300 truncate ${rel._diff === 'removed' ? 'line-through text-slate-500' : ''}`}>{sourceMod?.name || rel.source}</span>
                                                  <span className="text-[10px] text-slate-500">{sourceMod?.layer}</span>
                                              </div>
                                              <span className="text-[10px] text-blue-400 uppercase font-bold bg-blue-900/20 px-1.5 py-0.5 rounded border border-blue-900/50 w-24 text-center shrink-0">
                                                  {rel.type}
                                              </span>
                                          </div>
                                      );
                                  })}
                              </div>
                          )}
                      </div>
                  </div>

                  {/* Capabilities Map */}
                  <div className="bg-slate-900/20 border border-slate-800 rounded-xl p-5">
                      <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Zap className="w-4 h-4" /> Capabilities
                      </h4>
                      <div className="space-y-4">
                          {genome.capabilities.filter((c: any) => c.dependent_modules.includes(selectedModule.id)).length === 0 ? (
                              <p className="text-sm text-slate-600 italic">No explicit capabilities mapped to this module.</p>
                          ) : (
                              genome.capabilities.filter((c: any) => c.dependent_modules.includes(selectedModule.id)).map((cap: any, i: number) => (
                                  <div key={i} className="bg-amber-900/10 border border-amber-900/30 p-3 rounded-lg">
                                      <span className="block font-semibold text-amber-200 text-sm mb-2">{cap.capability}</span>
                                      <div className="flex flex-wrap gap-1.5">
                                          {cap.dependent_modules.map((depId: string, j: number) => {
                                              const depMod = genome.modules.find((m: any) => m.id === depId);
                                              const isCurrent = depId === selectedModule.id;
                                              return (
                                                  <span key={j} className={`text-[10px] px-2 py-0.5 rounded border ${isCurrent ? 'bg-amber-900/40 border-amber-500/50 text-amber-200' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                                                      {depMod?.name || depId}
                                                  </span>
                                              );
                                          })}
                                      </div>
                                  </div>
                              ))
                          )}
                      </div>
                  </div>

              </div>
            </div>
          ) : (
            <div className="bg-[#111] border border-slate-800 rounded-2xl shadow-sm h-full flex flex-col items-center justify-center text-slate-500 p-8 text-center min-h-[500px]">
              <LayoutDashboard className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium text-slate-400">No Module Selected</p>
              <p className="text-sm mt-2 max-w-md">Select a module from the genome map to view its dependencies, capabilities, and status.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
