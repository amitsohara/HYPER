import fs from 'fs';

const files = [
  'src/server/core/executive_summary_generator.ts',
  'src/server/core/action_plan_generator.ts',
  'src/server/core/decision_ranker.ts',
  'src/server/core/confidence_calculator.ts',
  'src/server/core/risk_budget_extractor.ts',
  'src/server/core/tradeoff_analyzer.ts',
  'src/server/core/assumption_manager.ts',
  'src/server/core/mission_classifier.ts'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/contents: prompt\n\s*\}/g, 'contents: prompt,\n        bypassBudget: true\n      }');
    fs.writeFileSync(f, content);
  }
});
