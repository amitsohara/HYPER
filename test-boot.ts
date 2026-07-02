import { initHyperMindPlatform } from "./bootstrap.js";

async function run() {
    try {
        await initHyperMindPlatform();
        console.log("Boot successful.");
        process.exit(0);
    } catch (err) {
        console.error("Boot failed:", err);
        process.exit(1);
    }
}
run();
