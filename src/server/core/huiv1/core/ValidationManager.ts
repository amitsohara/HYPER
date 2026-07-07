import { ComponentValidator } from '../validators/ComponentValidator.js';
import { NavigationValidator } from '../validators/NavigationValidator.js';
import { InteractionValidator } from '../validators/InteractionValidator.js';
import { BackendConnectionValidator } from '../validators/BackendConnectionValidator.js';
import { WebSocketValidator } from '../validators/WebSocketValidator.js';
import { EventSynchronizationValidator } from '../validators/EventSynchronizationValidator.js';
import { MissionWorkflowValidator } from '../validators/MissionWorkflowValidator.js';
import { VisualizationValidator } from '../validators/VisualizationValidator.js';
import { PerformanceValidator } from '../validators/PerformanceValidator.js';
import { AccessibilityValidator } from '../validators/AccessibilityValidator.js';
import { SecurityValidator } from '../validators/SecurityValidator.js';
import { MockDataDetector } from '../validators/MockDataDetector.js';
import { DeadComponentDetector } from '../validators/DeadComponentDetector.js';
import { RouteValidator } from '../validators/RouteValidator.js';
import { StateSynchronizationValidator } from '../validators/StateSynchronizationValidator.js';
import { TelemetryValidator } from '../validators/TelemetryValidator.js';
import { CIAPValidator } from '../validators/CIAPValidator.js';

export class ValidationManager {
    runAll() {
        console.log("Running all validations");
        const results = {
            ciap: new CIAPValidator().detect('./src/server/core')
        };
        return results;
    }
}
