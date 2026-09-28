# Fullstack Infrastructure Asset Management Platform

A modern, fullstack system for managing infrastructure assets, tracking lifecycle stages, scheduling inspections, monitoring health scores, and organizing maintenance work orders.

## Project Structure

```text
my-fullstack-app/
├── client/                              # React frontend (Vite)
│   ├── public/                          # Favicon, SVG logos
│   ├── src/
│   │   ├── assets/                      # global.css (CSS variables, theme), logo
│   │   ├── components/
│   │   │   ├── common/                  # Sidebar, Header, Footer, KpiCard, StatusBadge,
│   │   │   │                            # ConditionBadge, HealthScore, ConfirmModal,
│   │   │   │                            # EmptyState, LoadingState, ErrorState
│   │   │   ├── dashboard/               # ConditionChart, LifecycleChart, PriorityChart,
│   │   │   │                            # RecentEvents, CriticalAssetList
│   │   │   ├── assets/                  # AssetTable, AssetFilter, AssetForm
│   │   │   ├── lifecycle/               # LifecycleTimeline, LifecycleHistory, AdvanceStageForm
│   │   │   ├── maintenance/             # InspectionTable, InspectionForm, MaintenanceTable,
│   │   │   │                            # WorkOrderTable, WorkOrderModal
│   │   │   └── map/                     # AssetMap
│   │   ├── context/                     # FilterContext
│   │   ├── hooks/                       # useFetch.js
│   │   ├── pages/                       # Dashboard, AssetRegistry, InfrastructureMap,
│   │   │                                # AssetPassport, Inspections, MaintenanceWorkOrders,
│   │   │                                # LifecyclePage, TrafficControl, Analytics, Settings
│   │   ├── services/                    # api.js, assetService.js, inspectionService.js,
│   │   │                                # maintenanceService.js, workOrderService.js,
│   │   │                                # dashboardService.js
│   │   ├── utils/                       # constants.js, formatters.js
│   │   ├── App.jsx                      # Routes + Layout
│   │   └── main.jsx
│   ├── .env.local                       # VITE_API_URL=http://localhost:5000/api
│   ├── package.json
│   └── vite.config.js
│
├── server/                              # Node.js + Express backend
│   ├── src/
│   │   ├── config/                      # db.js (Mongo connection)
│   │   ├── controllers/                 # Asset, Inspection, Maintenance, WorkOrder,
│   │   │                                # Dashboard, Analytics controllers
│   │   ├── middleware/                  # errorHandler.js, notFound.js, validate.js
│   │   ├── models/                      # Asset.js, Inspection.js, MaintenanceRecord.js, WorkOrder.js
│   │   ├── routes/                      # index.js + resource routes
│   │   ├── services/                    # lifecycle.service.js, workflow.service.js,
│   │   │                                # dashboard.service.js (business rules)
│   │   ├── utils/                       # healthScore.js, ApiError.js, asyncHandler.js,
│   │   │                                # response.js, constants.js
│   │   ├── seed/                        # seed.js, data.js
│   │   ├── app.js                       # Express setup
│   │   └── server.js                    # DB connect + listen
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
└── README.md
```

## Getting Started

### 1. Server Setup
```bash
cd server
npm install
npm run seed     # Seeds demo assets, inspections & work orders
npm run dev      # Runs Express on port 5000
```

### 2. Client Setup
```bash
cd ../client
npm install
npm run dev      # Runs Vite React app on port 5173
```
