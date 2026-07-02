import React from "react";
import { BarChart3, Activity, Gauge } from "lucide-react";

export function AnalyticsView({ diagnostics }: any) {
  const latency = diagnostics?.trace?.latency || 12;
  const throughput = diagnostics?.trace?.throughput || 1250;
  
  return (
    <div className="h-full flex flex-col space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-200">System Analytics</h2>
        <p className="text-sm text-slate-400">Deep telemetry and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 flex-1">
        {/* Chart 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col">
          <h3 className="font-medium text-slate-300 mb-4 flex items-center gap-2"><Activity size={16}/> HCNS Event Throughput</h3>
          <div className="flex-1 bg-slate-950 border border-slate-800 rounded relative overflow-hidden flex items-end">
            <svg className="w-full h-full text-indigo-500 opacity-50" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,100 L0,50 Q25,20 50,60 T100,30 L100,100 Z" fill="currentColor" />
            </svg>
            <div className="absolute top-4 left-4 text-2xl font-bold text-indigo-400">{throughput} ev/s</div>
          </div>
        </div>

        {/* Chart 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col">
          <h3 className="font-medium text-slate-300 mb-4 flex items-center gap-2"><Gauge size={16}/> API Latency</h3>
          <div className="flex-1 bg-slate-950 border border-slate-800 rounded relative overflow-hidden flex items-center justify-center flex-col">
             <div className="w-32 h-32 rounded-full border-8 border-slate-800 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-8 border-emerald-500" style={{clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 50%)'}}></div>
                <span className="text-2xl font-bold text-slate-200">{Math.floor(latency)}ms</span>
             </div>
             <div className="text-xs text-slate-500 mt-4">Average response time</div>
          </div>
        </div>
        
        {/* Chart 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col">
          <h3 className="font-medium text-slate-300 mb-4 flex items-center gap-2"><BarChart3 size={16}/> Subsystem Accuracy</h3>
          <div className="flex-1 space-y-4">
             <div>
               <div className="flex justify-between text-xs mb-1"><span className="text-slate-400">Reasoning</span><span className="text-indigo-400">92%</span></div>
               <div className="h-2 bg-slate-950 rounded-full overflow-hidden"><div className="h-full bg-indigo-500" style={{width: '92%'}}></div></div>
             </div>
             <div>
               <div className="flex justify-between text-xs mb-1"><span className="text-slate-400">Simulation</span><span className="text-emerald-400">94%</span></div>
               <div className="h-2 bg-slate-950 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{width: '94%'}}></div></div>
             </div>
             <div>
               <div className="flex justify-between text-xs mb-1"><span className="text-slate-400">Decision</span><span className="text-amber-400">89%</span></div>
               <div className="h-2 bg-slate-950 rounded-full overflow-hidden"><div className="h-full bg-amber-500" style={{width: '89%'}}></div></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
