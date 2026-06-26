import fs from 'fs';
import path from 'path';

const files = [
  'src/server/core/knowledge/research_paper_agent.ts',
  'src/server/core/knowledge/web_search_agent.ts',
  'src/server/core/knowledge/patent_search_agent.ts',
  'src/server/core/knowledge/github_search_agent.ts',
  'src/server/core/knowledge/news_search_agent.ts',
  'src/server/core/knowledge/government_data_agent.ts',
  'src/server/core/knowledge/evidence_ranker.ts',
  'src/server/core/knowledge/knowledge_planner.ts'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/contents: prompt,/g, 'contents: prompt,\n        bypassBudget: true,');
    fs.writeFileSync(f, content);
  }
});
