import React, { useMemo } from "react";
import { useHyperMindStore } from "../../../store/useHyperMindStore";
import { Activity, Network, LineChart as LineChartIcon, Server } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const MOCK_THROUGHPUT = Array.from({ length: 20 }).map((_, i) => ({
  time: `10:${i.toString().padStart(2, '0')}`,
  eps: Math.floor(Math.random() * 50) + 10
}));

const MOCK_ADAPTATION = Array.from({ length: 20 }).map((_, i) => ({
  time: `Day ${i+1}`,
  rate: Math.floor(Math.random() * 30) + 50 + i * 2
}));

export function ObservatoryView() {
  const { metrics } = useHyperMindStore();

  return (
    <div className="flex-1 flex flex-col p-8 overflow-auto">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        <header>
          <h1 className="text-3xl font-light tracking-tight mb-2">Cognitive Observatory</h1>
          <p className="text-zinc-400">Aggregated telemetry, analytics, and system health.</p>
        </header>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl min-h-[300px] flex flex-col">
            <h2 className="text-lg font-medium mb-4 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <span>Event Throughput (eps)</span>
            </h2>
            <div className="flex-1 w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_THROUGHPUT}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="time" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="eps" stroke="#34d399" strokeWidth={2} dot={false} animationDuration={1000} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl min-h-[300px] flex flex-col">
            <h2 className="text-lg font-medium mb-4 flex items-center space-x-2">
              <Network className="w-5 h-5 text-indigo-400" />
              <span>Engine Status</span>
            </h2>
            <div className="flex-1 space-y-4">
              <EngineStatus name="HCCE" status="online" load="12%" />
              <EngineStatus name="HILA" status="online" load="45%" />
              <EngineStatus name="HDME" status="online" load="3%" />
              <EngineStatus name="HKBE" status="online" load="8%" />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <h2 className="text-lg font-medium mb-4 flex items-center space-x-2">
            <LineChartIcon className="w-5 h-5 text-amber-400" />
            <span>Learning & Adaptation Rates</span>
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_ADAPTATION}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="time" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="rate" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.1} strokeWidth={2} animationDuration={1000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function EngineStatus({ name, status, load }: any) {
  return (
    <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-xl border border-zinc-800">
      <div className="flex items-center space-x-3">
        <Server className="w-4 h-4 text-zinc-400" />
        <span className="font-medium font-mono">{name}</span>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-xs text-zinc-500">Load: {load}</span>
        <div className="flex items-center space-x-1.5">
          <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-emerald-400' : 'bg-red-400'}`} />
          <span className="text-xs uppercase tracking-wider text-zinc-400">{status}</span>
        </div>
      </div>
    </div>
  );
}
