const fs = require('fs');

let path = 'server.ts';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes('server_logs.txt')) {
    code = `import * as fs from 'fs';
const logFile = 'server_logs.txt';
fs.writeFileSync(logFile, '--- START ---\\n');
const origLog = console.log;
const origError = console.error;
console.log = function(...args) {
    origLog.apply(console, args);
    fs.appendFileSync(logFile, args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ') + '\\n');
};
console.error = function(...args) {
    origError.apply(console, args);
    fs.appendFileSync(logFile, 'ERROR: ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ') + '\\n');
};
` + code;
    fs.writeFileSync(path, code);
}
