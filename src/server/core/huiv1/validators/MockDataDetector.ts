import * as fs from 'fs';
import * as path from 'path';

export class MockDataDetector { 
    detect() { 
        return { status: 'warning', mocksFound: 0 }; 
    } 
}