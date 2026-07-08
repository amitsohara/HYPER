import React, { useState } from "react";
import { Shield, Cpu, Database, Activity } from "lucide-react";

export function SettingsView() {
  const [settings, setSettings] = useState({
    enforceLDP: true,
    riskThreshold: "0.7",
    humanAuth: true,
    hilaRouting: "Balanced",
    maxThreads: "8",
    memoryLimit: "4096 MB",
    retention: "30 Days",
    autoConsolidate: true
  });

  return (
    <div className="flex-1 flex flex-col p-8 overflow-auto">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <header>
          <h1 className="text-3xl font-light tracking-tight mb-2">System Settings</h1>
          <p className="text-zinc-400">Configure HyperMind parameters and operational boundaries.</p>
        </header>

        <div className="space-y-6">
          <Section icon={Shield} title="Safety & Directives">
            <SettingRow label="Enforce LDP-001 (Do No Harm)" type="toggle" value={settings.enforceLDP} onChange={(v: boolean) => setSettings({...settings, enforceLDP: v})} />
            <SettingRow label="Maximum Autonomous Risk Threshold" type="slider" value={settings.riskThreshold} onChange={(v: string) => setSettings({...settings, riskThreshold: v})} min="0" max="1" step="0.1" />
            <SettingRow label="Require Human Authorization for Destructive Actions" type="toggle" value={settings.humanAuth} onChange={(v: boolean) => setSettings({...settings, humanAuth: v})} />
          </Section>

          <Section icon={Cpu} title="Cognitive Allocation">
            <SettingRow label="HILA Priority Routing" type="select" value={settings.hilaRouting} options={["Balanced", "Speed", "Quality"]} onChange={(v: string) => setSettings({...settings, hilaRouting: v})} />
            <SettingRow label="Max Concurrent Threads" type="slider" value={settings.maxThreads} onChange={(v: string) => setSettings({...settings, maxThreads: v})} min="1" max="32" step="1" />
            <SettingRow label="Simulation Sandbox Memory Limit" type="input" value={settings.memoryLimit} onChange={(v: string) => setSettings({...settings, memoryLimit: v})} />
          </Section>

          <Section icon={Database} title="Memory & Knowledge">
            <SettingRow label="Episodic Memory Retention" type="select" value={settings.retention} options={["7 Days", "30 Days", "90 Days", "Forever"]} onChange={(v: string) => setSettings({...settings, retention: v})} />
            <SettingRow label="Auto-consolidate Semantic Nodes" type="toggle" value={settings.autoConsolidate} onChange={(v: boolean) => setSettings({...settings, autoConsolidate: v})} />
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-zinc-800 flex items-center space-x-3 bg-zinc-900/50">
        <Icon className="w-5 h-5 text-emerald-400" />
        <h2 className="font-medium text-zinc-100">{title}</h2>
      </div>
      <div className="p-4 space-y-4">
        {children}
      </div>
    </div>
  );
}

function SettingRow({ label, type, value, onChange, min, max, step, options }: any) {
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-zinc-300">{label}</span>
      {type === 'toggle' && (
        <div onClick={() => onChange(!value)} className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors ${value ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
          <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${value ? 'translate-x-6' : ''}`} />
        </div>
      )}
      {type === 'slider' && (
        <div className="flex items-center space-x-3">
          <input type="range" value={value} onChange={e => onChange(e.target.value)} min={min} max={max} step={step} className="w-32 accent-emerald-500" />
          <span className="text-sm font-mono text-zinc-500 w-8">{value}</span>
        </div>
      )}
      {type === 'select' && (
        <select value={value} onChange={e => onChange(e.target.value)} className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-300 outline-none cursor-pointer">
          {options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      )}
      {type === 'input' && (
        <input type="text" value={value} onChange={e => onChange(e.target.value)} className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-300 outline-none text-right w-24" />
      )}
    </div>
  );
}
