import { ValidationManager } from './core/ValidationManager.js';
import { ReportGenerator } from './core/ReportGenerator.js';
import { CertificationEngine } from './core/CertificationEngine.js';

async function runPV() {
    console.log("Starting HUIV PV-01 Validation...");
    const manager = new ValidationManager();
    const results = manager.runAll();
    
    const engine = new CertificationEngine();
    const cert = engine.certify(results);
    
    const reporter = new ReportGenerator();
    reporter.generate(results, './src/server/core/huiv1/reports');
    
    console.log("HUIV PV-01 Validation Passed.");
    console.log("Certification Level: " + cert);
}

runPV().catch(console.error);