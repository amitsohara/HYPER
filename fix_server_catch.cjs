const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// The duplicate block is:
//     } catch (e: any) {
//         console.error(e);
//         res.status(500).json({ error: e.message });
//     }
//   });
//     } catch (e: any) {
//         console.error(e);
//         res.status(500).json({ error: e.message });
//     }
//   });

code = code.replace(/    \} catch \(e: any\) \{\n        console\.error\(e\);\n        res\.status\(500\)\.json\(\{ error: e\.message \}\);\n    \}\n  \}\);\n    \} catch \(e: any\) \{\n        console\.error\(e\);\n        res\.status\(500\)\.json\(\{ error: e\.message \}\);\n    \}\n  \}\);/g, `    } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
  });`);

fs.writeFileSync('server.ts', code);
console.log("Fixed catch block");
