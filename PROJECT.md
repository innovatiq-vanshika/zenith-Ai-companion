# Zenith AI — Project Documentation & Workspace Blueprint

This document outlines the complete architectural design, problem statement, key features, workflows, technologies, and diagrams for **Zenith AI** (formerly FocusFlow AI). This blueprint is structured for easy reference and can be submitted directly as part of your project portfolio or copied into a Google Doc.

---

## 1. Problem Statement Selected

### The Placement Preparation & Cognitive Fatigue Dilemma
College students and young professionals preparing for high-stakes placement exams, career milestones, and interviews face a multi-dimensional challenge:
- **Productivity Fragmentation**: Students switch constantly between task managers, countdown timers, ambient noise apps, and documentation notebooks, degrading their mental focus and breaking flow state.
- **The Decision Anxiety Loop**: When faced with career dilemmas (e.g., *should I study for placements early vs. build hobby projects?*), students experience analysis paralysis without objective framework tools.
- **Goal-to-Action Disconnect**: Long-term ambitions (e.g., *"secure a job at a global product firm"*) feel too abstract because they aren't systematically decomposed into daily micro-habits and tasks.
- **Static vs. Adaptive Planners**: Standard calendars and to-do lists are static. They do not predict deadline risks, adapt to missed targets, or provide tailored, real-time advice from seasoned persona coach agents.
- **API High-Demand / Outage Vulnerability**: Typical modern AI applications completely break down during model outages or high-traffic spikes, disrupting critical study hours.

---

## 2. Solution Overview

**Zenith AI** is an intelligent, full-stack career strategy companion and high-performance focus environment that transforms broad placement goals into executable daily actions. Styled with a professional, high-contrast visual aesthetic (Zenith Slate theme), the system orchestrates study schedules, solves career dilemmas using structured Generative UI widgets, and maintains your focus with adaptive countdown triggers.

### Architectural Core Resilience:
To address API instability, Zenith is fortified with an **Automated Graceful Failover Engine** at the Express API layer. If the cloud-hosted Gemini 3.5 model experiences temporary surges or status `503` overloads, Zenith instantly switches to locally computed intelligent algorithms. This ensures that scheduling, task breakdown, prioritization, risk calculations, and coach sessions remain **100% active and responsive**, protecting student study blocks from any external disruptions.

---

## 3. Detailed System Architecture & Diagrams

### A. High-Level System Architecture
The application uses a full-stack architecture with a React-Vite client-side single page app (SPA) serving as the UI, communicating with an Express.js backend that handles API orchestration, custom fallbacks, and the Google Gen AI SDK integration.

```
+------------------------------------------------------------------------+
|                            CLIENT LAYER                                |
|  [React SPA] -> Rich Interactivity, Framer Motion, Tailwind Canvas,     |
|                 Lucide Icons, Interactive Video & Live Tour guides     |
+------------------------------------+-----------------------------------+
                                     |
                                     v  (JSON / HTTP API)
+------------------------------------+-----------------------------------+
|                            SERVER LAYER                                |
|  [Express + Node.js]                                                   |
|  - API Gateway Routes (Breakdown, Prioritization, Coach, Risks, Comms) |
|  - Intelligent Graceful Failover Engine (Protects against 503 errors)  |
+------------------------------------+-----------------------------------+
                                     |
                                     +-----------------+
                                     |                 |
                                     v (Normal Mode)   v (Failover Mode)
                        +------------+-----------+   +-------------------+
                        |   Google Gen AI SDK    |   | Local Algorithmic |
                        |   Gemini 3.5 Flash     |   | Fallback Engine   |
                        +------------------------+   +-------------------+
```

---

### B. Core Application Workflows

#### 1. Strategic Task Breakdown & Focus Lifecycle
This diagram illustrates how a placement goal is decomposed into micro-tasks, bound to the focus workspace timer, and logged in real-time.

```
[User inputs big target] ──> [Task Engine requests Breakdown]
                                     │
                                     ▼
                      Is Gemini API online (503)?
                       ├── [Yes] ──> Generate structured subtasks with AI
                       └── [No]  ──> Deploy local phase-decomposition model
                                     │
                                     ▼
                  [Binder connects subtask to Timer Clock]
                                     │
                      (Choose Pomodoro or Stopwatch)
                                     ▼
                [Deep Focus Session Starts + Ambient Waves]
                                     │
                                     ▼
              [Timer Completes] ──> Log elapsed time to Task
                                     │
                                     ▼
                [Analytics Engine updates Productivity score]
```

#### 2. Decision Coach & Generative UI Pipeline
This workflow details how user career dilemmas are resolved with tailored advisors and rendered into custom visual widgets.

```
[User queries career dilemma in Coach Panel]
                     │
                     ▼
       [Backend gathers Agent Persona]
    (Strict Mentor / Buddy / Advisor / Friendly)
                     │
                     ▼
          Does Gemini respond (200)?
           ├── [Yes] ──> Structural JSON parsed
           └── [No]  ──> Fallback persona template rendered locally
                     │
                     ▼
       [Client renders custom Generative UI widget]
    (Pros & Cons, Action Plan, Custom Schedule Block)
```

---

## 4. Key Features

1. **Intelligent Dashboard Hub**:
   - **AI Insight Orb**: Provides tailored recommendations matching your chosen study guide.
   - **Future Self Mode**: Calculates placement probability metrics based on active deliverables.
   - **Productivity Score Circular Ring**: High-contrast, interactive visual tracking of completed milestones.

2. **Strategic Task Engine**:
   - Create complex deliverables, assign duration estimates, and set priorities (Critical, High, Medium, Low).
   - Instant sub-task breakdowns with detailed Gantt timelines and parent-child visual dependency trees.
   - Smart AI Priority Queue: Sorts outstanding backlogs logically based on urgency and benefits.

3. **High-Performance Focus Workspace**:
   - **Classic Pomodoro Countdown**: Structured blocks (Focus/Breaks) with an interactive glowing circular progress ring.
   - **Continuous Stopwatch**: Live stopwatch tracking with active task locks and completion logs.
   - **Ambient Sound Waves**: Binaural focus tracks (40Hz cognitive, cyberpunk synth, rainy café) to maximize concentration.
   - **Scribble Pad & Voice Simulation**: Quick-notes pad to jot down interview formulas and voice simulation triggers.

4. **AI Decision Coach**:
   - Interactive consultation room featuring multiple expert personas (Friendly Coach, Strict Mentor, Study Buddy, Professional Advisor).
   - Displays custom structural widgets depending on the dilemma, avoiding flat text responses.

5. **Demo Video Walkthrough & Interactive Live Tour**:
   - **HD Player Simulator**: Explains the entire application workflow in 1:45 minutes with an interactive progress slider and chapters playlist.
   - **Interactive Live Workspace Tour**: Floating overlay guide that walks you through the live screens and tabs, showing you how to utilize every feature immediately.

---

## 5. Technologies Used

- **Frontend Framework**: React 18 with Vite
- **Programming Language**: TypeScript
- **Styling**: Tailwind CSS (with professional custom theme and high-contrast Slate design tokens)
- **Animations**: Framer Motion (`motion/react`) for page/tab transitions, springy panels, and pulse/vortex visual states
- **State Management**: Reactive React Hook state with optimized local persistence
- **Icons**: Lucide React (complete unified high-fidelity icon library)
- **Backend Runtime**: Node.js & Express.js
- **Bundler & Dev Compiler**: TSX (Dev runtime) & Esbuild (bundling the production-ready CJS server)

---

## 6. Google Technologies Utilized

- **Google Gen AI SDK (`@google/genai`)**: The modern, official Node.js SDK utilized to orchestrate all communication with Google's large language models.
- **Gemini 3.5 Flash (`gemini-3.5-flash`)**: The core model powering the intelligent insights, structured breakdowns, deadline risk predictions, and professional advisor coach roles.
- **Structured JSON Schemas & Type Guards**: Leveraged `responseMimeType: "application/json"` and strict JSON schema objects passed directly via the Google Gen AI configuration to enforce predictable data payloads from Gemini, feeding the client's custom generative widgets flawlessly.
- **Google Cloud Run**: The container-native execution environment hosting the full-stack Zenith server, maintaining low-latency ingress routing behind an nginx reverse proxy layer on port 3000.
