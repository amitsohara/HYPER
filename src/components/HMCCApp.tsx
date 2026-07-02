import React, { useState } from "react";
import {
  Mic, Camera, FileText, Image as ImageIcon, Video,
  Activity, Type, Rocket, Globe, Bell, User, Settings,
  BrainCircuit, ChevronRight, CheckCircle, AlertTriangle, File
} from "lucide-react";

export function HMCCApp({ onStartMission }: { onStartMission: (mission: any) => void }) {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [missionInput, setMissionInput] = useState("");

  const suggestions = [
    { title: "Optimize city traffic", icon: Globe, color: "text-blue-400" },
    { title: "Inspect medicines", icon: Activity, color: "text-emerald-400" },
    { title: "Control warehouse robot", icon: Rocket, color: "text-orange-400" },
    { title: "Analyze CCTV footage", icon: Camera, color: "text-indigo-400" },
  ];

  const handleStart = (input: string) => {
    setMissionInput(input);
    setWizardOpen(true);
    setWizardStep(1);
  };

  const handleApprove = async (missionData: any) => {
    try {
        const res = await fetch("/api/hmcc/dispatch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(missionData)
        });
        const result = await res.json();
        onStartMission(result.mission || missionData);
    } catch(e) {
        onStartMission(missionData);
    }
  };

  if (wizardOpen) {
    return <MissionWizard 
             initialInput={missionInput} 
             onClose={() => setWizardOpen(false)} 
             onApprove={handleApprove} 
             step={wizardStep} 
             setStep={setWizardStep} 
           />;
  }

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-200 overflow-hidden font-sans relative">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 pointer-events-none"></div>
      
      {/* Top Navigation */}
      <nav className="h-16 border-b border-slate-800/80 bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-6 z-10 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <BrainCircuit className="text-indigo-500" size={24} />
            <span className="font-bold text-xl tracking-tight text-slate-100">HyperMind</span>
          </div>
          <div className="hidden md:flex gap-4 text-sm font-medium text-slate-400">
            <button className="hover:text-slate-200 transition-colors">Active Missions</button>
            <button className="hover:text-slate-200 transition-colors">Cognitive Health</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 text-sm font-medium">
            <Activity size={14} className="animate-pulse" />
            HII: 92.4%
          </div>
          <button className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400"><Bell size={18} /></button>
          <button className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400"><Settings size={18} /></button>
          <button className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400"><User size={18} /></button>
        </div>
      </nav>

      {/* Center Hero */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400 mb-8 text-center max-w-3xl">
          What would you like HyperMind to accomplish today?
        </h1>

        <div className="w-full max-w-3xl bg-slate-900/80 border border-slate-700/50 rounded-2xl p-2 shadow-2xl backdrop-blur-sm">
          <textarea 
            value={missionInput}
            onChange={(e) => setMissionInput(e.target.value)}
            placeholder="Describe your mission in natural language..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 p-4 resize-none focus:outline-none min-h-[120px] text-lg"
          />
          <div className="flex items-center justify-between p-2 border-t border-slate-800/50">
            <div className="flex flex-wrap gap-2">
              <IconButton icon={Mic} label="Voice" />
              <IconButton icon={Camera} label="Camera" />
              <IconButton icon={FileText} label="Documents" />
              <IconButton icon={ImageIcon} label="Images" />
              <IconButton icon={Video} label="Video" />
              <IconButton icon={Activity} label="Sensors" />
              <IconButton icon={Type} label="Text" />
            </div>
            <button 
              onClick={() => handleStart(missionInput)}
              disabled={!missionInput.trim()}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl shadow-lg shadow-indigo-900/20 flex items-center gap-2 transition-all"
            >
              <Rocket size={18} /> Start Mission
            </button>
          </div>
        </div>

        {/* Suggestions */}
        <div className="mt-12 w-full max-w-4xl">
          <p className="text-sm text-slate-500 font-medium mb-4 text-center">Or start with a template</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {suggestions.map((s, i) => (
              <button 
                key={i}
                onClick={() => handleStart(s.title)}
                className="p-4 bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 rounded-xl flex flex-col items-center gap-3 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-900/10 group"
              >
                <div className={`p-3 bg-slate-950 rounded-lg group-hover:scale-110 transition-transform ${s.color}`}>
                  <s.icon size={24} />
                </div>
                <span className="text-sm font-medium text-slate-300 text-center">{s.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function IconButton({ icon: Icon, label }: { icon: any, label: string }) {
  return (
    <button className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors flex items-center gap-1 group" title={label}>
      <Icon size={20} />
      <span className="text-xs font-medium opacity-0 group-hover:opacity-100 hidden md:block transition-opacity w-0 group-hover:w-auto overflow-hidden">{label}</span>
    </button>
  );
}

function MissionWizard({ initialInput, onClose, onApprove, step, setStep }: any) {
  const steps = ["Details", "Inputs", "Goals", "Analysis", "Approval"];
  const [missionData, setMissionData] = useState<any>(null);
  const [isCompiling, setIsCompiling] = useState(false);

  const handleNext = async () => {
    if (step === 3) {
      setIsCompiling(true);
      setStep(4);
      try {
        const res = await fetch("/api/hmcc/compile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: initialInput })
        });
        const data = await res.json();
        setMissionData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsCompiling(false);
      }
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col text-slate-200 font-sans">
      <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 shrink-0">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Rocket className="text-indigo-400" /> Mission Compiler
        </h2>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">Cancel</button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Wizard Sidebar */}
        <div className="w-64 border-r border-slate-800 bg-slate-900/30 p-6 hidden md:block">
          <div className="space-y-6">
            {steps.map((s, i) => (
              <div key={i} className={`flex items-center gap-3 ${step > i + 1 ? 'text-emerald-400' : step === i + 1 ? 'text-indigo-400 font-bold' : 'text-slate-600'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step > i + 1 ? 'border-emerald-400 bg-emerald-400/10' : step === i + 1 ? 'border-indigo-400 bg-indigo-400/10' : 'border-slate-700'}`}>
                  {step > i + 1 ? <CheckCircle size={16} /> : i + 1}
                </div>
                <span className="text-sm">{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Wizard Content */}
        <div className="flex-1 flex flex-col p-8 overflow-y-auto bg-slate-950">
          <div className="max-w-3xl w-full mx-auto flex-1">
            {step === 1 && <WizardStep1 initialInput={initialInput} />}
            {step === 2 && <WizardStep2 />}
            {step === 3 && <WizardStep3 />}
            {step === 4 && <WizardStep4 isCompiling={isCompiling} missionData={missionData} />}
            {step === 5 && <WizardStep5 missionData={missionData} />}
          </div>

          <div className="max-w-3xl w-full mx-auto mt-8 pt-6 border-t border-slate-800 flex justify-between">
            <button 
              onClick={() => setStep(step - 1)} 
              disabled={step === 1 || isCompiling}
              className="px-6 py-2 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              Back
            </button>
            {step < 5 ? (
              <button 
                onClick={handleNext}
                disabled={isCompiling}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-lg flex items-center gap-2 transition-colors"
              >
                {isCompiling ? "Compiling..." : "Next"} <ChevronRight size={18} />
              </button>
            ) : (
              <button 
                onClick={() => onApprove(missionData)}
                className="px-8 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center gap-2 shadow-lg shadow-emerald-900/20 transition-all hover:scale-105"
              >
                Approve Mission
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function WizardStep1({ initialInput }: { initialInput: string }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h3 className="text-2xl font-bold mb-2 text-slate-100">Mission Details</h3>
        <p className="text-slate-400">Define the core parameters of your cognitive mission.</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Mission Name</label>
          <input type="text" defaultValue="Auto-Generated Mission 01" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:border-indigo-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
          <textarea defaultValue={initialInput} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:border-indigo-500 focus:outline-none min-h-[100px]" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Priority</label>
            <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:border-indigo-500 focus:outline-none">
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
            <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:border-indigo-500 focus:outline-none">
              <option>Optimization</option>
              <option>Analysis</option>
              <option>Control</option>
              <option>Research</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

function WizardStep2() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h3 className="text-2xl font-bold mb-2 text-slate-100">Provide Inputs</h3>
        <p className="text-slate-400">Upload documents or connect live data streams for this mission.</p>
      </div>
      
      <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-900/50 hover:border-indigo-500/50 transition-colors cursor-pointer group">
        <div className="w-16 h-16 bg-slate-800 group-hover:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4 transition-colors">
          <File className="text-slate-400 group-hover:text-indigo-400" size={32} />
        </div>
        <p className="font-medium text-slate-300 mb-1">Click to upload or drag & drop</p>
        <p className="text-sm text-slate-500">PDF, CSV, Images, Video, JSON, XML</p>
      </div>

      <div className="mt-8">
        <h4 className="text-sm font-medium text-slate-400 mb-3">Live Connections</h4>
        <div className="grid grid-cols-2 gap-4">
           <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex items-center gap-3">
             <Camera className="text-indigo-400" size={24} />
             <div>
               <div className="font-medium text-sm">Add Camera Feed</div>
               <div className="text-xs text-slate-500">RTSP, USB, WebRTC</div>
             </div>
           </div>
           <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex items-center gap-3">
             <Activity className="text-emerald-400" size={24} />
             <div>
               <div className="font-medium text-sm">Add Sensor Stream</div>
               <div className="text-xs text-slate-500">IoT, WebSocket, REST</div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function WizardStep3() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h3 className="text-2xl font-bold mb-2 text-slate-100">Set Goals & Constraints</h3>
        <p className="text-slate-400">Define what success looks like and set operational boundaries.</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Primary Objective</label>
          <input type="text" placeholder="e.g. Maximize throughput while maintaining safety" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:border-indigo-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Success Criteria</label>
          <textarea placeholder="List quantifiable metrics..." className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:border-indigo-500 focus:outline-none min-h-[80px]" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Max Runtime (Minutes)</label>
            <input type="number" defaultValue="60" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:border-indigo-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Privacy Mode</label>
            <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:border-indigo-500 focus:outline-none">
              <option>Standard (Cloud Assisted)</option>
              <option>Strict (Local Only)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

function WizardStep4({ isCompiling, missionData }: any) {
  if (isCompiling) {
    return (
      <div className="space-y-6 animate-in fade-in flex flex-col items-center justify-center py-12">
        <Rocket size={48} className="text-indigo-500 animate-pulse mb-4" />
        <h3 className="text-2xl font-bold text-slate-100">Compiling Mission...</h3>
        <p className="text-slate-400">HyperMind is analyzing constraints and planning engine architecture.</p>
      </div>
    );
  }

  if (!missionData) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h3 className="text-2xl font-bold mb-2 text-slate-100">HyperMind Analysis</h3>
        <p className="text-slate-400">Review HyperMind's understanding of your mission before compilation.</p>
      </div>
      
      <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-6 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
           <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full text-xs font-bold border border-emerald-400/20">
             <BrainCircuit size={14} /> {Math.round(missionData.confidence * 100)}% Confidence
           </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-4">
          <div>
            <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Mission Type</div>
            <div className="font-medium text-slate-200">{missionData.type}</div>
          </div>
          <div>
             <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Est. Runtime</div>
             <div className="font-medium text-slate-200">~{Math.round(missionData.estimated_runtime_sec / 60)} mins</div>
          </div>
          <div className="col-span-2">
            <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Required Cognitive Engines</div>
            <div className="flex gap-2 mt-1">
              {missionData.required_engines?.map((eng: string) => (
                <span key={eng} className="px-2 py-1 bg-slate-800 rounded text-xs">{eng}</span>
              ))}
            </div>
          </div>
          <div className="col-span-2">
            <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Detected Risks</div>
            <div className="flex flex-col gap-2">
              {missionData.risk_profile?.detected_risks?.map((risk: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-amber-400 text-sm bg-amber-400/10 p-2 rounded">
                  <AlertTriangle size={16} /> {risk}
                </div>
              ))}
              {(!missionData.risk_profile?.detected_risks || missionData.risk_profile.detected_risks.length === 0) && (
                <div className="text-sm text-slate-500">None detected.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WizardStep5({ missionData }: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center py-6">
        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
           <CheckCircle size={40} className="text-emerald-400" />
        </div>
        <h3 className="text-3xl font-bold mb-2 text-slate-100">Ready for Deployment</h3>
        <p className="text-slate-400">The mission has been compiled into a Canonical Mission Object.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
         <div className="text-xs text-slate-500 mb-2 font-mono">CANONICAL_MISSION_OBJECT_PREVIEW</div>
         <pre className="text-xs text-indigo-300 font-mono bg-slate-950 p-4 rounded overflow-x-auto border border-slate-800">
{JSON.stringify(missionData, null, 2)}
         </pre>
      </div>
      <p className="text-center text-sm text-slate-500">
         Upon approval, this mission will be dispatched to the HyperMind OS scheduler (HOS) and execution will be monitored via the Cognitive Observatory.
      </p>
    </div>
  );
}
