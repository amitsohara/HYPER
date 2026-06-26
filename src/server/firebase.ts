import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import fs from "fs";
import path from "path";

let db: any = null;

try {
  const configPath = path.resolve(process.cwd(), "firebase-applet-config.json");
  let config: any = null;
  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  }
  
  if (getApps().length === 0 && config) {
    const app = initializeApp(config);
    db = getFirestore(app, config.firestoreDatabaseId);
  } else if (config) {
    db = getFirestore(getApp(), config.firestoreDatabaseId);
  }
} catch (e) {
  console.error("Firebase initialization failed:", e);
}

export { db };
