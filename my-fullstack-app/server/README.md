# 🏛️ Government Road & Infrastructure Asset Lifecycle Management System — Server

> **Enterprise-grade REST API backend** powering the Infrastructure Asset Management Platform. Implements the **Digital Asset Passport**, an automated **5-stage lifecycle state engine**, **event-driven workflow side effects**, a **dynamic multi-factor health scoring algorithm**, and **executive analytics**.

---

## 📑 Table of Contents
1. [Overview & Key Features](#-overview--key-features)
2. [Tech Stack](#-tech-stack)
3. [Project Directory Structure](#-project-directory-structure)
4. [Quick Start & Setup](#-quick-start--setup)
5. [Environment Variables](#-environment-variables)
6. [Core Architecture & Business Logic](#-core-architecture--business-logic)
   - [Flow of Execution](#1-flow-of-execution)
   - [Digital Asset Passport](#2-digital-asset-passport)
   - [5-Stage Lifecycle State Machine](#3-5-stage-lifecycle-state-machine)
   - [Automated Workflow Side Effects](#4-automated-workflow-side-effects)
   - [Multi-Factor Health Score Algorithm](#5-multi-factor-health-score-algorithm)
7. [REST API Reference](#-rest-api-reference)
   - [System & Discovery](#system--discovery)
   - [Asset Inventory & Passport](#asset-inventory--passport)
   - [Inspections & Defect Logging](#inspections--defect-logging)
   - [Maintenance Management](#maintenance-management)
   - [Work Orders](#work-orders)
   - [Executive & Dashboard Analytics](#executive--dashboard-analytics)
   - [Traffic & Sensor Assets](#traffic--sensor-assets)
8. [Sample API Payloads](#-sample-api-payloads)
9. [Automated Verification & Testing](#-automated-verification--testing)
10. [Troubleshooting & FAQs](#-troubleshooting--faqs)

---

## 🌟 Overview & Key Features

Modern municipal and highway authorities manage diverse infrastructure—roads, bridges, culverts, flyovers, traffic signals, and surveillance equipment—often using disconnected spreadsheets and legacy systems. 

This backend solves this fragmentation by providing:
- **🪪 Digital Asset Passport**: A single consolidated endpoint returning the 360° master dossier of any asset (GIS paths, structural specifications, past inspections, maintenance history, work orders, linked documents, and unified chronological timeline).
- **🔄 Strict Lifecycle State Machine**: Governs asset progression across 5 formal stages (`PLAN_DESIGN`, `BUILD`, `OPERATE`, `MAINTAIN`, `RECONSTRUCTION_REPLACEMENT_RETIREMENT`) with non-skippable transition validation and immutable audit trails.
- **⚡ Automated Workflow Triggers**: When field engineers report `POOR`/`CRITICAL` condition or `HIGH` severity defects during inspections, the system automatically creates maintenance items and switches asset status to `MAINTAIN`. When work orders are closed, repairs are verified, condition scores are upgraded, and the asset is returned to `OPERATE`.
- **📊 100-Point Dynamic Health Score**: Calculates composite infrastructure health based on condition band, inspection freshness, age vs. design life, active defect severity, and maintenance backlogs.
- **👔 Executive KPI & Portfolio Analytics**: Real-time aggregation of capital investment, budget utilization vs. actuals, overdue inspections, critical asset alerts, and project risk categorization (`IMMEDIATE_ACTION`, `WATCHLIST`, `ON_TRACK`).

---

## 🛠 Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Node.js** (v18+) | JavaScript runtime environment |
| **Express.js** (v4.19) | Fast, modular REST API web framework |
| **MongoDB** & **Mongoose** (v8.5) | Document database & schema-validated object modeling |
| **Morgan** | HTTP request logger for debugging |
| **CORS** | Cross-Origin Resource Sharing with frontend origin validation |
| **Nodemon** | Auto-reloading development server |

---

## 📁 Project Directory Structure

```text
server/
├── .env                  # Local environment configuration (git-ignored)
├── .env.example          # Template for environment variables
├── package.json          # Dependencies, scripts, and engine specifications
├── test_api.js           # Automated integration test runner
└── src/
    ├── app.js            # Express app configuration, middleware, & route mounting
    ├── server.js         # HTTP server entry point & MongoDB connection bootstrap
    ├── config/
    │   └── db.js         # Mongoose connection handler with error retry logic
    ├── constants/        # Central domain enums (stages, conditions, priorities)
    ├── controllers/      # HTTP request handling, input validation, & responses
    │   ├── analytics.controller.js  # Condition distributions & lifecycle capital analytics
    │   ├── asset.controller.js      # Asset CRUD, passport compilation, lifecycle advancement
    │   ├── dashboard.controller.js  # High-level overview counts & KPI summaries
    │   ├── executive.controller.js  # Executive portfolio summaries, budget tracking, & alerts
    │   ├── inspection.controller.js # Inspection logging with automated side-effects
    │   ├── maintenance.controller.js# Maintenance record scheduling and status updates
    │   └── workOrder.controller.js  # Work order generation and lifecycle completion
    ├── middleware/
    │   ├── errorHandler.js          # Centralized error formatting & status code handling
    │   └── notFound.js              # Catch-all 404 handler for undefined routes
    ├── models/           # Mongoose schemas & database validation
    │   ├── Asset.js                 # Infrastructure asset specs, GIS coordinates, & timeline
    │   ├── Inspection.js            # Field inspection records, ratings, & defect items
    │   ├── MaintenanceRecord.js     # Recommended/scheduled repairs, costs, & contractors
    │   └── WorkOrder.js             # Executable work orders linked to maintenance records
    ├── routes/           # Express router definitions
    │   ├── index.js                 # Master router mounting all sub-routes under /api
    │   ├── analytics.routes.js      # /api/analytics
    │   ├── asset.routes.js          # /api/assets
    │   ├── dashboard.routes.js      # /api/dashboard
    │   ├── executive.routes.js      # /api/executive
    │   ├── inspection.routes.js     # /api/inspections
    │   ├── maintenance.routes.js    # /api/maintenance
    │   └── workOrder.routes.js      # /api/work-orders
    ├── seed/             # Database seeder scripts
    │   ├── data.js                  # Realistic Ahmedabad infrastructure seed dataset
    │   └── seed.js                  # Idempotent seed runner
    ├── services/         # Core business logic & workflow orchestration
    │   ├── dashboard.service.js     # Dashboard metrics & aggregation queries
    │   ├── executive.service.js     # Portfolio budget, risk categorization, & delay logic
    │   ├── lifecycle.service.js     # Lifecycle state machine transition validator
    │   └── workflow.service.js      # Side-effect automation (inspections, repairs, status)
    └── utils/            # Helper utilities
        ├── ApiError.js              # Custom operational error class
        ├── asyncHandler.js          # Async wrapper to eliminate try/catch boilerplate
        ├── constants.js             # Shared system constants & categories
        ├── executiveRules.js        # SLA, budget variance, and attention evaluation rules
        ├── healthScore.js           # Multi-factor 100-point health score algorithm
        └── response.js              # Standardized API response envelope helper
```

---

## 🚀 Quick Start & Setup

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **MongoDB** running locally (`mongodb://localhost:27017`) or a **MongoDB Atlas** connection string
- **npm** (comes packaged with Node.js)

### Step 1: Install Dependencies
From the `server` directory:
```bash
cd server
npm install
```

### Step 2: Configure Environment Variables
Verify or create your `.env` file in the `server/` root:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/infra_lifecycle_db
CLIENT_URL=http://localhost:5173
```

### Step 3: Seed the Database
Populate realistic infrastructure assets (Ahmedabad corridors, SG Highway, Ring Road, bridges, culverts, CCTV cameras, traffic signals) with past inspections, maintenance logs, and work orders:
```bash
npm run seed
```
> **Note:** The seeder is **idempotent**—it resets existing collections before inserting fresh records so you can run it safely at any time.

### Step 4: Run the Server
- **Development Mode** (with hot reload via nodemon):
  ```bash
  npm run dev
  ```
- **Production Mode**:
  ```bash
  npm start
  ```

Once running:
- **Base API URL:** `http://localhost:5000/api`
- **Health Check:** `http://localhost:5000/health`
- **Root Discovery:** `http://localhost:5000/api`

---

## ⚙️ Environment Variables

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | Number | `5000` | Port on which Express server listens |
| `NODE_ENV` | String | `development` | Runtime environment (`development` or `production`) |
| `MONGO_URI` | String | `mongodb://localhost:27017/infra_lifecycle_db` | MongoDB connection URI |
| `CLIENT_URL` | String | `http://localhost:5173` | Allowed frontend origin for CORS policies |

---

## 🏛️ Core Architecture & Business Logic

### 1. Flow of Execution
```text
HTTP Request
     │
     ▼
[routes/*.routes.js]         ─ Route matching & parameter extraction
     │
     ▼
[controllers/*.controller.js] ─ Input parsing & standardized envelope formatting
     │
     ▼
[services/*.service.js]       ─ Core business rules, validation, & automated workflows
     │
     ▼
[models/*.js]                ─ Mongoose schemas, data validation, & constraints
     │
     ▼
[(MongoDB Database)]         ─ Persistent document storage
```

### 2. Digital Asset Passport
The endpoint `GET /api/assets/:id/passport` acts as the single source of truth for an asset. Rather than making multiple round trips, it resolves:
1. **Asset Master Profile**: IDs, name, category (`ROAD`, `STRUCTURE`, `TRAFFIC`), construction year, design life, cost, contractor, and GIS geometry (multi-point polylines for roads, lat/lng points for structures).
2. **Current Health Status**: Condition rating, composite health score (0-100), and health band (`Healthy`, `Attention Required`, `Critical`).
3. **Historical Dossier**: All inspections, defect logs, maintenance logs, and work orders.
4. **Documents Reference**: Links to Detailed Project Reports (DPR), Design Drawings, Quality Certificates, and Handover documents.
5. **Merged Chronological Timeline**: Unifies lifecycle stage changes, field inspections, maintenance actions, and work orders into a single, reverse-chronological event stream.

### 3. 5-Stage Lifecycle State Machine
Assets transition sequentially through 5 standardized lifecycle stages:

```text
[PLAN_DESIGN] ──► [BUILD] ──► [OPERATE] ◄────► [MAINTAIN] ──► [RECONSTRUCTION_REPLACEMENT_RETIREMENT]
```

- **Forward Progression**: Exactly one step forward at a time (`PLAN_DESIGN` ➔ `BUILD` ➔ `OPERATE` ➔ `MAINTAIN` ➔ `RECONSTRUCTION_REPLACEMENT_RETIREMENT`). Skipping stages returns `HTTP 400 Bad Request`.
- **Maintenance Loop**: Transition from `MAINTAIN` back to `OPERATE` is explicitly permitted upon verified completion of repair work.
- **Audit Immutability**: Every transition appends a permanent record to the asset's `lifecycleHistory` containing timestamp, actor, description, and budget/cost impact.

### 4. Automated Workflow Side Effects
The system automates operational handoffs between inspections, maintenance, and work orders:

| Trigger Event | Automated Actions Performed by Server |
| :--- | :--- |
| **Inspection Logged**<br>`POST /api/inspections` | 1. Updates asset `condition`, `lastInspection`, and schedules `nextInspection` (+6 months for POOR/CRITICAL, +12 months otherwise).<br>2. Recalculates asset health score.<br>3. **If any defect has `HIGH` severity OR condition is `POOR` / `CRITICAL`:**<br>&nbsp;&nbsp;&nbsp;• Auto-creates a `RECOMMENDED` maintenance record with `URGENT` or `HIGH` priority.<br>&nbsp;&nbsp;&nbsp;• Transitions the asset from `OPERATE` to `MAINTAIN` and logs a lifecycle event. |
| **Work Order Created**<br>`POST /api/work-orders` | 1. Generates sequential human-readable work order number (`WO-YYYY-XXXX`).<br>2. Links to specified maintenance record (or newest `RECOMMENDED` record).<br>3. Automatically updates maintenance record status to `SCHEDULED`. |
| **Work Order In Progress**<br>`PATCH /api/work-orders/:id/status` (`IN_PROGRESS`) | Automatically shifts linked maintenance record status to `IN_PROGRESS`. |
| **Work Order Completed**<br>`PATCH /api/work-orders/:id/status` (`COMPLETED`) | Automatically marks linked maintenance record as `COMPLETED`. |
| **Work Order Closed**<br>`PATCH /api/work-orders/:id/status` (`CLOSED`) | 1. Sets linked maintenance record to `VERIFIED`.<br>2. Improves asset condition by one band (e.g., `CRITICAL` ➔ `POOR` ➔ `FAIR` ➔ `GOOD`).<br>3. Recalculates health score.<br>4. Appends lifecycle completion event and transitions the asset back to `OPERATE`. |

### 5. Multi-Factor Health Score Algorithm
Evaluates infrastructure health on a 0-100 scale using 5 weighted criteria (`src/utils/healthScore.js`):

| Factor | Weight | Evaluation Logic |
| :--- | :---: | :--- |
| **Physical Condition** | **40%** | `GOOD`: 100 pts, `FAIR`: 70 pts, `POOR`: 40 pts, `CRITICAL`: 10 pts |
| **Inspection Freshness** | **20%** | Evaluates days elapsed since last inspection vs. scheduled cycle; penalizes overdue inspections |
| **Age vs. Design Life** | **15%** | Compares active operational age against expected design lifespan |
| **Open Defect Severity** | **15%** | Penalizes active defects based on severity (`HIGH`: -30 pts, `MEDIUM`: -15 pts, `LOW`: -5 pts) |
| **Maintenance Backlog** | **10%** | Compares pending urgent repairs against completed maintenance |

#### Health Bands:
- 🟢 **Healthy (70 - 100)**: Normal operational state.
- 🟡 **Attention Required (40 - 69)**: Deterioration observed; scheduled repair recommended.
- 🔴 **Critical (0 - 39)**: Significant distress; immediate structural intervention required.

> **Statutory Disclaimer**: Returned in every API payload: *"Decision-support indicator only, not a certified engineering safety assessment."*

---

## 📡 REST API Reference

All responses conform to a standard JSON envelope:
```json
{
  "success": true,
  "message": "Descriptive status message",
  "data": { ... },
  "disclaimer": "Decision-support indicator only, not a certified engineering safety assessment."
}
```

### System & Discovery
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Server uptime & status check |
| `GET` | `/api` | API directory & discovery documentation |

### Asset Inventory & Passport
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/assets` | List assets (Filter by: `category`, `type`, `condition`, `stage`, `search`) |
| `POST` | `/api/assets` | Register a new infrastructure asset |
| `GET` | `/api/assets/:id` | Fetch single asset (supports MongoDB `_id` or `assetId` like `RD-AHM-001`) |
| `PUT` | `/api/assets/:id` | Update asset specification & attributes |
| `DELETE` | `/api/assets/:id` | Remove asset from inventory |
| `GET` | `/api/assets/:id/passport` | **Digital Asset Passport** (master dossier, GIS, history) |
| `GET` | `/api/assets/:id/lifecycle` | Get lifecycle stage history and current status |
| `POST` | `/api/assets/:id/lifecycle` | Advance lifecycle stage (validated transition) |

### Inspections & Defect Logging
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/inspections` | List inspection records (with populated asset details) |
| `POST` | `/api/inspections` | Log an inspection (**triggers automated maintenance & stage shifts**) |

### Maintenance Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/maintenance` | List maintenance records |
| `POST` | `/api/maintenance` | Create maintenance record manually |
| `PATCH` | `/api/maintenance/:id/status`| Update maintenance status (`RECOMMENDED`, `SCHEDULED`, `IN_PROGRESS`, `COMPLETED`, `VERIFIED`) |

### Work Orders
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/work-orders` | List work orders |
| `POST` | `/api/work-orders` | Issue work order (links to maintenance, sets status to `SCHEDULED`) |
| `PATCH` | `/api/work-orders/:id/status`| Update status (`OPEN`, `IN_PROGRESS`, `COMPLETED`, `CLOSED` with auto-recovery) |

### Executive & Dashboard Analytics
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats` | Executive KPI dashboard summary & critical alerts |
| `GET` | `/api/executive/summary` | Portfolio-level capital expenditure, risk counts, and budget variances |
| `GET` | `/api/executive/projects` | Project-level inventory with financial, timeline, & risk metrics |
| `GET` | `/api/executive/attention` | List of high-risk projects requiring immediate executive action |
| `GET` | `/api/analytics/conditions` | Condition breakdown overall and grouped by asset category |
| `GET` | `/api/analytics/lifecycle` | Asset count and capital expenditure by lifecycle stage |

### Traffic & Sensor Assets
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/traffic-assets` | Direct query for all smart signals, sensors, and CCTV assets |

---

## 📝 Sample API Payloads

### 1. Log Field Inspection (Triggers Automated Workflow)
`POST /api/inspections`

```json
{
  "asset": "RD-AHM-002",
  "inspector": "S. K. Ramanathan, PWD Executive Engineer",
  "condition": "POOR",
  "defects": [
    {
      "type": "Potholes",
      "severity": "HIGH",
      "description": "Severe edge rutting and asphalt breakups near km 4.2"
    },
    {
      "type": "Drainage Clog",
      "severity": "MEDIUM",
      "description": "Shoulder drain silt accumulation"
    }
  ],
  "remarks": "Immediate pavement resurfacing required before monsoon season."
}
```

**HTTP 201 Response:**
```json
{
  "success": true,
  "message": "Inspection logged and workflow side-effects processed successfully",
  "data": {
    "inspection": {
      "_id": "66a01234567890abcdef01",
      "condition": "POOR",
      "inspector": "S. K. Ramanathan, PWD Executive Engineer"
    },
    "asset": {
      "assetId": "RD-AHM-002",
      "condition": "POOR",
      "lifecycleStage": "MAINTAIN",
      "healthScore": 45,
      "healthBand": "Attention Required"
    },
    "autoCreatedMaintenance": {
      "_id": "66a01234567890abcdef02",
      "type": "Emergency Defect Remediation",
      "priority": "HIGH",
      "status": "RECOMMENDED"
    }
  }
}
```

---

### 2. Issue a Work Order
`POST /api/work-orders`

```json
{
  "asset": "RD-AHM-002",
  "maintenanceRecord": "66a01234567890abcdef02",
  "contractor": "Larsen & Toubro Pavement Infra Ltd.",
  "contractorContact": "+91-98765-43210",
  "assignedEngineer": "M. K. Patel (Assistant Engineer)",
  "scopeOfWork": "Milling of 50mm bitumen surface and overlaying 60mm BC asphalt mix.",
  "estimatedCost": 1850000,
  "startDate": "2026-10-01",
  "targetCompletionDate": "2026-10-15"
}
```

---

### 3. Advance Lifecycle Stage
`POST /api/assets/RD-AHM-001/lifecycle`

```json
{
  "targetStage": "BUILD",
  "actor": "Chief Project Officer, GSRDC",
  "description": "Environmental clearance and DPR approved; commencing civil works.",
  "cost": 45000000
}
```

---

## 🧪 Automated Verification & Testing

The server includes a standalone end-to-end API test script that validates the primary business workflows:
- Digital Asset Passport retrieval
- Dual asset identification (Mongo `_id` and natural `assetId`)
- Stage transition constraint validation
- Inspection logging with automated maintenance & stage shifts
- Work order issuance & automatic status synchronization
- Dashboard and executive analytics endpoints

To run the verification suite:
```bash
# Ensure server is running on http://localhost:5000
node test_api.js
```

---

## ❓ Troubleshooting & FAQs

### 1. MongoDB Connection Failed (`MongooseServerSelectionError`)
- **Cause**: MongoDB is not running or the URI in `.env` is incorrect.
- **Solution**: Ensure your MongoDB daemon is active (`mongod` or MongoDB Windows Service). If using MongoDB Atlas, verify IP whitelisting and check credentials in `MONGO_URI`.

### 2. Port Conflict (`EADDRINUSE: address already in use :::5000`)
- **Cause**: Another process is occupying port 5000.
- **Solution**: Change `PORT=5001` in `.env` (and update frontend API client base URL) or terminate the occupying process:
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
  ```

### 3. CORS Error in Browser
- **Cause**: The frontend client URL does not match `CLIENT_URL` in `.env`.
- **Solution**: In `server/.env`, ensure `CLIENT_URL=http://localhost:5173` matches your Vite development server port.

### 4. Database Resetting
- **Cause**: Running `npm run seed` drops existing collections to ensure idempotent, consistent demo data.
- **Solution**: Only execute `npm run seed` when initializing the environment or when resetting test data.
