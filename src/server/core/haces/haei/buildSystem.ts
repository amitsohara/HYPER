import { BuildArtifact, CodeArtifact } from "./engineeringTypes.js";
import { EngineeringEventBus, EngineeringEvents } from "./engineeringEvents.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class BuildSystem {
    private eventBus = EngineeringEventBus.getInstance();

    public build(artifacts: CodeArtifact[]): BuildArtifact {
        const build: BuildArtifact = {
            build_id: uuidv4(),
            artifacts: artifacts.map(a => `${a.path}.bundle.js`),
            checksums: {
                "bundle.js": "sha256-mock-checksum-123"
            },
            sbom: "Software Bill of Materials...",
            timestamp: Date.now()
        };

        this.eventBus.publish(EngineeringEvents.BUILD_COMPLETED, { build });
        return build;
    }
}
