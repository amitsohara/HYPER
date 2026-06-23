import React, { useEffect, useState } from "react";
import { Network, Database, Layers, GitMerge } from "lucide-react";

import { safeFetchJSON } from "../fetchUtils";

export function KnowledgeGraphDashboard() {
  const [graphData, setGraphData] = useState<any>({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    safeFetchJSON("/knowledge-graph", {}, { nodes: [], edges: [] })
      .then(data => {
        setGraphData(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#111] border border-slate-800 p-6 rounded-2xl gap-4">
         <div className="space-y-1">
          <h2 className="text-xl font-medium text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-500" />
            Knowledge Graph Brain
          </h2>
          <p className="text-sm text-slate-400">
            A self-assembling network of entities, concepts, and relationships extracted from completed missions.
          </p>
         </div>
         <div className="flex gap-4 items-center">
            <div className="bg-cyan-900/10 border border-cyan-900/30 px-4 py-2 rounded-lg text-center">
               <span className="text-cyan-500 text-sm font-bold block">{graphData.nodes?.length || 0}</span>
               <span className="text-[10px] text-cyan-400/80 uppercase tracking-wider font-medium">Nodes</span>
            </div>
            <div className="bg-emerald-900/10 border border-emerald-900/30 px-4 py-2 rounded-lg text-center">
               <span className="text-emerald-500 text-sm font-bold block">{graphData.edges?.length || 0}</span>
               <span className="text-[10px] text-emerald-400/80 uppercase tracking-wider font-medium">Edges</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Entities List */}
         <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
               <Database className="w-4 h-4 text-cyan-500" /> 
               Entities & Concepts
            </h3>
            <div className="flex flex-wrap gap-2 max-h-96 overflow-y-auto custom-scrollbar pr-2">
               {loading ? <span className="text-slate-500">Scanning graph...</span> : 
                graphData.nodes?.map((node: any, i: number) => (
                  <div key={i} className="bg-slate-800/30 border border-slate-700/50 px-3 py-1.5 rounded-full flex items-center gap-2">
                     <span className="text-slate-300 text-sm">{node.id}</span>
                     {node.labels?.length > 0 && (
                        <span className="text-[9px] bg-slate-900 text-cyan-400/80 px-1.5 py-0.5 rounded border border-cyan-900/50 uppercase tracking-wider">
                           {node.labels[0]}
                        </span>
                     )}
                  </div>
               ))}
               {!loading && graphData.nodes?.length === 0 && (
                  <p className="text-slate-500 text-sm italic">Graph is currently empty.</p>
               )}
            </div>
         </div>

         {/* Relationships Map Simulation */}
         <div className="bg-[#111] border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-4">
               <GitMerge className="w-4 h-4 text-emerald-500" />
               Semantic Relationships
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
               {loading ? <span className="text-slate-500">Scanning edges...</span> : 
                graphData.edges?.map((edge: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 bg-black/30 p-2 rounded-lg border border-slate-800/50">
                     <div className="flex-1 text-right text-xs text-slate-300 truncate font-medium">{edge.source}</div>
                     <div className="flex px-2 py-0.5 rounded-full bg-emerald-900/20 border border-emerald-900/30 text-[9px] text-emerald-400 uppercase tracking-widest whitespace-nowrap">
                        {edge.type}
                     </div>
                     <div className="flex-1 text-left text-xs text-slate-300 truncate font-medium">{edge.target}</div>
                  </div>
               ))}
               {!loading && graphData.edges?.length === 0 && (
                  <p className="text-slate-500 text-sm italic">No relationships established.</p>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
