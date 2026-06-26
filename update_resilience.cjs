const fs = require('fs');
const path = require('path');

const files = [
    './src/server/core/mission_evaluator.ts',
    './src/server/core/weakness_detector.ts',
    './src/server/core/skill_extractor.ts',
    './src/server/core/improvement_generator.ts',
    './src/server/core/benchmark_validator.ts'
];

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Add generateWithRetry import
    if (!content.includes('generateWithRetry')) {
        content = 'import { generateWithRetry } from "../engines.js";\n' + content;
    }
    
    // Replace ai.models.generateContent
    content = content.replace(/await ai\.models\.generateContent\(\{[\s\S]*?\}\);/, (match) => {
        let inside = match.substring(match.indexOf('(')+1, match.lastIndexOf(')'));
        return `await generateWithRetry(ai, ${inside}, 3);`;
    });
    
    // Fallback for null res
    content = content.replace(/res\.text/g, 'res?.text');
    
    // Add try-catch around the main logic to make it robust
    if (file.includes('mission_evaluator')) {
        content = content.replace(/const res =[\s\S]*return JSON\.parse\(res\?\.text \|\| "{}"\);/, `try {
    const res = await generateWithRetry(ai, {
        model: "gemini-2.0-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    }, 3);
    return JSON.parse(res?.text || '{"score": 50, "reasoning": "Fallback due to error"}');
  } catch(e) {
    return {score: 50, reasoning: "Error evaluating: " + String(e)};
  }`);
    } else if (file.includes('weakness_detector')) {
        content = content.replace(/const res =[\s\S]*return JSON\.parse\(res\?\.text \|\| '\{"weaknesses":\[\]\}'\)\.weaknesses;/, `try {
    const res = await generateWithRetry(ai, {
        model: "gemini-2.0-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    }, 3);
    return JSON.parse(res?.text || '{"weaknesses":[]}').weaknesses || [];
  } catch(e) {
    return [];
  }`);
    } else if (file.includes('skill_extractor')) {
        content = content.replace(/const res =[\s\S]*success_rate: 100\n    \}\)\);/, `try {
    const res = await generateWithRetry(ai, {
        model: "gemini-2.0-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    }, 3);
    const data = JSON.parse(res?.text || '{"skills":[]}');
    return (data.skills || []).map((s: any) => ({
        skill_id: uuidv4(),
        ...s,
        source_mission_ids: [missionId],
        version: 1,
        success_rate: 100
    }));
  } catch(e) {
    return [];
  }`);
    } else if (file.includes('improvement_generator')) {
        content = content.replace(/const res =[\s\S]*\.\.\.imp\n    \}\)\);/, `try {
    const res = await generateWithRetry(ai, {
        model: "gemini-2.0-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    }, 3);
    const data = JSON.parse(res?.text || '{"improvements":[]}');
    return (data.improvements || []).map((imp: any) => ({
        improvement_id: uuidv4(),
        ...imp
    }));
  } catch(e) {
    return [];
  }`);
    } else if (file.includes('benchmark_validator')) {
        content = content.replace(/const res =[\s\S]*"regression_detected":true\}'\);/, `try {
    const res = await generateWithRetry(ai, {
        model: "gemini-2.0-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    }, 3);
    return JSON.parse(res?.text || '{"accepted":false, "reason":"validation failed", "benchmark_results":{"old_strategy_score":0, "new_strategy_score":0}, "regression_detected":true}');
  } catch(e) {
    return {accepted:false, reason:"error during validation", benchmark_results:{old_strategy_score:0, new_strategy_score:0}, regression_detected:true};
  }`);
    }

    fs.writeFileSync(file, content);
}

console.log("Updated files.");
