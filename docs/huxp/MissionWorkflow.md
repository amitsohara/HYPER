# Mission Workflow

## 1. Creation (Home)
- Initiated via "New Mission".
- Wizard Flow:
  1. Details (Name, Type, Priority, Objectives).
  2. Inputs (Sensors, Camera, Text, KB).
  3. Execution Mode (Live, Simulation, Dry Run, Offline).
  4. Review (Validation, Estimation, Safety).
- Results in Mission entering the `READY` state in the Mission Queue.

## 2. Queueing (Mission Queue)
- Operator views `READY` or `PAUSED` missions.
- Selects a mission to transition into `Mission Control`.

## 3. Execution (Mission Control)
- The mission is launched.
- State transitions to `RUNNING`.
- Live pipeline activates (Observation -> Execution).
- Operator can Pause, Resume, Abort, or Replay.

## 4. Completion & Replay (Observatory / Knowledge Center)
- Completed missions output to the Knowledge Center.
- Traces and performance are available in the Cognitive Observatory and Replay Center.
