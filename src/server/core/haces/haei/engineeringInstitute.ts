import { TaskDecomposer } from "./taskDecomposer.js";
import { EngineeringPlanner } from "./engineeringPlanner.js";
import { ProductionCodeGenerator } from "./productionCodeGenerator.js";
import { RefactoringEngine } from "./refactoringEngine.js";
import { SecurityEngineering } from "./securityEngineering.js";
import { PerformanceEngineering } from "./performanceEngineering.js";
import { DocumentationEngineering } from "./documentationEngineering.js";
import { BuildSystem } from "./buildSystem.js";
import { ReleaseCandidateGenerator } from "./releaseCandidateGenerator.js";
import { EngineeringKnowledgeGraph } from "./engineeringKnowledgeGraph.js";
import { EngineeringGenomeRepository } from "./engineeringGenome.js";
import { EngineeringDigitalTwin } from "./engineeringDigitalTwin.js";
import { CognitiveSoftwareFactory } from "./cognitiveSoftwareFactory.js";
import { EngineeringMetricsCollector } from "./engineeringMetrics.js";
import { HCAIEngineeringPackage, ReleaseCandidate } from "./engineeringTypes.js";

export class EngineeringInstitute {
    public taskDecomposer = new TaskDecomposer();
    public planner = new EngineeringPlanner(this.taskDecomposer);
    public codeGenerator = new ProductionCodeGenerator();
    public refactoring = new RefactoringEngine();
    public security = new SecurityEngineering();
    public performance = new PerformanceEngineering();
    public docs = new DocumentationEngineering();
    public buildSystem = new BuildSystem();
    public releaseGenerator = new ReleaseCandidateGenerator();
    public knowledgeGraph = new EngineeringKnowledgeGraph();
    public genomes = new EngineeringGenomeRepository();
    public digitalTwin = new EngineeringDigitalTwin();
    
    public factory = new CognitiveSoftwareFactory(
        this.planner,
        this.codeGenerator,
        this.digitalTwin
    );

    public processEngineeringPackage(pkg: HCAIEngineeringPackage): ReleaseCandidate | null {
        // 1. Factory execution (Planning + Code Generation)
        const { plan, artifacts } = this.factory.executeSprint(pkg);

        // 2. Refactoring
        const refinedArtifacts = this.refactoring.refactor(artifacts);

        // 3. Security Review
        const secAssessment = this.security.assess(refinedArtifacts);

        // 4. Performance Review
        const perfAssessment = this.performance.analyze(refinedArtifacts);

        // 5. Documentation
        const docs = this.docs.generateDocs(plan.plan_id);

        // 6. Build & Package
        const build = this.buildSystem.build(refinedArtifacts);

        // 7. Graph & Genome Updates
        this.knowledgeGraph.addNode(pkg.package_id, "Package", pkg);
        this.knowledgeGraph.addNode(plan.plan_id, "Plan", plan);
        this.genomes.updateGenome({ build_history: [build.build_id] });

        // 8. Generate Release Candidate
        const rc = this.releaseGenerator.generateRC(
            plan,
            secAssessment,
            perfAssessment,
            docs,
            build
        );

        if (rc) {
            this.knowledgeGraph.addNode(rc.rc_id, "ReleaseCandidate", rc);
        }

        return rc;
    }

    public getMetrics() {
        return EngineeringMetricsCollector.collectMetrics(this.digitalTwin, this.genomes);
    }
}
