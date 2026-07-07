const fs = require('fs');

const path = 'src/components/mission/ConceptGraphView.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
    /let entities = \[\s*\{\s*id: "Vehicle"[\s\S]*?\];/s,
    'let entities: any[] = [];'
);

code = code.replace(
    /const e0 = entities\[0\] \|\| \{ label: 'A', color: 'indigo', confidence: 90 \};\s*const e1 = entities\[1\] \|\| \{ label: 'B', color: 'emerald', instances: 1 \};\s*const e2 = entities\[2\] \|\| \{ label: 'C', color: 'amber', instances: 1 \};/s,
    `const e0 = entities[0];\n  const e1 = entities[1];\n  const e2 = entities[2];`
);

code = code.replace(
    /<div className="relative z-10 flex flex-col items-center">[\s\S]*?<\/div>\s*<\/div>/,
    `{e0 ? (
        <div className="relative z-10 flex flex-col items-center">
           <div className={\`w-32 p-3 bg-\${e0.color}-900/30 border border-\${e0.color}-500/50 rounded-xl flex flex-col items-center shadow-lg\`}>
             <span className={\`font-semibold text-\${e0.color}-300\`}>{e0.label}</span>
             <span className={\`text-xs text-\${e0.color}-500 mt-1\`}>Conf: {e0.confidence}%</span>
           </div>
           
           {(e1 || e2) && (
             <div className="flex gap-16 mt-8 relative">
                <div className="absolute top-[-32px] left-1/2 w-px h-8 bg-indigo-500/30 -translate-x-1/2"></div>
                <div className="absolute top-[-32px] left-[16%] right-[16%] h-px bg-indigo-500/30"></div>
                
                {e1 && (
                  <div className="relative">
                    <div className="absolute top-[-32px] left-1/2 w-px h-8 bg-indigo-500/30 -translate-x-1/2"></div>
                    <div className={\`w-28 p-2 bg-\${e1.color}-900/30 border border-\${e1.color}-500/50 rounded-xl flex flex-col items-center shadow-lg\`}>
                      <span className={\`font-medium text-\${e1.color}-300 text-sm\`}>{e1.label}</span>
                      <span className={\`text-xs text-\${e1.color}-500 mt-1\`}>Instances: {e1.instances || 1}</span>
                    </div>
                  </div>
                )}
                
                {e2 && (
                  <div className="relative">
                    <div className="absolute top-[-32px] left-1/2 w-px h-8 bg-indigo-500/30 -translate-x-1/2"></div>
                    <div className={\`w-28 p-2 bg-\${e2.color}-900/30 border border-\${e2.color}-500/50 rounded-xl flex flex-col items-center shadow-lg\`}>
                      <span className={\`font-medium text-\${e2.color}-300 text-sm\`}>{e2.label}</span>
                      <span className={\`text-xs text-\${e2.color}-500 mt-1\`}>Instances: {e2.instances || 1}</span>
                    </div>
                  </div>
                )}
             </div>
           )}
        </div>
        ) : (
          <div className="text-slate-500 flex flex-col items-center">
            <Activity size={32} className="opacity-30 mb-2" />
            No concepts currently in working memory
          </div>
        )}`
);

code = code.replace(
    /<div className="absolute bottom-4 right-4 bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-lg w-64">[\s\S]*?<\/div>\s*<\/div>/,
    `{e0 && e1 && (
        <div className="absolute bottom-4 right-4 bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-lg w-64">
           <h4 className="text-sm font-medium text-slate-300 mb-2 border-b border-slate-800 pb-1">Evolution Timeline</h4>
           <div className="space-y-2 text-xs">
              <div className="flex gap-2 items-start text-slate-400">
                 <GitMerge size={12} className="mt-0.5 text-indigo-400" />
                 <div>Merged <span className="text-indigo-300">"{e1.label}"</span> into <span className="text-emerald-300">"{e0.label}"</span></div>
              </div>
              {e2 && (
                  <div className="flex gap-2 items-start text-slate-400">
                     <Activity size={12} className="mt-0.5 text-amber-400" />
                     <div>Split <span className="text-amber-300">"{e2.label}"</span> from <span className="text-indigo-300">"{e0.label}"</span></div>
                  </div>
              )}
           </div>
        </div>
        )}`
);


fs.writeFileSync(path, code);
