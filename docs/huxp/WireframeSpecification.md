# Wireframe Specification

## Global Shell
- **Sidebar**: Icons for Home, Queue, Observatory, Knowledge, Settings.
- **Header**: Current context, global health indicator, notifications.

## Mission Control Layout
- **Top Header**: Mission Title, Status Badge, Elapsed Time, Progress Bar, Control Buttons (Launch, Pause).
- **Left Panel (250px)**: Mission Timeline, Task Tree, Collapsible Logs.
- **Center Canvas (Fluid)**: Live World Model (rendering objects, spatial data), Digital Twin.
- **Right Panel (350px)**: Live Cognitive Pipeline (Observation -> World Model -> ... -> Execution).
- **Bottom Panel (200px)**: Live HCNS Event Stream, Console output.

## Dark Theme Aesthetics
- **Background**: `bg-zinc-950`
- **Panels**: `bg-zinc-900` with subtle `border-zinc-800`
- **Accents**: Neon green (`text-emerald-400`) for active/healthy, Amber for warnings, Indigo for cognition.
