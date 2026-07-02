import { VisionEngine } from "./VisionEngine.js";
import { AudioEngine } from "./AudioEngine.js";
import { SensorFusionEngine } from "./SensorFusionEngine.js";
import { EnvironmentInterpreter } from "./EnvironmentInterpreter.js";
import { HyperMindEventMesh } from "../../hcns01/eventMesh.js";
import { IEnvironmentAdapter } from "../eaf/IEnvironmentAdapter.js";

export class PerceptionManager {
    public visionEngine: VisionEngine;
    public audioEngine: AudioEngine;
    public fusionEngine: SensorFusionEngine;
    public environmentInterpreter: EnvironmentInterpreter;
    
    constructor(private eventMesh: HyperMindEventMesh, private adapter: IEnvironmentAdapter) {
        this.visionEngine = new VisionEngine();
        this.audioEngine = new AudioEngine();
        this.fusionEngine = new SensorFusionEngine();
        this.environmentInterpreter = new EnvironmentInterpreter(this.eventMesh);
    }

    async processEnvironment(): Promise<void> {
        const rawObs = await this.adapter.observe();
        
        const visionObs = await this.visionEngine.analyzeScene({ id: "cam-1" });
        const audioObs = await this.audioEngine.processAudio({ id: "mic-1" });
        
        const allObs = [...rawObs, ...visionObs, ...audioObs];

        const unifiedObs = this.fusionEngine.fuse(allObs);
        
        this.environmentInterpreter.interpret(unifiedObs);
    }
}
