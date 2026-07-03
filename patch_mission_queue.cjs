const fs = require('fs');
let code = fs.readFileSync('src/components/mission/MissionQueueView.tsx', 'utf8');

const target = `"RUNNING": [],
            "QUEUED": [],`;
const repl = `"NEED": [],
            "QUEUED": [],
            "RUNNING": [],`;

code = code.replace(target, repl);

const targetIcon = `case "QUEUED": return <Clock size={16} className="text-indigo-400" />;`;
const replIcon = `case "NEED": return <CircleDashed size={16} className="text-pink-400" />;
            case "QUEUED": return <Clock size={16} className="text-indigo-400" />;`;

code = code.replace(targetIcon, replIcon);

const targetStyle = `case "QUEUED": return "border-indigo-500/30 bg-indigo-500/5 text-indigo-300";`;
const replStyle = `case "NEED": return "border-pink-500/30 bg-pink-500/5 text-pink-300";
            case "QUEUED": return "border-indigo-500/30 bg-indigo-500/5 text-indigo-300";`;

code = code.replace(targetStyle, replStyle);

fs.writeFileSync('src/components/mission/MissionQueueView.tsx', code);
