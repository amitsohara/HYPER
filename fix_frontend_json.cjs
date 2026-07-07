const fs = require('fs');
const path = require('path');

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === 'dist' || file === '.git') continue;
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let code = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      
      // Replace await res.json() with try/catch
      if (code.includes('await res.json()')) {
          code = code.replace(/await res\.json\(\)/g, `(await res.text().then(t => { try { return JSON.parse(t); } catch(e) { return {}; } }))`);
          changed = true;
      }

      if (code.includes('await response.json()')) {
          code = code.replace(/await response\.json\(\)/g, `(await response.text().then(t => { try { return JSON.parse(t); } catch(e) { return {}; } }))`);
          changed = true;
      }
      
      // Replace res.json() chaining like fetch(...).then(r => r.json())
      if (code.includes('r.json()')) {
          code = code.replace(/r\.json\(\)/g, `r.text().then(t => { try { return JSON.parse(t); } catch(e) { return {}; } })`);
          changed = true;
      }

      if (changed) {
          fs.writeFileSync(fullPath, code);
      }
    }
  }
}
walk('./src/components');
walk('./src/store');
