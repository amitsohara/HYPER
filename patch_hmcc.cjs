const fs = require('fs');
const path = 'src/components/HMCCApp.tsx';
let code = fs.readFileSync(path, 'utf8');

const targetImport = `import { Command, Activity, Bell, Settings, User, Rocket, Shield, Target, ArrowRight, Zap, RefreshCw, X, Play, Loader2 } from "lucide-react";`;
const replacementImport = `import { Command, Activity, Bell, Settings, User, Rocket, Shield, Target, ArrowRight, Zap, RefreshCw, X, Play, Loader2 } from "lucide-react";
import { useHyperMindStore } from "../store/useHyperMindStore";`;

if(code.includes(targetImport)) {
    code = code.replace(targetImport, replacementImport);
}

const targetHII = `<Activity size={14} className="animate-pulse" />
            HII: 92.4%`;
const replacementHII = `<Activity size={14} className="animate-pulse" />
            HII: {hii?.overallIntelligence ? (hii.overallIntelligence * 100).toFixed(1) + '%' : '...'}`;

if(code.includes(targetHII)) {
    code = code.replace(targetHII, replacementHII);
}

const targetHook = `export function HMCCApp({ onLaunch }: { onLaunch: () => void }) {
  const [missionInput, setMissionInput] = useState("");`;
const replacementHook = `export function HMCCApp({ onLaunch }: { onLaunch: () => void }) {
  const { hii } = useHyperMindStore();
  const [missionInput, setMissionInput] = useState("");`;

if(code.includes(targetHook)) {
    code = code.replace(targetHook, replacementHook);
}

fs.writeFileSync(path, code);
console.log('patched HMCCApp');
