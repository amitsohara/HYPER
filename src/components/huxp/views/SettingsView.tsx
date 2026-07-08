import React from "react";
import { Shield, Cpu, Database, Activity } from "lucide-react";

export function SettingsView() {
  return (
    <div className="flex-1 flex flex-col p-8 overflow-auto">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <header>
          <h1 className="text-3xl font-light tracking-tight mb-2">System Settings</h1>
          <p className="text-zinc-400">Configure HyperMind parameters and operational boundaries.</p>
        </header>

        <div className="space-y-6">
          <Section icon={Shield} title="Safety & Directives">
            <SettingRow label="Enforce LDP-001 (Do No Harm)" type="toggle" value={true} />
            <SettingRow label="Maximum Autonomous Risk Threshold" type="slider" value="0.7" />
            <SettingRow label="Require Human Authorization for Destructive Actions" type="toggle" value={true} />
          </Section>

          <Section icon={Cpu} title="Cognitive Allocation">
            <SettingRow label="HILA Priority Routing" type="select" value="Balanced" />
            <SettingRow label="Max Concurrent Threads" type="slider" value="8" />
            <SettingRow label="Simulation Sandbox Memory Limit" type="input" value="4096 MB" />
          </Section>

          <Section icon={Database} title="Memory & Knowledge">
            <SettingRow label="Episodic Memory Retention" type="select" value="30 Days" />
            <SettingRow label="Auto-consolidate Semantic Nodes" type="toggle" value={true} />
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

function SettingRow({ label, type, value }: any) {
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-zinc-300">{label}</span>
      {type === 'toggle' && (
        <div className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors ${value ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
          <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${value ? 'translate-x-6' : ''}`} />
        </div>
      )}
      {type === 'slider' && (
        <div className="flex items-center space-x-3">
          <input type="range" className="w-32 accent-emerald-500" />
          <span className="text-sm font-mono text-zinc-500">{value}</span>
        </div>
      )}
      {type === 'select' && (
        <select className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-300 outline-none">
          <option>{value}</option>
        </select>
      )}
      {type === 'input' && (
        <input type="text" defaultValue={value} className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-300 outline-none text-right w-24" />
      )}
    </div>
  );
}
