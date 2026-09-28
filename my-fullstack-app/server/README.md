# Government Road & Infrastructure Asset Lifecycle Management System - Backend

Production-ready backend API for the 5-hour hackathon MVP, implementing the **Digital Asset Passport**, automated lifecycle stage transitions, workflow trigger side-effects, dynamic multi-factor health score computation, and executive infrastructure analytics.

---

## 🚀 Quick Setup & Execution

### 1. Environment Variables
The `.env` file is already preconfigured in `server/.env`. A reference template is provided in `server/.env.example`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=<mongodb_connection_string>
CLIENT_URL=http://localhost:5173
```

### 2. Install Dependencies
```bash
cd server
npm install
```

### 3. Seed Database (Idempotent)
Populates realistic Ahmedabad infrastructure assets (SG Highway, Ring Road, River Bridge, Culverts, Underpasses, Traffic Signals, CCTV Cameras) across all five lifecycle stages, all four condition bands, defect logs, maintenance records, and work orders:
```bash
npm run seed
```

### 4. Run Server
- **Development mode (with nodemon):**
  ```bash
  npm run dev
  ```
- **Production mode:**
  ```bash
  npm start
  ```

- **Base URL:** `http://localhost:5000/api`
- **Health Check:** `http://localhost:5000/health`

---

## 🏛️ Architecture & Core Concepts

### 1. Flow of Execution
```
Request -> Route -> Controller -> Service -> Model -> MongoDB
```
- **Controllers** handle HTTP parameters, query filtering, and standardized JSON formatting.
- **Services** (`lifecycle.service.js`, `workflow.service.js`, `dashboard.service.js`) encapsulate core business rules and automated side-effects.
- **Models** (`Asset`, `Inspection`, `MaintenanceRecord`, `WorkOrder`) maintain schema constraints and relationships.

### 2. Digital Asset Passport
The endpoint `GET /api/assets/:id/passport` returns a consolidated master dossier:
- Core asset specifications, GIS coordinates, and road path polylines.
- Lifecycle stage status and append-only stage history.
- Inspection records and defect logs.
- Maintenance records and contractor logs.
- Active and completed work orders.
- Archival documentation references (DPR, Design Drawings, Quality Certificates, Inspection Reports).
- **Merged Chronological History**: unified timeline combining lifecycle transitions, field inspections, maintenance actions, and work order events sorted newest-first.

### 3. Lifecycle Transition Engine (`lifecycle.service.js`)
Stages: `PLAN_DESIGN` -> `BUILD` -> `OPERATE` -> `MAINTAIN` -> `RECONSTRUCTION_REPLACEMENT_RETIREMENT`.
- **Forward Progression**: Exactly one step forward at a time.
- **Maintenance Return**: `MAINTAIN` -> `OPERATE` is explicitly permitted upon completed repairs.
- **Constraint Enforcement**: Any invalid or skipping transitions immediately return HTTP 400.
- **Append-only History**: Past lifecycle events are immutable; every transition appends an event with timestamp, actor, description, and cost.

### 4. Automated Workflow Side-Effects (`workflow.service.js`)
1. **POST `/api/inspections`**:
   - Updates asset `condition`, `lastInspection`, and `nextInspection` (+6 months if POOR/CRITICAL, +12 months otherwise).
   - Recalculates health score.
   - If any defect has `HIGH` severity OR condition is `POOR` / `CRITICAL`:
     - Automatically creates a `RECOMMENDED` `MaintenanceRecord`.
     - Automatically shifts asset from `OPERATE` to `MAINTAIN` and logs a lifecycle event.
2. **POST `/api/work-orders`**:
   - Generates sequential year-based `woNumber` (e.g. `WO-2026-0001`).
   - Automatically links to specified maintenance record or latest `RECOMMENDED` record and updates its status to `SCHEDULED`.
3. **PATCH `/api/work-orders/:id/status`**:
   - `IN_PROGRESS`: Sets linked maintenance record to `IN_PROGRESS`.
   - `COMPLETED`: Sets linked maintenance record to `COMPLETED`.
   - `CLOSED`: Sets linked maintenance record to `VERIFIED`, improves asset condition by one rank (e.g. POOR -> FAIR), recalculates health score, logs a lifecycle event, and transitions the asset back to `OPERATE`.

### 5. Multi-Factor Health Score Algorithm (`utils/healthScore.js`)
Weighted configuration:
- **Condition (40%)**: GOOD (100), FAIR (70), POOR (40), CRITICAL (10).
- **Inspection Freshness (20%)**: Evaluates time since last inspection and overdue status.
- **Age vs. Design Life (15%)**: Tracks operational wear against design life expectancy.
- **Open Defects (15%)**: Evaluates active defect severities (HIGH, MEDIUM, LOW).
- **Maintenance History (10%)**: Measures unresolved urgent issues vs. completed repairs.
- **Health Bands**: `Healthy` (70-100), `Attention Required` (40-69), `Critical` (0-39).
- **Legal Disclaimer Attached**: *"Decision-support indicator only, not a certified engineering safety assessment."*

---

## 📡 API Reference & Sample Requests

### Standard API Envelope
All responses return a standardized JSON structure:
```json
{
  "success": true,
  "message": "Descriptive message",
  "data": { ... },
  "disclaimer": "Decision-support indicator only, not a certified engineering safety assessment."
}
```

### Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/assets` | List all assets (supports filters: `category`, `type`, `condition`, `stage`, `search`) |
| `POST` | `/api/assets` | Register new asset in inventory |
| `GET` | `/api/assets/:id` | Fetch single asset (accepts Mongo `_id` or `assetId` like `RD-AHM-001`) |
| `PUT` | `/api/assets/:id` | Update asset attributes |
| `DELETE` | `/api/assets/:id` | Remove asset |
| `GET` | `/api/assets/:id/lifecycle` | Get lifecycle history and current stage |
| `POST` | `/api/assets/:id/lifecycle` | Advance lifecycle stage (validated transition) |
| `GET` | `/api/assets/:id/passport` | Retrieve comprehensive Digital Asset Passport |
| `GET` | `/api/inspections` | Global list of inspections (populated with asset details) |
| `POST` | `/api/inspections` | Log inspection (triggers automated maintenance & stage shift) |
| `GET` | `/api/maintenance` | Global list of maintenance records |
| `POST` | `/api/maintenance` | Create maintenance record |
| `PATCH` | `/api/maintenance/:id/status`| Update maintenance status (`RECOMMENDED`, `SCHEDULED`, `IN_PROGRESS`, `COMPLETED`, `VERIFIED`) |
| `GET` | `/api/work-orders` | Global list of work orders |
| `POST` | `/api/work-orders` | Create work order (links to maintenance, updates status to `SCHEDULED`) |
| `PATCH` | `/api/work-orders/:id/status`| Update work order status (`OPEN`, `IN_PROGRESS`, `COMPLETED`, `CLOSED` with side effects) |
| `GET` | `/api/dashboard/stats` | Executive KPI dashboard metrics |
| `GET` | `/api/analytics/conditions` | Condition distributions overall and by asset category |
| `GET` | `/api/analytics/lifecycle` | Stage breakdown and asset capital investment |
| `GET` | `/api/traffic-assets` | Direct query for all smart traffic & sensor assets |

---

## 📝 Sample Requests & Responses

### 1. Digital Asset Passport
`GET /api/assets/RD-AHM-001/passport`

**Response (truncated):**
```json
{
  "success": true,
  "message": "Asset Passport retrieved successfully",
  "data": {
    "asset": {
      "assetId": "RD-AHM-001",
      "category": "ROAD",
      "type": "Highway",
      "name": "SG Highway Section 01",
      "lifecycleStage": "MAINTAIN",
      "condition": "FAIR",
      "healthScore": 72,
      "healthBand": "Healthy",
      "location": {
        "address": "Sarkhej-Gandhinagar Highway, km 0.0 to 8.5, Ahmedabad",
        "lat": 23.0338,
        "lng": 72.5125,
        "path": [[23.0035, 72.502], [23.0338, 72.5125], [23.0655, 72.528], [23.1142, 72.5392]]
      }
    },
    "inspections": [ ... ],
    "maintenance": [ ... ],
    "workOrders": [ ... ],
    "documents": [ ... ],
    "mergedChronologicalHistory": [
      {
        "eventType": "MAINTENANCE",
        "date": "2025-08-15T00:00:00.000Z",
        "title": "Maintenance: Asphalt Milling & Pothole Remediation [RECOMMENDED]",
        "description": "Full width cold milling and hot mix asphalt patching for heavy rutted sections",
        "actor": "GSRDC Division Fleet",
        "cost": 1250000
      },
      {
        "eventType": "LIFECYCLE_STAGE_CHANGE",
        "date": "2025-08-01T00:00:00.000Z",
        "title": "Stage: MAINTAIN",
        "description": "Transitioned to MAINTAIN for pavement milling, resurfacing, and shoulder fortification",
        "actor": "Assistant Engineer (Maintenance)",
        "cost": 2500000
      }
    ]
  },
  "disclaimer": "Decision-support indicator only, not a certified engineering safety assessment."
}
```

### 2. Log Inspection with HIGH Defect (Triggers Workflow)
`POST /api/inspections`
```json
{
  "asset": "RD-AHM-002",
  "inspector": "S. K. Ramanathan, PWD",
  "condition": "POOR",
  "defects": [
    { "type": "Potholes", "severity": "HIGH" },
    { "type": "Rutting", "severity": "MEDIUM" }
  ],
  "remarks": "Subgrade deformation observed after torrential downpour"
}
```

**Response (HTTP 201):**
```json
{
  "success": true,
  "message": "Inspection logged and workflow side-effects processed successfully",
  "data": {
    "inspection": {
      "inspector": "S. K. Ramanathan, PWD",
      "condition": "POOR",
      "defects": [ ... ]
    },
    "asset": {
      "assetId": "RD-AHM-002",
      "condition": "POOR",
      "lifecycleStage": "MAINTAIN",
      "healthScore": 47,
      "healthBand": "Attention Required"
    },
    "autoCreatedMaintenance": {
      "type": "Emergency Defect Remediation",
      "priority": "HIGH",
      "status": "RECOMMENDED"
    }
  }
}
```

### 3. Executive Dashboard Statistics
`GET /api/dashboard/stats`

**Response:**
```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "totals": 10,
    "roads": 4,
    "structures": 4,
    "traffic": 2,
    "critical": 1,
    "maintenanceDue": 2,
    "overdueInspections": 5,
    "estimatedMaintenanceCost": 4750000,
    "perStage": {
      "PLAN_DESIGN": 1,
      "BUILD": 1,
      "OPERATE": 6,
      "MAINTAIN": 1,
      "RECONSTRUCTION_REPLACEMENT_RETIREMENT": 1
    },
    "perCondition": {
      "GOOD": 6,
      "FAIR": 2,
      "POOR": 1,
      "CRITICAL": 1
    },
    "priorityCounts": {
      "LOW": 0,
      "MEDIUM": 0,
      "HIGH": 1,
      "URGENT": 1
    },
    "recentLifecycleEvents": [ ... ],
    "criticalAssets": [
      {
        "assetId": "BR-AHM-001",
        "name": "River Bridge East",
        "category": "STRUCTURE",
        "type": "Bridge",
        "condition": "CRITICAL",
        "healthScore": 25,
        "location": {
          "address": "Sabarmati River Crossing near Subhash Bridge, Ahmedabad",
          "lat": 23.0276,
          "lng": 72.5788
        }
      }
    ]
  }
}
```

---

## 📌 Engineering Assumptions & Design Decisions
1. **Dual Asset Identification**: All asset-specific endpoints (`/assets/:id`, `/assets/:id/passport`, `/assets/:id/lifecycle`) accept either the MongoDB `_id` or the human-readable `assetId` (e.g. `RD-AHM-001`).
2. **Defect-Driven Maintenance**: When an inspection reports any `HIGH` severity defect or an overall condition of `POOR` or `CRITICAL`, the system auto-creates a `RECOMMENDED` maintenance record with `URGENT` or `HIGH` priority and shifts the asset to `MAINTAIN` if it was in `OPERATE`.
3. **Condition Improvement on Work Order Closure**: When a work order transitions to `CLOSED`, linked maintenance is marked `VERIFIED`, and the asset condition improves by one level (e.g. `CRITICAL` -> `POOR`, `POOR` -> `FAIR`, `FAIR` -> `GOOD`), returning the asset from `MAINTAIN` back to `OPERATE`.
4. **GIS Polylines for Roads**: Road assets store multi-point coordinate arrays in `location.path` representing real Ahmedabad corridor paths (SG Highway, SP Ring Road, Airport Road), while point structures (bridges, signals, culverts) store focal `lat`/`lng`.
5. **Idempotent Seeding**: `npm run seed` drops existing collections prior to insertion, guaranteeing clean re-runs without duplicate key conflicts.
