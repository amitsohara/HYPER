import React from "react";
import { GitMerge, ZoomIn, ZoomOut, Maximize, Activity } from "lucide-react";

export function ConceptGraphView({ diagnostics }: any) {
  let entities: any[] = [];
  if (diagnostics?.worldModel?.entities?.length > 0) {
      entities = diagnostics.worldModel.entities.slice(0, 3).map((e: any, i: number) => ({
          id: e.id || `ent-${i}`,
          label: e.name || e.label || `Entity ${i}`,
          confidence: e.confidence || 90,
          color: i === 0 ? "indigo" : i === 1 ? "emerald" : "amber",
          instances: e.instances || 1
      }));
  }

  const e0 = entities[0];
  const e1 = entities[1];
  const e2 = entities[2];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <div>
          <h3 className="font-medium text-slate-200">Concept Hierarchy</h3>
          <p className="text-xs text-slate-400">Live ontology evolution</p>
        </div>
        <div className="flex gap-2 text-slate-400">
          <button className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded"><ZoomIn size={16} /></button>
          <button className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded"><ZoomOut size={16} /></button>
          <button className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded"><Maximize size={16} /></button>
        </div>
      </div>
      
      <div className="flex-1 relative flex items-center justify-center bg-slate-950">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        {e0 ? (
        <div className="relative z-10 flex flex-col items-center">
           <div className={`w-32 p-3 bg-${e0.color}-900/30 border border-${e0.color}-500/50 rounded-xl flex flex-col items-center shadow-lg`}>
             <span className={`font-semibold text-${e0.color}-300`}>{e0.label}</span>
             <span className={`text-xs text-${e0.color}-500 mt-1`}>Conf: {e0.confidence}%</span>
           </div>
           
           {(e1 || e2) && (
             <div className="flex gap-16 mt-8 relative">
                <div className="absolute top-[-32px] left-1/2 w-px h-8 bg-indigo-500/30 -translate-x-1/2"></div>
                <div className="absolute top-[-32px] left-[16%] right-[16%] h-px bg-indigo-500/30"></div>
                
                {e1 && (
                  <div className="relative">
                    <div className="absolute top-[-32px] left-1/2 w-px h-8 bg-indigo-500/30 -translate-x-1/2"></div>
                    <div className={`w-28 p-2 bg-${e1.color}-900/30 border border-${e1.color}-500/50 rounded-xl flex flex-col items-center shadow-lg`}>
                      <span className={`font-medium text-${e1.color}-300 text-sm`}>{e1.label}</span>
                      <span className={`text-xs text-${e1.color}-500 mt-1`}>Instances: {e1.instances || 1}</span>
                    </div>
                  </div>
                )}
                
                {e2 && (
                  <div className="relative">
                    <div className="absolute top-[-32px] left-1/2 w-px h-8 bg-indigo-500/30 -translate-x-1/2"></div>
                    <div className={`w-28 p-2 bg-${e2.color}-900/30 border border-${e2.color}-500/50 rounded-xl flex flex-col items-center shadow-lg`}>
                      <span className={`font-medium text-${e2.color}-300 text-sm`}>{e2.label}</span>
                      <span className={`text-xs text-${e2.color}-500 mt-1`}>Instances: {e2.instances || 1}</span>
                    </div>
                  </div>
                )}
             </div>
           )}
        </div>
        ) : (
          <div className="text-slate-500 flex flex-col items-center relative z-10">
            <Activity size={32} className="opacity-30 mb-2" />
            No concepts currently in working memory
          </div>
        )}
        
        {e0 && e1 && (
        <div className="absolute bottom-4 right-4 bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-lg w-64 z-20">
           <h4 className="text-sm font-medium text-slate-300 mb-2 border-b border-slate-800 pb-1">Evolution Timeline</h4>
           <div className="space-y-2 text-xs">
              <div className="flex gap-2 items-start text-slate-400">
                 <GitMerge size={12} className="mt-0.5 text-indigo-400" />
                 <div>Merged <span className="text-indigo-300">"{e1.label}"</span> into <span className="text-emerald-300">"{e0.label}"</span></div>
              </div>
              {e2 && (
                  <div className="flex gap-2 items-start text-slate-400">
                     <Activity size={12} className="mt-0.5 text-amber-400" />
                     <div>Split <span className="text-amber-300">"{e2.label}"</span> from <span className="text-indigo-300">"{e0.label}"</span></div>
                  </div>
              )}
           </div>
        </div>
        )}
      </div>
    </div>
  );
}
