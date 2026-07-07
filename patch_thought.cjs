const fs = require('fs');

const path = 'src/components/mission/ThoughtExplorerView.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
    /<div className="bg-slate-900 border border-slate-800 rounded-xl p-5">\s*<h3 className="font-medium text-slate-200 mb-4 border-b border-slate-800 pb-2">Cognitive Lifecycle<\/h3>[\s\S]*?<\/div>\s*<\/div>/,
    `<div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
           <h3 className="font-medium text-slate-200 mb-4 border-b border-slate-800 pb-2">Cognitive Summary</h3>
           <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Total Thoughts</span>
                  <span className="text-slate-200 font-medium">{thoughts.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">High Priority</span>
                  <span className="text-rose-400 font-medium">{thoughts.filter(t => t.priority === 'HIGH').length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Active</span>
                  <span className="text-indigo-400 font-medium">{thoughts.filter(t => t.state === 'ACTIVE').length}</span>
              </div>
           </div>
        </div>
      </div>`
);

fs.writeFileSync(path, code);
