# 🤖 AI Neural Node Workbench

A full-stack, authenticated multi-session AI dashboard and parameter tuning studio built using a modern **Next.js App Router** architecture, **Apollo GraphQL Server**, **Zustand**, and **Tailwind CSS v4**.

## 🌐 Live Application Telemetry

- **Production Deployment URL:** `https://ai-node-workbench.onrender.com/`
- **📋 Testing Credentials Cheat Sheet:**
  - **Username:** `admin`
  - **Password:** `password123`

---

## 🛠️ System Architecture & Engineering Patterns

This application was engineered as a high-performance blueprint to demonstrate advanced full-stack capabilities, cross-platform stability, and architectural translation from enterprise Angular paradigms into modern React server frameworks.

### 1. Full-Stack Next.js & File-System Routing

- **Unified Workspace Backend:** Replaced legacy Express script setups by integrating Next.js native API handlers (`/api/model-config` and `/api/submit-config`) running on a shared, thread-safe server memory database (`db.ts`).
- **Server-Side Middleware Guards:** Implemented global `middleware.ts` to intercept client traffic at the routing layer, reading browser session cookie signatures to completely prevent unauthorized deep-linking attempts to sub-directories.

### 2. API Schema Gateways via GraphQL

- **Single Endpoint Gateway:** Leveraged **Apollo Server** inside Next.js routes (`/api/graphql`) to deploy a strongly typed data layer.
- **Strict Contracts:** Engineered rigid structural schemas (`typeDefs`) and precise execution function mappings (`resolvers`) to process real-time text thread mutations, eliminating REST data over-fetching.

### 3. Decoupled Thread State Management

- **Multi-Session Tracking:** Utilized **Zustand** to orchestrate nested conversation matrices (`ChatThread[]`), cleanly separating view layer components from heavy data transactions.
- **State Persistence Middlewares:** Connected Zustand persistence middleware to mirror active sessions straight to browser `localStorage`, ensuring user data remains intact through hard browser updates or network refreshes (F5).

### 4. Interactive Parameters Studio Forms

- **Optimized Forms:** Integrated **React Hook Form** to handle granular user input validation without triggering traditional React macro element component re-renders.
- **Dynamic Content Toggles:** Wired up real-time checkbox tracking (`watch`) to inject or prune structural markup dynamically based on authentication constraints.
- **Type-Casting Safeguards:** Applied explicit `valueAsNumber` transformations on HTML inputs to guarantee data primitive sync with backend validation filters.

### 5. Automated Quality Engineering

- **Virtual Browser Sandbox:** Engineered an asynchronous, high-coverage testing pipeline powered by **Vitest, React Testing Library, and JSDOM**.
- **Robust Assertions:** Written assertions utilizing `data-testid` targeting and `waitFor()` blocks to bypass Next.js compilation inconsistencies and validate dynamic view tree states.
- **Cross-Platform Path Resolving:** Implemented native Node `path.resolve` mappings to eliminate Windows-specific directory tracking bugs during local and cloud CI/CD executions.

---

## 🚀 Local Workspace Deployment Blueprint

To spin up this repository on your local computer, open your **VS Code Windows PowerShell terminal** and execute the following commands sequence:

### 1. Initialize Code Repository & Dependencies

```powershell
# Clone the repository files from GitHub
git clone [Insert Your GitHub Repository URL here]
cd AI-Node-Workbench

# Install production and development dependency manifests
npm install
```

### 2. Configure Tailwind CSS v4 Engines

```powershell
# Verify PostCSS and Tailwind v4 core processing packages are present
npm install tailwindcss @tailwindcss/postcss postcss
```

### 3. Clear Caches & Launch Development Server

```powershell
# Flush previous Next.js cache directories and launch the hot-reloading development loop
if (Test-Path .next) { Remove-Item -Recurse -Force .next }; npm run dev
```

Once the compilation grid finishes, open your browser viewport to **`http://localhost:3000`** to test the system live.

---

## 🧪 Executing Automated Test Suites

To execute the front-end form validation metrics and back-end API route telemetry validation specs, open a separate **PowerShell terminal window** and trigger Vitest:

```powershell
# Run the automated test suite runner
npm run test
```

---

## 📁 Repository Directory Matrix

```text
├── app/                        # Next.js App Router Directory
│   ├── api/                    # Server-Side Backend Routing Layer
│   │   ├── db.ts               # In-Memory Database Store Configuration
│   │   ├── graphql/            # Apollo GraphQL Gateway Server Endpoint
│   │   ├── model-config/       # Config Parameters GET Telemetry Node
│   │   └── submit-config/      # Form Payload Validation POST Handler
│   ├── registry/               # Case-Sensitive Lowercase Model Registry Sub-page
│   ├── settings/               # App Parameter Tuning Studio Sub-page
│   ├── global.css              # Tailwind CSS v4 Master Token Imports
│   ├── layout.tsx              # Root HTML Server Side Structural Wrapper
│   └── page.tsx                # Client Routing Root Entry & Guard Verification
├── src/                        # Decoupled React Structural Shared Views
│   ├── AiModelForm.tsx         # Type-Safe Parameters Form with React Hook Form
│   ├── ChatDashboard.tsx       # Main Sidebar and Chat Shared Grid Workspace View
│   ├── ChatHistorySidebar.tsx  # Dynamic Multi-Session Navigation NavLink Drawer
│   ├── LiveAiStream.tsx        # Simulated AI Streaming & Markdown Parser Panel
│   ├── store.ts                # Zustand Multi-Thread Global State Memory Store
│   └── test/                   # Quality Engineering Directory
│       └── setup.ts            # Global Testing DOM Assertion Extensions
├── tsconfig.build.json         # Specialized Production TypeScript Exclusions Config
├── vitest.config.ts            # JSDOM Browser Sandbox Vitest Configuration
└── package.json                # Primary Project Lifecycle Manifest Script Block
```
