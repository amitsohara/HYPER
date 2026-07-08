const fs = require('fs');
let code = fs.readFileSync('src/components/MissionControlApp.tsx', 'utf8');

// Replace state
code = code.replace(
    'const [nodes, setNodes] = useState<{id: string, type: string, label: string, icon: any}[]>([]);',
    'const [nodes, setNodes] = useState<{id: string, type: string, label: string, icon: any}[]>([]);\n  const [missionDirective, setMissionDirective] = useState("Optimize heavy traffic at Nashik Road Junction.");'
);

// Replace handleDeploy
code = code.replace(
    /const handleDeploy = async \(\) => \{\s*setIsDeploying\(true\);\s*try \{\s*await fetch\('\/api\/hml\/missions\/deploy', \{ method: 'POST' \}\);\s*\} catch \(e\) \{\s*console.error\(e\);\s*\}\s*setTimeout\(\(\) => setIsDeploying\(false\), 2000\);\s*\};/g,
    `const handleDeploy = async () => {
      setIsDeploying(true);
      try {
          await fetch('/api/hml/missions/deploy', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ directive: missionDirective })
          });
      } catch (e) {
          console.error(e);
      }
      setTimeout(() => setIsDeploying(false), 2000);
  };`
);

// Replace the right side canvas area
const targetCanvas = `<div 
          className="flex-1 bg-slate-950 relative overflow-hidden flex items-center justify-center"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
           {/* Mockup Canvas */}
           <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
           
           <div className="relative z-10 flex flex-col items-center gap-8 min-h-full py-12 overflow-y-auto w-full">`;

const newCanvas = `<div 
          className="flex-1 bg-slate-950 relative overflow-hidden flex flex-col"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
           <div className="relative z-20 p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur">
             <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Mission Directive (Natural Language)</label>
             <textarea 
               className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 resize-none h-20"
               value={missionDirective}
               onChange={(e) => setMissionDirective(e.target.value)}
               placeholder="e.g. Optimize heavy traffic at Nashik Road Junction."
             />
           </div>

           {/* Mockup Canvas */}
           <div className="flex-1 relative flex items-center justify-center">
             <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>
           
             <div className="relative z-10 flex flex-col items-center gap-8 min-h-full py-12 overflow-y-auto w-full">`;

code = code.replace(targetCanvas, newCanvas);

// There's a missing closing div for flex-1 relative
code = code.replace(
    '           </div>\n        </div>\n      </div>\n    </div>\n  );\n}\n\nfunction MissionControlView',
    '           </div>\n           </div>\n        </div>\n      </div>\n    </div>\n  );\n}\n\nfunction MissionControlView'
);

fs.writeFileSync('src/components/MissionControlApp.tsx', code);
console.log("Patched MissionControlApp.tsx");
