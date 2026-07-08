import React, { useState } from "react";
import { Camera, Play, Plus, Activity, Cpu, Shield, ArrowRight, Check } from "lucide-react";
import { useHyperMindStore } from "../../../store/useHyperMindStore";

export function HomeView({ onNavigateQueue }: { onNavigateQueue: () => void }) {
  const [wizardOpen, setWizardOpen] = useState(false);
  const { metrics } = useHyperMindStore();

  return (
    <div className="flex-1 overflow-auto p-8 relative">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-light tracking-tight mb-2">Cognitive Environment</h1>
            <p className="text-zinc-400">System operating nominally. Ready for new directives.</p>
          </div>
          <button 
            onClick={() => setWizardOpen(true)}
            className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-6 py-3 rounded-full font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Mission</span>
          </button>
        </header>

        {/* System Health */}
        <div className="grid grid-cols-4 gap-6">
          <StatCard title="System Load" value={`${(metrics?.cpuUsage || 0).toFixed(1)}%`} icon={Activity} healthy />
          <StatCard title="Active Memories" value={metrics?.memoryCount || 0} icon={Cpu} />
          <StatCard title="Throughput" value={`${metrics?.eventsPerSecond || 0} eps`} icon={Activity} />
          <StatCard title="Security Level" value="LDP-001 Enforced" icon={Shield} healthy />
        </div>

        {/* Wizard Modal Overlay */}
        {wizardOpen && (
          <MissionWizard onClose={() => setWizardOpen(false)} onComplete={onNavigateQueue} />
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, healthy = false }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between h-32">
      <div className="flex justify-between items-start text-zinc-400">
        <span className="text-sm font-medium uppercase tracking-wider">{title}</span>
        <Icon className={`w-5 h-5 ${healthy ? "text-emerald-400" : "text-zinc-500"}`} />
      </div>
      <div className="text-3xl font-light tracking-tight">{value}</div>
    </div>
  );
}

function MissionWizard({ onClose, onComplete }: any) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", type: "observation", description: "" });

  const handleCreate = async () => {
    try {
      await fetch("/api/hmcc/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          directive: formData.name + ": " + formData.description,
          type: formData.type
        })
      });
    } catch (e) {
      // Ignore
    }
    onClose();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Wizard Header */}
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-medium">Create New Mission</h2>
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`w-2 h-2 rounded-full ${s === step ? 'bg-emerald-400' : s < step ? 'bg-zinc-500' : 'bg-zinc-800'}`} />
            ))}
          </div>
        </div>

        {/* Wizard Body */}
        <div className="p-8 flex-1 overflow-auto">
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-light mb-6">Mission Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Mission Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-emerald-500" 
                    placeholder="e.g. Area Surveillance"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Mission Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="observation">Observation & Analysis</option>
                    <option value="autonomous">Autonomous Action</option>
                    <option value="research">Deep Research</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-emerald-500 h-24 resize-none"
                    placeholder="Provide specific objectives..."
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-light mb-6">Input Sources</h3>
              <div className="grid grid-cols-2 gap-4">
                <SourceOption icon={Camera} label="Live Camera Feed" selected />
                <SourceOption icon={Cpu} label="Telemetry Sensors" />
                <SourceOption icon={Shield} label="Security Logs" selected />
                <SourceOption icon={Activity} label="Network Traffic" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-light mb-6">Execution Mode</h3>
              <div className="space-y-4">
                <ModeOption title="Live Execution" desc="Mission executes immediately in the real world." active />
                <ModeOption title="Simulation" desc="Mission runs in the cognitive sandbox. Safe." />
                <ModeOption title="Dry Run" desc="Plans are generated but not executed." />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-light mb-6">Mission Review</h3>
              <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl space-y-4">
                <ReviewItem label="Name" value={formData.name || "Untitled"} />
                <ReviewItem label="Type" value={formData.type} />
                <ReviewItem label="Safety" value="Verified (LDP-001)" color="text-emerald-400" />
                <ReviewItem label="Est. Duration" value="Indefinite (Continuous)" />
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer */}
        <div className="p-6 border-t border-zinc-800 flex justify-between bg-zinc-900/50">
          <button 
            onClick={step === 1 ? onClose : () => setStep(s => s - 1)}
            className="px-6 py-2 text-zinc-400 hover:text-zinc-100 font-medium transition-colors"
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>
          
          {step < 4 ? (
            <button 
              onClick={() => setStep(s => s + 1)}
              className="flex items-center space-x-2 bg-zinc-100 hover:bg-white text-zinc-950 px-6 py-2 rounded-full font-medium transition-colors"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={handleCreate}
              className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-6 py-2 rounded-full font-medium transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Create Mission</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

function SourceOption({ icon: Icon, label, selected = false }: any) {
  return (
    <div className={`p-4 rounded-xl border flex items-center space-x-3 cursor-pointer transition-colors ${selected ? "bg-emerald-400/10 border-emerald-400/30 text-emerald-400" : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"}`}>
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </div>
  );
}

function ModeOption({ title, desc, active = false }: any) {
  return (
    <div className={`p-4 rounded-xl border cursor-pointer transition-colors ${active ? "bg-zinc-800 border-zinc-700" : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700"}`}>
      <div className={`font-medium mb-1 ${active ? "text-zinc-100" : "text-zinc-400"}`}>{title}</div>
      <div className="text-sm">{desc}</div>
    </div>
  );
}

function ReviewItem({ label, value, color = "text-zinc-100" }: any) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-zinc-800/50 last:border-0">
      <span className="text-zinc-400">{label}</span>
      <span className={`font-medium ${color}`}>{value}</span>
    </div>
  );
}
