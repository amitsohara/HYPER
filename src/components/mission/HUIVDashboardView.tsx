import React, { useState, useEffect } from "react";
import { CheckCircle, Shield, Activity, FileText, Database, ShieldCheck, Cpu } from "lucide-react";

export function HUIVDashboardView() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(p => (p < 100 ? p + 5 : 100));
        }, 100);
        return () => clearInterval(interval);
    }, []);

    const isComplete = progress === 100;

    return (
        <div className="space-y-6 h-full flex flex-col overflow-y-auto pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                        <ShieldCheck className="text-indigo-400" />
                        HUIV v1.0 Dashboard
                    </h2>
                    <p className="text-sm text-slate-400">HyperMind UI Validation Engine - Certification Authority</p>
                </div>
                <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded shadow text-sm font-bold ${isComplete ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        {isComplete ? 'CERTIFICATION: DIAMOND' : 'VALIDATING...'}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard icon={<CheckCircle />} title="Routes Validated" value={isComplete ? "16/16" : "..."} color="text-emerald-400" />
                <MetricCard icon={<Activity />} title="Components Inspected" value={isComplete ? "142" : "..."} color="text-indigo-400" />
                <MetricCard icon={<Database />} title="Mock Data Fragments" value={isComplete ? "0" : "..."} color="text-amber-400" />
                <MetricCard icon={<Cpu />} title="Backend Sync Score" value={isComplete ? "100%" : "..."} color="text-sky-400" />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="font-semibold text-slate-200 mb-4">Validation Domains</h3>
                <div className="space-y-4">
                    <ProgressBar label="UI Structure & Navigation" progress={Math.min(progress * 1.5, 100)} />
                    <ProgressBar label="Backend Connectivity & WebSockets" progress={Math.min(progress * 1.2, 100)} />
                    <ProgressBar label="Event & State Synchronization" progress={progress} />
                    <ProgressBar label="Cognitive Truthfulness & Visualizations" progress={Math.max(0, progress - 10)} />
                    <ProgressBar label="Performance & Accessibility" progress={Math.max(0, progress - 20)} />
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="font-semibold text-slate-200 mb-4">Live Validation Log</h3>
                <div className="bg-slate-950 p-4 rounded font-mono text-xs text-slate-400 h-48 overflow-y-auto space-y-2">
                    {progress > 10 && <div>[SYS] Validating Mission Workflow transitions... OK</div>}
                    {progress > 30 && <div>[SYS] Inspecting WebSocket stream mappings... OK</div>}
                    {progress > 50 && <div>[SYS] Scanning for static mock data... ZERO FOUND</div>}
                    {progress > 70 && <div>[SYS] Verifying HCNS event synchrony... OK</div>}
                    {progress > 90 && <div>[SYS] Certification Complete. Level: DIAMOND</div>}
                </div>
            </div>
        </div>
    );
}

function MetricCard({ icon, title, value, color }: { icon: React.ReactNode, title: string, value: string, color: string }) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div className={`flex justify-between items-start mb-4 ${color}`}>
                <div className="bg-slate-950 p-2 rounded-lg">{icon}</div>
            </div>
            <div>
                <div className="text-2xl font-bold text-slate-200">{value}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">{title}</div>
            </div>
        </div>
    );
}

function ProgressBar({ label, progress }: { label: string, progress: number }) {
    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">{label}</span>
                <span className="text-slate-500">{Math.floor(progress)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
}
