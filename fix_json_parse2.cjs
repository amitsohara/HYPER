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
      
      if (code.includes('return {}; } })(); } catch(e) { console.warn(')) {
          code = code.replace(/return \{\}; \} \}\)\(\); \} catch\(e\) \{ console\.warn\("Failed to parse LLM response", response\.content\); \}/g, 
            `return [] as any; } })(); } catch(e) { console.warn("Failed to parse LLM response", response.content); }`);
          
          fs.writeFileSync(fullPath, code);
      }
    }
  }
}
walk('./src/server');
