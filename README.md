| Dashboard / Role | Username | Password |
| :--- | :--- | :--- |
| **Executive View** | `executive` | `executive123` |
| **Engineering View** | `engineer` | `engineer123` |

# 🏛️ Government Portal for Roads and Infrastructure

> **"One platform. One asset identity. Complete lifecycle visibility."**  
> Enterprise-grade Digital Asset Lifecycle Management & Executive Decision-Support Portal built for the **Department of Roads and Buildings, Government of Gujarat**.

---

## 📑 Table of Contents
1. [👥 User Personas & Role-Based Access](#-user-personas--role-based-access)
   - [Executive Persona (Department Secretary)](#1-executive-persona-department-secretary)
   - [Engineering Persona (Superintending Engineer)](#2-engineering-persona-superintending-engineer)
   - [Side-by-Side Persona Matrix](#side-by-side-persona-matrix)
2. [🔐 Login Credentials & One-Click Access](#-login-credentials--one-click-access)
3. [🌟 Core Platform Capabilities](#-core-platform-capabilities)
4. [🏛️ Fullstack Architecture](#-fullstack-architecture)
5. [🚀 Quick Start & Installation](#-quick-start--installation)
6. [📊 Executive Attention Rules Engine](#-executive-attention-rules-engine)
7. [🪪 Digital Asset Passport & Lifecycle Engine](#-digital-asset-passport--lifecycle-engine)
8. [🧪 Step-by-Step Verification & Demo Guide](#-step-by-step-verification--demo-guide)
   - [Part A: Executive View Demo Walkthrough](#part-a-executive-view-demo-walkthrough)
   - [Part B: Engineering View & Automated Lifecycle Demo](#part-b-engineering-view--automated-lifecycle-demo)
9. [🎨 Government Design Standards & Theme Tokens](#-government-design-standards--theme-tokens)
10. [📌 Test Status & Build Verification](#-test-status--build-verification)

---

## 👥 User Personas & Role-Based Access

The portal is tailored around **two distinct primary user personas**, each equipped with dedicated views, permissions, navigation trees, and KPI analytics tailored to their responsibilities:

```text
                                  ┌───────────────────────────┐
                                  │   Official Login Gateway  │
                                  │          (/login)         │
                                  └─────────────┬─────────────┘
                                                │
                      ┌─────────────────────────┴─────────────────────────┐
                      ▼                                                   ▼
       ┌───────────────────────────────┐                 ┌───────────────────────────────┐
       │     👔 EXECUTIVE VIEW         │                 │      👷 ENGINEER VIEW         │
       │   Dr. P. K. Sharma, IAS       │                 │      Rajesh Varma, SE         │
       │   Department Secretary        │                 │  Chief Superintending Engineer│
       ├───────────────────────────────┤                 ├───────────────────────────────┤
       │ • Capital Portfolio Oversight │                 │ • Technical Condition Audits  │
       │ • ₹207.4 Cr Budget Governance │                 │ • Field Defect Logging (IRC)  │
       │ • Budget Overruns & Delays    │                 │ • Work Order Scheduling       │
       │ • Executive Action Triage     │                 │ • GIS Corridor Mapping (Roads)│
       │ • High-Level Recharts Trends  │                 │ • 5-Stage Lifecycle Engine    │
       │ • Default Route: /executive   │                 │ • Default Route: / (Ops Hub)  │
       └───────────────────────────────┘                 └───────────────────────────────┘
```

---

### 1. Executive Persona (Department Secretary)
- **Profile**: **Dr. P. K. Sharma, IAS** — *Department Secretary, Roads & Buildings Department*
- **Role Code**: `executive`
- **Primary Objective**: Strategic governance, capital efficiency, risk mitigation, and milestone compliance across the state's infrastructure portfolio.
- **Key Modules & Capabilities**:
  - **Executive Overview (`/executive`)**: High-level portfolio summary sentence (*"4 projects need immediate attention. 3 projects are over approved budget"*), 6 KPI cards, 5-stage lifecycle pipeline bar, and Recharts interactive graphs (Budget by Stage, Capital Spend Trends).
  - **Projects & Budget Ledger (`/executive/projects`)**: Complete state project inventory detailing approved budget vs. expenditure, variance %, milestone schedule delays, and contractor performance.
  - **Attention Required (`/executive/attention`)**: Auto-triaged list of high-risk projects requiring statutory interventions (delays >60 days, budget variance >15%, overdue inspections >30 days, or critical structural condition).
  - **Executive Telemetry in Asset Passport**: Dedicated financial health and risk card embedded directly in the Digital Asset Passport.

---

### 2. Engineering Persona (Superintending Engineer)
- **Profile**: **Rajesh Varma, SE** — *Chief Superintending Engineer, Public Works Department (PWD)*
- **Role Code**: `engineer`
- **Primary Objective**: Day-to-day asset operations, condition inspections, defect remediation, maintenance scheduling, and physical lifecycle progression.
- **Key Modules & Capabilities**:
  - **Engineering Operations Dashboard (`/`)**: Operational KPI counters (Total 10, Roads 4, Structures 4, Traffic 2, Critical 1, Maintenance Due 2, Overdue Inspections 5), condition distribution, priority breakdown, and recent lifecycle events.
  - **Asset Registry (`/assets`)**: Searchable, filterable database of state highways, bridges, culverts, underpasses, traffic signals, and CCTV networks.
  - **Interactive GIS Map (`/map`)**: Full-screen Leaflet geospatial map rendering road polylines (SG Highway, SP Ring Road, Airport Road) and bridge markers with condition-coded styling.
  - **Digital Asset Passport (`/assets/:id/passport`)**: Master dossier with tabbed management for specifications, GIS path, 5-stage lifecycle timeline, field inspection history, maintenance records, work orders, and official DPR/design documents.
  - **Field Inspection Logging (`/inspections`)**: IRC-aligned defect reporting with automatic severity classification. High-severity defects immediately trigger automated maintenance and switch asset stage to `MAINTAIN`.
  - **Maintenance & Work Orders (`/maintenance`)**: End-to-end work order tracking from initial recommendation, conversion to executable work order, contractor assignment, to final completion and automatic condition score recovery.

---

### Side-by-Side Persona Matrix

| Feature / Dimension | 👔 Executive View (`executive`) | 👷 Engineer View (`engineer`) |
| :--- | :--- | :--- |
| **Designation** | Department Secretary (IAS) | Chief Superintending Engineer (SE) |
| **Default Landing Route** | `/executive` | `/` (Operations Dashboard) |
| **Primary Focus** | Financials, schedule risks, portfolio oversight | Field condition, inspections, repairs, GIS telemetry |
| **Key Metrics** | ₹207.4 Cr Budget, Variance %, Delays, Risk Triage | Health Score (0-100), Condition Band, Overdue Inspections |
| **Asset Level Action** | Review budget variance, contractor, attention flags | Advance lifecycle stage, log defects, issue work orders |
| **Analytics Style** | Recharts Financial Trends & Spend Curves | Condition Distribution, Defect Severity, Event Timeline |
| **Urgent Triage** | Immediate Attention Panel (SLA & Budget triggers) | Critical Assets Roster & Overdue Inspection Warnings |

---

## 🔐 Login Credentials & One-Click Access

The portal includes an official Single Sign-On (SSO) login page at **`/login`** designed according to state government design standards.

| User Persona | Username | Password | Default Landing Page | Role & Access Scope |
| :--- | :--- | :--- | :--- | :--- |
| **👔 Executive** | `executive` | `executive123` | `/executive` | Department Secretary — Macro governance, budget & schedule risk triage |
| **👷 Engineer** | `engineer` | `engineer123` | `/` | Superintending Engineer — Operational engineering, inspections, work orders |

### ⚡ Zero-Friction Demo Access
1. **One-Click Demo Buttons**: On the `/login` screen, click either **"Login as Executive"** or **"Login as Engineer"** to instantly sign in without typing credentials.
2. **In-App Role Switcher**: Once logged in, the top navigation header contains a **Role Switcher Dropdown** that enables seamless toggling between Executive and Engineering views on any page in real time.

---

## 🌟 Core Platform Capabilities

- **🪪 Digital Asset Passport**: A single consolidated endpoint (`GET /api/assets/:id/passport`) delivering the 360° master dossier of any asset (GIS paths, structural specifications, past inspections, maintenance history, work orders, linked documents, and unified chronological timeline).
- **🔄 5-Stage Lifecycle State Machine**: Enforces sequential progression:
  ```text
  [PLAN_DESIGN] ──► [BUILD] ──► [OPERATE] ◄────► [MAINTAIN] ──► [RECONSTRUCTION_REPLACEMENT_RETIREMENT]
  ```
  - Skipping stages is prohibited (HTTP 400).
  - The maintenance loop (`MAINTAIN` ➔ `OPERATE`) is automated upon verified work order completion.
  - Every transition appends an immutable, audited record with actor, timestamp, cost, and rationale.
- **⚡ Event-Driven Workflow Automation**:
  - Logging an inspection with `POOR`/`CRITICAL` condition or `HIGH` defect severity automatically creates a `RECOMMENDED` maintenance record and shifts the asset to `MAINTAIN`.
  - Closing a work order (`CLOSED`) sets maintenance to `VERIFIED`, upgrades asset condition by one band, recalculates health score, and transitions the asset back to `OPERATE`.
- **📊 100-Point Multi-Factor Health Score**: Evaluates physical condition (40%), inspection freshness (20%), age vs. design life (15%), open defects (15%), and maintenance history (10%) with statutory engineering disclaimers.
- **🗺️ Geospatial GIS Telemetry**: Interactive Leaflet map displaying true multi-point coordinate polylines for road corridors and point markers for bridges, culverts, and smart traffic sensors.

---

## 🏛️ Fullstack Architecture

```text
PRAVI-RESEARCH-hackathon/
├── README.md                            # Root workspace documentation
└── my-fullstack-app/
    ├── README.md                        # Application overview
    ├── client/                          # React 18 + Vite Frontend
    │   ├── src/
    │   │   ├── assets/                  # global.css (Navy Blue Government Design System)
    │   │   ├── components/
    │   │   │   ├── common/              # Header, Sidebar, Footer, KpiCard, StatusBadge, ConditionBadge, HealthScore
    │   │   │   ├── dashboard/           # ConditionChart, LifecycleChart, PriorityChart, RecentEvents, CriticalAssetList
    │   │   │   ├── executive/           # ImmediateAttentionPanel, CompactPipeline, BudgetStageChart, SpendTrendChart
    │   │   │   ├── assets/              # AssetTable, AssetFilter, AssetForm
    │   │   │   ├── lifecycle/           # LifecycleTimeline, LifecycleHistory, AdvanceStageForm
    │   │   │   ├── maintenance/         # InspectionTable, InspectionForm, MaintenanceTable, WorkOrderTable, WorkOrderModal
    │   │   │   └── map/                 # AssetMap (Leaflet GIS polylines & markers)
    │   │   ├── context/                 # AuthContext.jsx (Executive/Engineer login state), ViewContext.jsx (View switcher)
    │   │   ├── pages/                   # Login, Dashboard, ExecutiveOverview, ProjectsBudget, AttentionRequired,
    │   │   │                            # AssetRegistry, InfrastructureMap, AssetPassport, Inspections, Maintenance, Analytics, Settings
    │   │   ├── services/                # api.js, assetService.js, executiveService.js, inspectionService.js, maintenanceService.js
    │   │   └── utils/                   # constants.js, formatters.js (Indian numbering: Cr / L)
    │   ├── .env.local                   # VITE_API_URL=http://localhost:5000/api
    │   └── package.json
    │
    └── server/                          # Node.js + Express + MongoDB Backend
        ├── README.md                    # Server API & architecture documentation
        ├── test_api.js                  # Automated integration test runner
        ├── src/
        │   ├── config/                  # db.js (Mongoose connection handler)
        │   ├── controllers/             # asset, executive, inspection, maintenance, workOrder, dashboard, analytics
        │   ├── middleware/              # errorHandler.js, notFound.js
        │   ├── models/                  # Asset.js, Inspection.js, MaintenanceRecord.js, WorkOrder.js
        │   ├── routes/                  # index.js, asset, executive, inspection, maintenance, workOrder, dashboard, analytics
        │   ├── services/                # executive.service.js, workflow.service.js, lifecycle.service.js, dashboard.service.js
        │   ├── utils/                   # executiveRules.js, healthScore.js, constants.js, response.js, ApiError.js
        │   └── seed/                    # seed.js, data.js (Realistic ₹207.4 Cr Ahmedabad portfolio)
        ├── .env
        └── package.json
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: v6.0+ running locally (`mongodb://localhost:27017`) or MongoDB Atlas URI

---

### Step 1: Start Backend Server
Open **Terminal 1**:
```bash
cd my-fullstack-app/server
npm install
npm run seed       # Seeds realistic ₹207.4 Cr portfolio with Ahmedabad infrastructure
npm run dev        # Starts Express server on http://localhost:5000
```

- **Health check**: `http://localhost:5000/health`
- **API Base**: `http://localhost:5000/api`

---

### Step 2: Start Frontend Application
Open **Terminal 2**:
```bash
cd my-fullstack-app/client
npm install
npm run dev        # Starts Vite dev server on http://localhost:5173
```

Navigate to: **`http://localhost:5173/login`**

---

## 📊 Executive Attention Rules Engine

The Executive Decision Engine (`server/src/utils/executiveRules.js`) computes real-time intervention priority for each project:

- **🔴 IMMEDIATE ACTION Required (Red Alert) if ANY condition is met:**
  - Physical structural condition is `CRITICAL`
  - Dynamic composite health score drops below `40/100`
  - Statutory safety inspection overdue by `> 30 days`
  - Approved budget variance overrun exceeds `> 15%`
  - Milestone schedule delivery delayed by `> 60 days`
  - `URGENT` priority defect remediation pending without a scheduled work order
- **🟡 WATCHLIST Status (Amber Alert) if ANY condition is met:**
  - Physical condition is `POOR`
  - Health score in attention bracket (`40 - 54`)
  - Budget variance elevated between `5% - 15%`
  - Safety inspection overdue by `1 - 30 days`
  - Schedule delivery status flagged `AT_RISK`
- **🟢 ON TRACK Status (Green):**
  - All milestones within scheduled delivery dates, budget variance < 5%, and physical condition `GOOD` or `FAIR`.

---

## 🪪 Digital Asset Passport & Lifecycle Engine

Every state asset maintains a unique, tamper-proof **Digital Asset Passport** accessible at `/assets/:id/passport`:
- **Identity & Location**: Natural ID (`RD-AHM-001`), official name, category, corridor length, lanes, GPS coordinates, and Leaflet polyline.
- **Stage Progression Bar**: Highlights current lifecycle stage with interactive controls to advance stage upon entering required engineering notes and budget.
- **Live Health Gauge**: Dynamic 0-100 composite score with instant breakdown into condition rating, inspection freshness, age vs design life, and active defects.
- **Inspection Dossier**: Table of field audits with IRC defect classification.
- **Maintenance Ledger**: Complete record of recommended repairs, contractors, and cost estimates.
- **Work Orders**: Live status of executable repairs with stage advancement (`OPEN` ➔ `IN_PROGRESS` ➔ `COMPLETED` ➔ `CLOSED`).
- **Merged Chronological Timeline**: Unified, reverse-chronological event audit stream.

---

## 🧪 Step-by-Step Verification & Demo Guide

### Part A: Executive View Demo Walkthrough
1. **Access Portal**: Visit `http://localhost:5173/login`. Click **"Login as Executive"** (pre-populates `executive` / `executive123`).
2. **Executive Overview (`/executive`)**:
   - Verify dynamic header sentence: *"4 projects need immediate attention. 3 projects are over approved budget"*.
   - Review 6 KPI cards: Total Approved Budget (₹207.4 Cr), Actual Expenditure (₹200.95 Cr), Budget Variance (+3.6%), Immediate Action Projects (4), Watchlist (1), Overdue Safety Audits (5).
   - Review Recharts graphs: Budget by Lifecycle Stage and Monthly Capital Spend.
3. **Immediate Attention Panel**:
   - Inspect top flagged assets: River Bridge East (`BR-AHM-001`), Culvert Near Ring Road (`CV-AHM-001`), and Airport Corridor (`RD-AHM-003`).
   - Note specific governance triggers and statutory recommendations displayed.
4. **Projects & Budget Table (`/executive/projects`)**:
   - Filter by category (`STRUCTURE`) or stage (`BUILD`). Sort by *Variance %*.
   - Verify portfolio summary footer (₹207.4 Cr approved, ₹200.95 Cr spent).
5. **Passport Executive Telemetry**:
   - Click `BR-AHM-001` to view its Digital Asset Passport.
   - Observe the **Budget & Schedule Overview (Executive Telemetry)** panel displaying approved budget, spent amount, variance (+3.6%), and active attention triggers.

---

### Part B: Engineering View & Automated Lifecycle Demo
1. **Switch to Engineer View**:
   - Use the header dropdown to select **"Engineer View"** (or log in with `engineer` / `engineer123`).
2. **Operations Hub (`/`)**:
   - Review operational asset counters (10 assets total, 1 critical, 2 maintenance due, 5 overdue inspections).
   - Check condition distribution and recent lifecycle events stream.
3. **Interactive GIS Map (`/map`)**:
   - Verify road polylines (SG Highway, SP Ring Road) and bridge markers with condition-coded styling across Ahmedabad.
4. **Asset Passport Inspection**:
   - Click `RD-AHM-001` (SG Highway Section 01) and click **"Open Digital Asset Passport"**.
   - Note asset ID `RD-AHM-001`, stage `MAINTAIN`, condition `FAIR`, and health score (72/100).
5. **Log Severe Defect (Automated Workflow Trigger)**:
   - Switch to the **Inspections** tab.
   - Click **"Log New Inspection"**.
   - Select Condition: `POOR`. Add defect: Type `Potholes`, Severity `HIGH`.
   - Click **"Submit Inspection Report"**.
   - **Verification**: Green banner confirms inspection logged. Backend automatically generates a `RECOMMENDED` maintenance record and transitions asset status to `MAINTAIN`.
6. **Work Order Execution & Automatic Condition Upgrade**:
   - Switch to the **Maintenance Records** tab.
   - Locate the newly created record and click **"Convert to Work Order"**.
   - Under **Work Orders**, click **Advance Status** from `OPEN` ➔ `IN_PROGRESS` ➔ `COMPLETED`.
   - Click **"Close Work Order"**.
   - **Verification**: Linked maintenance marks `VERIFIED`, asset condition upgrades by one band (e.g. `POOR` ➔ `FAIR`), health score recalculates, and asset transitions back to `OPERATE`.
7. **Verify Bridge Distress**:
   - Open `BR-AHM-001` (River Bridge East). Review structural defects (`Concrete cracking`, `Corrosion`) and critical composite score (22/100).

---

## 🎨 Government Design Standards & Theme Tokens

Designed in accordance with official state government visual guidelines using CSS custom properties (`client/src/assets/global.css`):
- `--navy-900: #0B1F3A`: Top header, table header typography, footer background.
- `--navy-800: #12305A`: Sidebar background and active container cards.
- `--navy-700: #1B4079`: Primary action buttons, active navigation markers, chart accents.
- `--navy-600: #2A5599`: Interactive hover states and secondary series.
- `--navy-100: #E6ECF5`: Table header background and subtle card borders.
- `--accent-gold: #C9A227`: 3px header underline and active sidebar accent line.
- `--good: #2E7D32` (Green), `--fair: #B7791F` (Amber), `--poor: #C2571A` (Orange), `--critical: #B3261E` (Crimson): Official infrastructure condition indicators.

---

## 📌 Test Status & Build Verification

- ✅ **Backend Automated Test Suite**: Passed all integration tests (`node test_api.js`) covering passport compilation, dual identification, lifecycle constraints, workflow automation, and analytics.
- ✅ **Frontend Production Build**: `npm run build` in `client/` passes cleanly with zero syntax or bundling errors.
- ✅ **Role-Based Routing & Session State**: Persistent login state via `localStorage` with instantaneous role switching.
- ✅ **GIS Coordinate Mapping**: Leaflet polyline rendering tested across 4 major road corridors in Ahmedabad.

---

*Government Portal for Roads and Infrastructure | Made by Pravi | Demo application using realistic state infrastructure telemetry. Not an official government record.*
