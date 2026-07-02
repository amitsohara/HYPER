import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, XCircle, Settings, BrainCircuit, Activity, MessageSquare, ShieldAlert, Cpu, Network } from "lucide-react";
import { useHyperMindStore } from "../store/useHyperMindStore";

export function MissionDetailView({ missionId, missionName }: { missionId: string, missionName: string }) {
    const [messages, setMessages] = useState<any[]>([]);
    const [chatInput, setChatInput] = useState("");
    const [isPaused, setIsPaused] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const globalEvents = useHyperMindStore(state => state.events);

    // Auto-scroll chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        setMessages([
            { role: "user", text: "Deploying mission...", time: new Date().toLocaleTimeString() },
            { role: "hypermind", text: "Mission received. Building world model...", time: new Date().toLocaleTimeString() }
        ]);
    }, []);

    const displayEvents = globalEvents
        .slice(-10)
        .map(ev => ({
            time: new Date(ev.timestamp || Date.now()).toLocaleTimeString(),
            level: ev.type === 'TELEMETRY_UPDATE' ? "INFO" : (Math.random() > 0.8 ? "WARN" : "INFO"),
            text: ev.type === 'TELEMETRY_UPDATE' ? `HCNS Event: ${Object.keys(ev.data?.metrics || {}).join(", ")}` : `HCO Event: ${ev.type}`
        }));

    const handleSend = () => {
        if (!chatInput.trim()) return;
        setMessages(prev => [...prev, { role: "user", text: chatInput, time: new Date().toLocaleTimeString() }]);
        setChatInput("");
        setTimeout(() => {
            setMessages(prev => [...prev, { role: "hypermind", text: "Adjusting mission parameters based on new constraint...", time: new Date().toLocaleTimeString() }]);
        }, 1000);
    };

    return (
        <div className="h-full flex flex-col xl:flex-row gap-6">
            {/* Left Column: Live Execution & Explainability */}
            <div className="flex-1 flex flex-col gap-6 min-w-0">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 ${isPaused ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'} rounded-full`}></div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-100">{missionName}</h2>
                            <p className="text-sm text-slate-400 font-mono">ID: {missionId}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setIsPaused(!isPaused)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-sm font-medium flex items-center gap-2">
                            {isPaused ? <Play size={16} /> : <Pause size={16} />} {isPaused ? "Resume" : "Pause"}
                        </button>
                        <button className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-500/30 rounded text-sm font-medium flex items-center gap-2">
                            <XCircle size={16} /> Cancel Mission
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Live Progress */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-medium text-slate-200 mb-4 flex items-center gap-2">
                            <Activity size={18} className="text-indigo-400" /> Live Execution Status
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="text-xs text-slate-500 mb-1">Current Cognitive Engine</div>
                                <div className="text-sm text-slate-300 font-medium flex items-center gap-2"><Cpu size={14} className="text-emerald-400"/> HRE (Reasoning)</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 mb-1">Current Thought Process</div>
                                <div className="text-sm text-indigo-300 font-medium italic">"Evaluating safety constraints against proposed optimal path..."</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 mb-1">Health Index (HII)</div>
                                <div className="text-sm text-slate-300 font-medium">94.2%</div>
                            </div>
                        </div>
                    </div>

                    {/* Explainability Panel */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-medium text-slate-200 mb-4 flex items-center gap-2">
                            <BrainCircuit size={18} className="text-indigo-400" /> Explainability Panel
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="text-xs text-slate-500 mb-1">Why HyperMind did this:</div>
                                <div className="text-sm text-slate-300">Selected Path A because it minimizes collision risk by 42% compared to Path B, adhering to SP-01-NO-HARM.</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 mb-1">Confidence Score:</div>
                                <div className="w-full bg-slate-950 rounded-full h-2">
                                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                                </div>
                                <div className="text-xs text-emerald-400 mt-1">92% (High Certainty)</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex-1 min-h-[200px] flex flex-col">
                    <h3 className="text-lg font-medium text-slate-200 mb-4 flex items-center gap-2">
                        <Network size={18} className="text-indigo-400" /> HCO Event Stream
                    </h3>
                    <div className="flex-1 bg-slate-950 rounded border border-slate-800 p-4 font-mono text-xs overflow-y-auto space-y-2">
                        {displayEvents.map((ev, i) => (
                             <div key={i} className="text-slate-500">
                                 [{ev.time}] <span className={ev.level === 'WARN' ? 'text-amber-400' : 'text-indigo-400'}>{ev.level}</span> - {ev.text}
                             </div>
                        ))}
                        {!isPaused && <div className="text-slate-600 animate-pulse">Waiting for next event...</div>}
                    </div>
                </div>
            </div>

            {/* Right Column: Mission Chat */}
            <div className="w-full xl:w-96 bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-lg h-[600px] xl:h-auto">
                <div className="p-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center shrink-0">
                    <h3 className="font-medium text-slate-200 flex items-center gap-2">
                        <MessageSquare size={16} className="text-indigo-400" /> Mission Chat
                    </h3>
                    <button className="text-slate-500 hover:text-slate-300 transition-colors"><Settings size={16} /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[85%] rounded-lg p-3 ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-200 border border-slate-700'}`}>
                                <p className="text-sm">{m.text}</p>
                            </div>
                            <span className="text-[10px] text-slate-500 mt-1 mx-1">{m.time}</span>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-3 border-t border-slate-800 bg-slate-950 shrink-0">
                    <div className="flex items-center gap-2">
                        <input 
                            type="text" 
                            value={chatInput}
                            onChange={e => setChatInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            placeholder="Instruct the mission..."
                            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                        />
                        <button onClick={handleSend} className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors">
                            <Play size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
