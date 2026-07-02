import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward, Rewind, FastForward, Activity, Database, Crosshair } from "lucide-react";
import { useHyperMindStore } from "../../store/useHyperMindStore";

export function ReplayCenterView() {
  const { events } = useHyperMindStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Update index if events are added and we are tracking the end
  const isAtEnd = currentIndex === events.length - 1 || events.length === 0;

  useEffect(() => {
    if (isPlaying && currentIndex < events.length - 1) {
      timerRef.current = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 1000 / playbackSpeed);
    } else if (isPlaying && currentIndex >= events.length - 1) {
      setIsPlaying(false);
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentIndex, events.length, playbackSpeed]);

  const handlePlayPause = () => {
    if (currentIndex >= events.length - 1) {
      setCurrentIndex(0); // Restart if at end
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    if (currentIndex < events.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handleStepBack = () => {
    setIsPlaying(false);
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };
  
  const handleJumpToStart = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };
  
  const handleJumpToEnd = () => {
    setIsPlaying(false);
    if (events.length > 0) setCurrentIndex(events.length - 1);
  };

  const currentEvent = events[currentIndex];

  const formatTime = (ts: number) => {
    if (!ts) return "00:00:00.000";
    const date = new Date(ts);
    return date.toISOString().substring(11, 23);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl h-full flex flex-col overflow-hidden">
      {/* Viewer Area */}
      <div className="flex-1 p-6 flex flex-col bg-slate-950 overflow-hidden relative">
         <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Database className="text-indigo-500" />
                HCNS Events Replay
            </h2>
            <div className="flex gap-2">
                <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs text-slate-400 font-mono">
                   Speed: {playbackSpeed}x
                </span>
                <span className="px-3 py-1 bg-indigo-900/30 border border-indigo-500/30 rounded-full text-xs text-indigo-400 font-mono flex items-center gap-2">
                   <Activity size={12} /> Live Events: {events.length}
                </span>
            </div>
         </div>
         
         {/* Event Inspector */}
         <div className="flex-1 overflow-hidden border border-slate-800 rounded-xl bg-slate-900/50 flex flex-col relative">
             {events.length === 0 ? (
                 <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-4">
                     <Crosshair size={48} className="opacity-20" />
                     <p>Awaiting telemetry from HCO Event Stream...</p>
                 </div>
             ) : (
                 <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                     {currentEvent && (
                         <div className="space-y-6">
                            <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
                                <div className="text-3xl text-emerald-400 font-mono">
                                    {formatTime(currentEvent.timestamp || Date.now())}
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-lg font-bold text-slate-200">{currentEvent.type}</div>
                                    <div className="text-sm text-slate-400 flex gap-4">
                                        <span>Source: <span className="text-indigo-400">{currentEvent.source}</span></span>
                                        <span>Domain: {currentEvent.domain}</span>
                                        <span>Priority: {currentEvent.priority}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                               <h3 className="text-slate-500 text-sm font-semibold mb-2 uppercase tracking-wider">Payload Data</h3>
                               <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-sm text-slate-300 font-mono overflow-x-auto">
                                   {JSON.stringify(currentEvent.payload, null, 2)}
                               </pre>
                            </div>
                         </div>
                     )}
                 </div>
             )}
         </div>
      </div>
      
      {/* Timeline & Controls */}
      <div className="bg-slate-900 p-6 border-t border-slate-800">
        <div className="mb-6 relative">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-400 font-medium">Timeline</span>
            </div>
            
            <div className="relative w-full h-8 mb-2 flex items-center">
                {/* Event markers */}
                <div className="absolute inset-0 top-1/2 -translate-y-1/2 h-2 bg-slate-800 rounded-lg pointer-events-none"></div>
                {events.length > 0 && events.map((ev, idx) => {
                    const left = `${(idx / Math.max(1, events.length - 1)) * 100}%`;
                    const isCurrent = idx === currentIndex;
                    return (
                        <div 
                           key={idx} 
                           className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-4 rounded-full ${isCurrent ? 'bg-indigo-400 h-6 w-2 shadow-[0_0_8px_rgba(99,102,241,0.8)] z-10' : 'bg-slate-600'} transition-all pointer-events-none`}
                           style={{ left }}
                           title={ev.type}
                        ></div>
                    );
                })}
                <input 
                  type="range" 
                  min={0} 
                  max={Math.max(0, events.length - 1)}
                  value={currentIndex}
                  onChange={(e) => {
                      setIsPlaying(false);
                      setCurrentIndex(parseInt(e.target.value));
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
            </div>

            <div className="flex justify-between text-xs text-slate-500 font-mono">
                <span>{events.length > 0 ? formatTime(events[0]?.timestamp) : "00:00:00.000"}</span>
                <span>{events.length > 0 ? formatTime(events[events.length - 1]?.timestamp) : "00:00:00.000"}</span>
            </div>
        </div>
        
        <div className="flex items-center justify-between text-slate-400">
          <div className="flex gap-2">
              <button 
                  onClick={() => setPlaybackSpeed(s => s > 0.25 ? s - 0.25 : 0.25)} 
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs font-mono transition-colors"
                  disabled={playbackSpeed <= 0.25}
              >
                  - Slower
              </button>
              <button 
                  onClick={() => setPlaybackSpeed(s => s < 4 ? s + 0.25 : 4)} 
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs font-mono transition-colors"
                  disabled={playbackSpeed >= 4}
              >
                  + Faster
              </button>
          </div>
          
          <div className="flex items-center gap-4">
             <button onClick={handleJumpToStart} className="p-2 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-all" title="Jump (Start)">
                 <SkipBack size={20} />
             </button>
             <button onClick={handleStepBack} className="p-2 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-all" title="Step (Back)">
                 <Rewind size={20} />
             </button>
             
             <button 
                 onClick={handlePlayPause} 
                 className="p-4 bg-indigo-600 text-white hover:bg-indigo-500 rounded-full transition-all shadow-lg shadow-indigo-900/50"
                 title={isPlaying ? "Pause" : (currentIndex >= events.length - 1 && events.length > 0 ? "Replay" : "Resume")}
             >
                 {isPlaying ? <Pause size={24} /> : <Play size={24} className={currentIndex >= events.length - 1 && events.length > 0 ? "" : "ml-1"} />}
             </button>
             
             <button onClick={handleStepForward} className="p-2 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-all" title="Step">
                 <FastForward size={20} />
             </button>
             <button onClick={handleJumpToEnd} className="p-2 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-all" title="Jump (End)">
                 <SkipForward size={20} />
             </button>
          </div>
          
          <div className="text-sm font-mono bg-slate-950 px-4 py-2 rounded-lg border border-slate-800">
             Frame: {events.length > 0 ? currentIndex + 1 : 0} / {events.length}
          </div>
        </div>
      </div>
    </div>
  );
}
