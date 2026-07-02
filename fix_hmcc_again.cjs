const fs = require('fs');
const path = 'src/components/HMCCApp.tsx';
let code = fs.readFileSync(path, 'utf8');

const targetHook = `export function HMCCApp({ onStartMission }: { onStartMission: (mission: any) => void }) {
  const [wizardOpen, setWizardOpen] = useState(false);`;
const replacementHook = `export function HMCCApp({ onStartMission }: { onStartMission: (mission: any) => void }) {
  const { hii } = useHyperMindStore();
  const [wizardOpen, setWizardOpen] = useState(false);`;

if(code.includes(targetHook)) {
    code = code.replace(targetHook, replacementHook);
    console.log("Replaced hook!");
} else {
    console.log("Hook not found");
}

const targetImport = `import { useHyperMindStore } from "../store/useHyperMindStore";`;
if(!code.includes(targetImport)) {
    code = `import { useHyperMindStore } from "../store/useHyperMindStore";\n` + code;
    console.log("Added import");
}

fs.writeFileSync(path, code);
