import React, { useState } from "react";
import { HMCCApp } from "./components/HMCCApp";
import { MissionControlApp } from "./components/MissionControlApp";

export default function App() {
  const [view, setView] = useState("hmcc"); // "hmcc" | "mission_control"
  const [activeMission, setActiveMission] = useState<any>(null);

  if (view === "mission_control") {
    return <MissionControlApp activeMission={activeMission} onBack={() => setView("hmcc")} />;
  }

  return <HMCCApp onStartMission={(mission) => {
    setActiveMission(mission);
    setView("mission_control");
  }} />;
}
