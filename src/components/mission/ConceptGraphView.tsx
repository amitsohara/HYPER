import React from "react";
import { GitMerge, ZoomIn, ZoomOut, Maximize, Activity } from "lucide-react";

export function ConceptGraphView() {
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
        {/* Mock Concept Graph SVG */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative z-10 flex flex-col items-center">
           <div className="w-32 p-3 bg-indigo-900/30 border border-indigo-500/50 rounded-xl flex flex-col items-center shadow-lg">
             <span className="font-semibold text-indigo-300">Vehicle</span>
             <span className="text-xs text-indigo-500 mt-1">Conf: 99%</span>
           </div>
           
           <div className="flex gap-16 mt-8 relative">
              <div className="absolute top-[-32px] left-1/2 w-px h-8 bg-indigo-500/30 -translate-x-1/2"></div>
              <div className="absolute top-[-32px] left-[16%] right-[16%] h-px bg-indigo-500/30"></div>
              
              <div className="relative">
                <div className="absolute top-[-32px] left-1/2 w-px h-8 bg-indigo-500/30 -translate-x-1/2"></div>
                <div className="w-28 p-2 bg-emerald-900/30 border border-emerald-500/50 rounded-xl flex flex-col items-center shadow-lg">
                  <span className="font-medium text-emerald-300 text-sm">Car</span>
                  <span className="text-xs text-emerald-500 mt-1">Instances: 42</span>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute top-[-32px] left-1/2 w-px h-8 bg-indigo-500/30 -translate-x-1/2"></div>
                <div className="w-28 p-2 bg-amber-900/30 border border-amber-500/50 rounded-xl flex flex-col items-center shadow-lg">
                  <span className="font-medium text-amber-300 text-sm">Truck</span>
                  <span className="text-xs text-amber-500 mt-1">Instances: 8</span>
                </div>
              </div>
           </div>
        </div>
        
        <div className="absolute bottom-4 right-4 bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-lg w-64">
           <h4 className="text-sm font-medium text-slate-300 mb-2 border-b border-slate-800 pb-1">Evolution Timeline</h4>
           <div className="space-y-2 text-xs">
              <div className="flex gap-2 items-start text-slate-400">
                 <GitMerge size={12} className="mt-0.5 text-indigo-400" />
                 <div>Merged <span className="text-indigo-300">"Sedan"</span> into <span className="text-emerald-300">"Car"</span> (Sim: 0.94)</div>
              </div>
              <div className="flex gap-2 items-start text-slate-400">
                 <Activity size={12} className="mt-0.5 text-amber-400" />
                 <div>Split <span className="text-amber-300">"Truck"</span> from <span className="text-indigo-300">"Vehicle"</span></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
