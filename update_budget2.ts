import fs from 'fs';

const files = [
  'src/server/core/executive_summary_generator.ts',
  'src/server/core/action_plan_generator.ts',
  'src/server/core/risk_budget_extractor.ts',
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/contents: prompt,/g, 'contents: prompt,\n        bypassBudget: true,');
    fs.writeFileSync(f, content);
  }
});
