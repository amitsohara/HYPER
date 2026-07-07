const fs = require('fs');
const path = require('path');

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === 'dist' || file === '.git') continue;
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      let code = fs.readFileSync(fullPath, 'utf8');
      
      // We will blindly replace `const parsed = JSON.parse(response.content);` 
      // with `let parsed = {}; try { parsed = JSON.parse(response.content); } catch(e) { console.error(e); }`
      if (code.includes('JSON.parse(response.content)')) {
          code = code.replace(/const parsed = JSON\.parse\(response\.content\);/g, 
            `let parsed: any = {}; try { parsed = JSON.parse(response.content); } catch(e) { console.warn("Failed to parse LLM response", response.content); }`);
          
          code = code.replace(/JSON\.parse\(response\.content\)/g, 
            `(function(){ try { return JSON.parse(response.content); } catch(e) { return {}; } })()`);
          
          fs.writeFileSync(fullPath, code);
      }
    }
  }
}
walk('./src/server');
