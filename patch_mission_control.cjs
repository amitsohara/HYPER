const fs = require('fs');

const path = 'src/components/MissionControlApp.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
    /const handleDeploy = \(\) => \{\n      setIsDeploying\(true\);\n      setTimeout\(\(\) => setIsDeploying\(false\), 2000\);\n  \};/,
    `const handleDeploy = async () => {
      setIsDeploying(true);
      try {
          await fetch('/api/hml/missions/deploy', { method: 'POST' });
      } catch (e) {
          console.error(e);
      }
      setTimeout(() => setIsDeploying(false), 2000);
  };`
);

fs.writeFileSync(path, code);
