import React, { useState, useEffect, useMemo } from 'react';
import { useHyperMindStore } from '../../store/useHyperMindStore';
import { 
    Target, Globe, GitMerge, Focus, FileText, BrainCircuit, 
    ListTree, Layers, Share2, Zap, BookOpen, Activity, ArrowRight
} from 'lucide-react';

const STAGES = [
    { id: 'mission', label: 'Mission', icon: Target, events: ['MISSION_SCHEDULED', 'MISSION_CREATED', 'MISSION_STARTED'] },
    { id: 'world_model', label: 'World Model', icon: Globe, events: ['WORLD_MODEL_UPDATED', 'WORLD_OBSERVATION', 'GLOBAL_STATE_SYNC'] },
    { id: 'concepts', label: 'Concepts', icon: GitMerge, events: ['CONCEPT'] },
    { id: 'attention', label: 'Attention', icon: Focus, events: ['ATTENTION_SHIFTED', 'ATTENTION_INTERRUPTED'] },
    { id: 'thoughts', label: 'Thoughts', icon: FileText, events: ['THOUGHT_GENERATED'] },
    { id: 'reasoning', label: 'Reasoning', icon: BrainCircuit, events: ['CONCLUSION_GENERATED'] },
    { id: 'planning', label: 'Planning', icon: ListTree, events: ['PLAN_CREATED'] },
    { id: 'simulation', label: 'Simulation', icon: Layers, events: ['SIMULATION_STARTED', 'SIMULATION_COMPLETED', 'PLAN_EVALUATED'] },
    { id: 'decision', label: 'Decision', icon: Share2, events: ['ACTION_AUTHORIZED', 'ACTION_REJECTED'] },
    { id: 'action', label: 'Action', icon: Zap, events: ['ACTION_COMPLETED', 'ACTION_FAILED', 'PLAN_EXECUTE'] },
    { id: 'learning', label: 'Learning', icon: BookOpen, events: ['KNOWLEDGE_UPDATED', 'LEARNING_ARTIFACT_CREATED', 'PROCEDURAL_MEMORY_UPDATED'] }
];

export function LiveCognitivePipelineView() {
    const { events } = useHyperMindStore();
    const [activeNodes, setActiveNodes] = useState<Record<string, number>>({});
    
    // Process new events and update active nodes with timestamps
    useEffect(() => {
        if (!events || events.length === 0) return;
        
        const latestEvent = events[events.length - 1];
        if (!latestEvent) return;
        
        const now = Date.now();
        const newActiveNodes = { ...activeNodes };
        let updated = false;
        
        STAGES.forEach(stage => {
            if (stage.events.includes(latestEvent.type)) {
                newActiveNodes[stage.id] = now;
                updated = true;
            }
        });
        
        

        if (updated) {
            setActiveNodes(newActiveNodes);
        }
    }, [events]);

    // Force re-renders for fading out
    const [tick, setTick] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 200);
        return () => clearInterval(interval);
    }, []);

    const now = Date.now();

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <Activity size={18} className="text-indigo-400" /> 
                    Live Cognitive Pipeline (Brain Scan)
                </h3>
                <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    HCNS Stream Active
                </div>
            </div>

            <div className="flex items-center justify-between overflow-x-auto pb-4 pt-2 px-2 no-scrollbar">
                {STAGES.map((stage, idx) => {
                    const lastActive = activeNodes[stage.id] || 0;
                    const isActive = now - lastActive < 1000;
                    const isRecent = now - lastActive < 3000;
                    
                    const Icon = stage.icon;

                    return (
                        <React.Fragment key={stage.id}>
                            <div className="flex flex-col items-center gap-3 relative shrink-0 min-w-[80px]">
                                {/* Node Glow */}
                                <div className={`absolute inset-0 bg-indigo-500 blur-xl rounded-full transition-opacity duration-700 pointer-events-none ${isActive ? 'opacity-40' : 'opacity-0'}`} />
                                
                                <div className={`relative z-10 w-14 h-14 rounded-xl border flex items-center justify-center transition-all duration-300
                                    ${isActive 
                                        ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300 scale-110 shadow-[0_0_20px_rgba(99,102,241,0.4)]' 
                                        : isRecent 
                                            ? 'bg-slate-800 border-indigo-500/30 text-slate-300 scale-100'
                                            : 'bg-slate-900 border-slate-800 text-slate-500 scale-100'
                                    }`}
                                >
                                    <Icon size={24} className={isActive ? 'animate-pulse' : ''} />
                                </div>
                                <span className={`text-xs font-medium transition-colors duration-300 text-center ${isActive ? 'text-indigo-300' : 'text-slate-500'}`}>
                                    {stage.label}
                                </span>
                            </div>
                            
                            {/* Connector line */}
                            {idx < STAGES.length - 1 && (
                                <div className="flex-1 min-w-[30px] shrink-1 relative h-0.5 mx-2 bg-slate-800 flex items-center justify-center">
                                    {/* Animated light flowing across connection if active */}
                                    <div className={`absolute top-0 bottom-0 left-0 bg-indigo-500 transition-all duration-1000 w-full rounded-full
                                        ${activeNodes[stage.id] && now - activeNodes[stage.id] < 1500 ? 'opacity-100' : 'opacity-0'}`} 
                                        style={{
                                            background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.8), transparent)',
                                            backgroundSize: '200% 100%',
                                            animation: isActive ? 'slide-right 1s linear infinite' : 'none'
                                        }}
                                    />
                                    <ArrowRight size={14} className="text-slate-700 absolute bg-slate-900 px-0.5" />
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
            
            <style>{`
                @keyframes slide-right {
                    0% { background-position: 100% 0; }
                    100% { background-position: -100% 0; }
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
