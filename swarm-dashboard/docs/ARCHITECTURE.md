# System Architecture 🧠

This document outlines the high-level architecture of the Autonomous AI Studio Dashboard. Built for speed, reactivity, and complex data visualization, the app uses a modern React stack.

## 1. Core Stack
- **Framework**: React 18 powered by Vite for instant HMR and optimized production builds.
- **State Management**: `zustand` is used for global state management. It provides a lightweight, hooks-based API to manage themes, authentication, audio settings, and real-time pipeline status without the boilerplate of Redux.
- **Animations**: `framer-motion` handles all complex keyframe animations, component presence (mounting/unmounting), and the immersive Cyberpunk Boot Sequence.
- **Visualizations**: 
  - `@xyflow/react` powers the interactive LangGraph Pipeline Canvas, handling node rendering, edge connections, and the embedded MiniMap.
  - `recharts` is used for rendering GPU telemetry and Financial charts on the FinOps dashboard.

## 2. Global State (`store.jsx`)
The Zustand store acts as the single source of truth for the application:
- `theme`, `compactLayout`: Controls UI aesthetics.
- `soundAlerts`, `ambientMusic`: Global toggles that gate the Web Audio API hooks.
- `isAuthenticated`: Controls the RBAC login gate.
- `toasts`: Manages the queue of global notification alerts.
- `channelStates`: A simulated real-time data structure tracking the execution progress of 10 distinct AI niches.

## 3. Audio Architecture
We bypassed traditional `.mp3` assets in favor of the **Native Web Audio API**.
- `useAmbientMusic.js`: A singleton hook that spins up a low-frequency oscillator drone. It runs continuously in the background and respects the global `ambientMusic` toggle.
- `useSonicFeedback.js`: An event-driven hook that synthesizes distinct waveforms (Sine, Triangle, Square, Sawtooth) on demand for UI interactions like `playTabClick`, `playMenuClick`, `playNodeSelect`, and `playEventProcess`.

## 4. Component Hierarchy
1. **`App.jsx`**: The root controller. It orchestrates the `BootScreen` loading sequence, enforces the `Login` gate, and mounts all global utilities (`ToastContainer`, `useAmbientMusic`).
2. **`Dashboard.jsx`**: The main hub. It dynamically renders internal tabs (`Overview`, `FinOps`, `Traces`, etc.) based on the active state.
3. **`PipelineCanvas.jsx`**: A complex, encapsulated graph view. It listens to the `channelStates` and updates node progress and CSS pulse animations in real-time.
4. **`AgentTraceView` & `FinOpsDashboard`**: Data-heavy components. They contain logic for generating CSV and JSON `Blob` objects for 1-click user downloads.

## 5. Next Steps for Production
- Replace the mock `channelStates` with a `WebSocket` connection to stream live execution logs from a Python LangGraph backend.
- Implement a `Dockerfile` and `nginx` configuration for enterprise deployment.
