import React from "react";
import { BookOpen, TrendingUp, Cpu, Award } from "lucide-react";

export function LearningCenterView({ diagnostics }: any) {
  const epochs = diagnostics?.activeModules?.length || 42;
  const skills = diagnostics?.workingMemory?.length || 24;

  return (
    <div className="h-full flex flex-col space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-200">Learning Center</h2>
        <p className="text-sm text-slate-400">Lifelong learning and skill acquisition metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="text-slate-400 text-sm mb-2 flex items-center gap-2"><Cpu size={16}/> Knowledge Gained</div>
          <div className="text-2xl font-bold text-emerald-400">+142 Concepts</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="text-slate-400 text-sm mb-2 flex items-center gap-2"><TrendingUp size={16}/> Performance Imp.</div>
          <div className="text-2xl font-bold text-indigo-400">+12.4%</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="text-slate-400 text-sm mb-2 flex items-center gap-2"><Award size={16}/> Skills Mastered</div>
          <div className="text-2xl font-bold text-amber-400">{skills} Skills</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="text-slate-400 text-sm mb-2 flex items-center gap-2"><BookOpen size={16}/> Active Epochs</div>
          <div className="text-2xl font-bold text-slate-200">Ep. {epochs}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
          <h3 className="font-medium text-slate-200 mb-4">Learning Curve (HII Over Time)</h3>
          <div className="flex-1 bg-slate-950 border border-slate-800 rounded flex items-end p-4 gap-2">
             {/* Mock Chart */}
             {[40, 45, 55, 62, 70, 78, 85, 89, 91.8].map((h, i) => (
                <div key={i} className="flex-1 bg-indigo-500/50 hover:bg-indigo-400 transition-colors rounded-t relative group">
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">{h}%</div>
                   <div className="absolute bottom-0 w-full bg-indigo-500 rounded-t" style={{height: `${h}%`}}></div>
                </div>
             ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
          <h3 className="font-medium text-slate-200 mb-4">Recent Insights & Discoveries</h3>
          <div className="space-y-3 flex-1 overflow-y-auto">
             <div className="p-4 bg-slate-950 border border-slate-800 rounded">
                <div className="text-sm font-medium text-indigo-300 mb-1">Cross-domain Correlation</div>
                <div className="text-xs text-slate-400">Identified similarity between fluid dynamics and traffic flow at high volumes. Upgraded traffic simulation engine.</div>
             </div>
             <div className="p-4 bg-slate-950 border border-slate-800 rounded">
                <div className="text-sm font-medium text-emerald-300 mb-1">Visual Optimization</div>
                <div className="text-xs text-slate-400">Reduced inference time by 14% on high-contrast night vision camera feeds.</div>
             </div>
             <div className="p-4 bg-slate-950 border border-slate-800 rounded">
                <div className="text-sm font-medium text-amber-300 mb-1">Concept Formation</div>
                <div className="text-xs text-slate-400">Formed new abstract concept: "Cyclic Micro-congestion" based on 7-day observation of intersection node 4.</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
