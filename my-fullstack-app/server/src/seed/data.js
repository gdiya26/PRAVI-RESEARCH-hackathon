const { calculateHealthScore } = require('../utils/healthScore');

// Current reference year: 2026
const seedAssets = [
  // -------------------------------------------------------------
  // ROADS
  // -------------------------------------------------------------
  {
    assetId: 'RD-AHM-001',
    category: 'ROAD',
    type: 'Highway',
    name: 'SG Highway Section 01',
    location: {
      address: 'Sarkhej-Gandhinagar Highway, km 0.0 to 8.5, Ahmedabad',
      lat: 23.0338,
      lng: 72.5125,
      path: [
        [23.0035, 72.502],
        [23.0338, 72.5125],
        [23.0655, 72.528],
        [23.1142, 72.5392]
      ]
    },
    lifecycleStage: 'MAINTAIN',
    condition: 'FAIR',
    status: 'ACTIVE',
    constructionYear: 2018,
    designLife: 25,
    estimatedCost: 85000000,
    actualCost: 91000000,
    department: 'Gujarat State Road Development Corporation (GSRDC)',
    contractor: 'L&T Infrastructure Ltd.',
    lastInspection: new Date('2025-07-20'),
    nextInspection: new Date('2026-07-20'),
    specs: {
      length: 8.5,
      lanes: 6,
      pavementType: 'Flexible Bituminous Concrete',
      start: 'Sarkhej Junction',
      end: 'Thaltej Cross Road'
    },
    documents: [
      {
        type: 'DPR',
        name: 'Detailed Project Report SG-Highway-Sec01.pdf',
        ref: 'DOC-DPR-2018-091',
        date: new Date('2018-04-12')
      },
      {
        type: 'Design Drawing',
        name: 'Geometric Alignment & Cross Section Plans.dwg',
        ref: 'DOC-DWG-2018-112',
        date: new Date('2018-06-19')
      },
      {
        type: 'Work Order',
        name: 'Initial Construction Tender Work Order.pdf',
        ref: 'DOC-WO-2019-004',
        date: new Date('2019-01-10')
      },
      {
        type: 'Quality Certificate',
        name: 'Bitumen Mix & Compaction Quality Certification.pdf',
        ref: 'DOC-QC-2021-301',
        date: new Date('2021-02-15')
      },
      {
        type: 'Completion Certificate',
        name: 'Final Handover & Commercial Commissioning Certificate.pdf',
        ref: 'DOC-CC-2021-502',
        date: new Date('2021-04-01')
      },
      {
        type: 'Inspection Report',
        name: 'Post-Monsoon Pavement Condition Index Audit.pdf',
        ref: 'DOC-INSP-2025-881',
        date: new Date('2025-08-10')
      }
    ],
    lifecycleHistory: [
      {
        stage: 'PLAN_DESIGN',
        date: new Date('2018-03-01'),
        description: 'Detailed feasibility study and 6-lane geometric expansion design finalized',
        by: 'Chief Planning Engineer, GSRDC',
        cost: 3500000,
        docRef: 'DOC-DPR-2018-091'
      },
      {
        stage: 'BUILD',
        date: new Date('2019-02-15'),
        description: 'Construction commenced by EPC contractor following land acquisition clearance',
        by: 'L&T Infrastructure Project Director',
        cost: 87500000,
        docRef: 'DOC-WO-2019-004'
      },
      {
        stage: 'OPERATE',
        date: new Date('2021-04-10'),
        description: 'Corridor opened to commercial freight and passenger traffic following safety audit',
        by: 'Executive Engineer, Ahmedabad Division',
        cost: 0,
        docRef: 'DOC-CC-2021-502'
      },
      {
        stage: 'MAINTAIN',
        date: new Date('2025-08-01'),
        description: 'Transitioned to MAINTAIN for pavement milling, resurfacing, and shoulder fortification',
        by: 'Assistant Engineer (Maintenance)',
        cost: 2500000,
        docRef: 'DOC-INSP-2025-881'
      }
    ]
  },
  {
    assetId: 'RD-AHM-002',
    category: 'ROAD',
    type: 'Highway',
    name: 'Ring Road Section 03',
    location: {
      address: 'S.P. Ring Road Western Arc, Science City stretch, Ahmedabad',
      lat: 23.0905,
      lng: 72.495,
      path: [
        [23.0722, 72.4815],
        [23.0905, 72.495],
        [23.115, 72.512]
      ]
    },
    lifecycleStage: 'OPERATE',
    condition: 'GOOD',
    status: 'ACTIVE',
    constructionYear: 2020,
    designLife: 30,
    estimatedCost: 110000000,
    actualCost: 108000000,
    department: 'Ahmedabad Urban Development Authority (AUDA)',
    contractor: 'Sadbhav Engineering Ltd.',
    lastInspection: new Date('2025-11-10'),
    nextInspection: new Date('2026-11-10'),
    specs: {
      length: 12.0,
      lanes: 4,
      pavementType: 'Stone Matrix Asphalt',
      start: 'Bopal Junction',
      end: 'Ognaj Circle'
    },
    documents: [
      {
        type: 'DPR',
        name: 'SP-Ring-Road-Sec03-DPR.pdf',
        ref: 'DOC-AUDA-2019-04',
        date: new Date('2019-05-10')
      }
    ],
    lifecycleHistory: [
      {
        stage: 'PLAN_DESIGN',
        date: new Date('2019-06-01'),
        description: 'Ring road outer alignment designed for high-speed perimeter movement',
        by: 'AUDA Chief Town Planner',
        cost: 2800000
      },
      {
        stage: 'BUILD',
        date: new Date('2020-01-15'),
        description: 'Pavement paving and median installation completed',
        by: 'Sadbhav Project Manager',
        cost: 105200000
      },
      {
        stage: 'OPERATE',
        date: new Date('2021-08-20'),
        description: 'Commissioned for ring corridor vehicular traffic',
        by: 'AUDA Traffic Wing',
        cost: 0
      }
    ]
  },
  {
    assetId: 'RD-AHM-003',
    category: 'ROAD',
    type: 'Arterial Road',
    name: 'Airport Road Section 02',
    location: {
      address: 'Hansol to Sardar Vallabhbhai Patel International Airport, Ahmedabad',
      lat: 23.068,
      lng: 72.618,
      path: [
        [23.055, 72.605],
        [23.068, 72.618],
        [23.0772, 72.6289]
      ]
    },
    lifecycleStage: 'BUILD',
    condition: 'GOOD',
    status: 'UNDER_CONSTRUCTION',
    constructionYear: 2025,
    designLife: 20,
    estimatedCost: 45000000,
    actualCost: 32000000,
    department: 'Roads & Buildings Dept (R&B)',
    contractor: 'Dilip Buildcon',
    lastInspection: null,
    nextInspection: new Date('2026-06-01'),
    specs: {
      length: 4.2,
      lanes: 4,
      pavementType: 'Rigid Concrete Pavement',
      start: 'Indira Bridge Circle',
      end: 'Domestic Terminal T1'
    },
    documents: [
      {
        type: 'DPR',
        name: 'Airport-Corridor-Modernization-DPR.pdf',
        ref: 'DOC-RBD-2024-71',
        date: new Date('2024-03-01')
      }
    ],
    lifecycleHistory: [
      {
        stage: 'PLAN_DESIGN',
        date: new Date('2024-04-10'),
        description: 'Airport rapid transit approach road planning and geometric profile approved',
        by: 'State Highway Authority',
        cost: 1500000
      },
      {
        stage: 'BUILD',
        date: new Date('2025-02-01'),
        description: 'Sub-base grading and concrete pavement casting in active progress (68% complete)',
        by: 'Dilip Buildcon Resident Engineer',
        cost: 30500000
      }
    ]
  },
  {
    assetId: 'RD-AHM-004',
    category: 'ROAD',
    type: 'Arterial Road',
    name: 'Urban Arterial Section 07',
    location: {
      address: 'Drive-In Road to Memnagar link, Ahmedabad',
      lat: 23.027,
      lng: 72.559,
      path: [
        [23.015, 72.552],
        [23.027, 72.559],
        [23.038, 72.568]
      ]
    },
    lifecycleStage: 'PLAN_DESIGN',
    condition: 'GOOD',
    status: 'PROPOSED',
    constructionYear: null,
    designLife: 25,
    estimatedCost: 38000000,
    actualCost: 1200000,
    department: 'Ahmedabad Municipal Corporation (AMC)',
    contractor: 'Consultant Consortium',
    lastInspection: null,
    nextInspection: new Date('2026-10-01'),
    specs: {
      length: 3.1,
      lanes: 4,
      pavementType: 'High Durability Bitumen',
      start: 'Drive-In Cinema Junction',
      end: 'Subhash Chowk'
    },
    documents: [
      {
        type: 'DPR',
        name: 'Urban-Arterial-07-Feasibility.pdf',
        ref: 'DOC-AMC-2025-01',
        date: new Date('2025-09-12')
      }
    ],
    lifecycleHistory: [
      {
        stage: 'PLAN_DESIGN',
        date: new Date('2025-10-01'),
        description: 'Alignment proposal, traffic load projections, and utility shifting survey drafted',
        by: 'AMC Planning Division',
        cost: 1200000
      }
    ]
  },

  // -------------------------------------------------------------
  // STRUCTURES
  // -------------------------------------------------------------
  {
    assetId: 'BR-AHM-001',
    category: 'STRUCTURE',
    type: 'Bridge',
    name: 'River Bridge East',
    location: {
      address: 'Sabarmati River Crossing near Subhash Bridge, Ahmedabad',
      lat: 23.0276,
      lng: 72.5788,
      path: []
    },
    lifecycleStage: 'OPERATE',
    condition: 'CRITICAL',
    status: 'ACTIVE_WARNING',
    constructionYear: 1988,
    designLife: 50,
    estimatedCost: 140000000,
    actualCost: 135000000,
    department: 'Ahmedabad Municipal Corporation - Bridges Dept',
    contractor: 'Hindustan Construction Co.',
    lastInspection: new Date('2025-01-10'),
    nextInspection: new Date('2025-07-10'), // OVERDUE inspection #1
    specs: {
      length: 480,
      width: 18.5,
      structureType: 'Pre-stressed Concrete Girder with RCC Piers',
      loadRestriction: 'Max 25 tonnes, speed limit 30 km/h'
    },
    documents: [
      {
        type: 'DPR',
        name: 'River-Bridge-Original-Structural-Report.pdf',
        ref: 'DOC-AMC-BR-1986',
        date: new Date('1986-05-15')
      },
      {
        type: 'Inspection Report',
        name: 'NDT-Structural-Integrity-Audit-2025.pdf',
        ref: 'DOC-NDT-2025-01',
        date: new Date('2025-01-10')
      }
    ],
    lifecycleHistory: [
      {
        stage: 'PLAN_DESIGN',
        date: new Date('1986-06-01'),
        description: 'Multi-span river crossing bridge engineered for eastern arterial connectivity',
        by: 'State Structural Board',
        cost: 2500000
      },
      {
        stage: 'BUILD',
        date: new Date('1987-01-10'),
        description: 'Substructure piling, piers, and superstructure girder launching completed',
        by: 'Hindustan Construction Co.',
        cost: 132500000
      },
      {
        stage: 'OPERATE',
        date: new Date('1988-12-15'),
        description: 'Bridge commissioned for dual carriageway traffic crossing Sabarmati River',
        by: 'Municipal Commissioner, AMC',
        cost: 0
      }
    ]
  },
  {
    assetId: 'BR-AHM-002',
    category: 'STRUCTURE',
    type: 'Flyover',
    name: 'Highway Flyover',
    location: {
      address: 'ISKCON Cross Road Flyover, SG Highway, Ahmedabad',
      lat: 23.0285,
      lng: 72.5065,
      path: []
    },
    lifecycleStage: 'OPERATE',
    condition: 'GOOD',
    status: 'ACTIVE',
    constructionYear: 2017,
    designLife: 50,
    estimatedCost: 65000000,
    actualCost: 68000000,
    department: 'GSRDC Infrastructure Division',
    contractor: 'JMC Projects Ltd.',
    lastInspection: new Date('2025-10-18'),
    nextInspection: new Date('2026-10-18'),
    specs: {
      length: 1250,
      width: 17.2,
      structureType: 'Segmental Box Girder Flyover',
      loadRestriction: 'Standard Class 70R loading'
    },
    documents: [
      {
        type: 'Completion Certificate',
        name: 'Flyover-Commissioning-Certificate.pdf',
        ref: 'DOC-FL-2017-CC',
        date: new Date('2017-11-01')
      }
    ],
    lifecycleHistory: [
      {
        stage: 'PLAN_DESIGN',
        date: new Date('2016-01-15'),
        description: 'Grade separator flyover designed to de-bottleneck ISKCON crossing',
        by: 'GSRDC Engineering Cell',
        cost: 1800000
      },
      {
        stage: 'BUILD',
        date: new Date('2016-08-01'),
        description: 'Pier casting and box-girder segment erection completed',
        by: 'JMC Projects Ltd.',
        cost: 66200000
      },
      {
        stage: 'OPERATE',
        date: new Date('2017-10-25'),
        description: 'Flyover operationalized for non-stop SG highway movement',
        by: 'GSRDC Superintending Engineer',
        cost: 0
      }
    ]
  },
  {
    assetId: 'CV-AHM-001',
    category: 'STRUCTURE',
    type: 'Culvert',
    name: 'Highway Culvert 01',
    location: {
      address: 'S.P. Ring Road km 14.2 drainage discharge point, Ahmedabad',
      lat: 23.085,
      lng: 72.491,
      path: []
    },
    lifecycleStage: 'RECONSTRUCTION_REPLACEMENT_RETIREMENT',
    condition: 'POOR',
    status: 'RETIREMENT_SLATED',
    constructionYear: 1985,
    designLife: 30, // Exceeded design life
    estimatedCost: 12000000,
    actualCost: 11500000,
    department: 'Irrigation & Drainage Dept',
    contractor: 'Local Works Bureau',
    lastInspection: new Date('2025-09-05'),
    nextInspection: new Date('2026-03-05'),
    specs: {
      length: 35,
      width: 6.5,
      structureType: 'Stone Masonry Box Culvert',
      loadRestriction: 'Restricted heavy axle vehicles'
    },
    documents: [
      {
        type: 'Inspection Report',
        name: 'Decommissioning-Recommendation-Audit.pdf',
        ref: 'DOC-CUL-2025-DEC',
        date: new Date('2025-09-10')
      }
    ],
    lifecycleHistory: [
      {
        stage: 'PLAN_DESIGN',
        date: new Date('1984-02-01'),
        description: 'Original monsoon drainage bypass box culvert designed',
        by: 'State Irrigation Cell',
        cost: 450000
      },
      {
        stage: 'BUILD',
        date: new Date('1984-09-01'),
        description: 'Masonry wing walls and slab construction executed',
        by: 'Local Works Bureau',
        cost: 11050000
      },
      {
        stage: 'OPERATE',
        date: new Date('1985-06-15'),
        description: 'Brought online for drainage and storm runoff',
        by: 'Irrigation Officer',
        cost: 0
      },
      {
        stage: 'MAINTAIN',
        date: new Date('2022-04-10'),
        description: 'Headwall reinforcement and silt desilting completed',
        by: 'Maintenance Sub-division',
        cost: 850000
      },
      {
        stage: 'RECONSTRUCTION_REPLACEMENT_RETIREMENT',
        date: new Date('2025-10-15'),
        description: 'Slated for complete reconstruction and replacement with a modern 12m twin-cell RCC box structure',
        by: 'Chief Engineer, Infrastructure Renewal Board',
        cost: 15000000
      }
    ]
  },
  {
    assetId: 'UP-AHM-001',
    category: 'STRUCTURE',
    type: 'Underpass',
    name: 'Central Underpass',
    location: {
      address: 'Akhbarnagar Railway Crossing Underpass, Ahmedabad',
      lat: 23.0588,
      lng: 72.5592,
      path: []
    },
    lifecycleStage: 'OPERATE',
    condition: 'FAIR',
    status: 'ACTIVE',
    constructionYear: 2010,
    designLife: 40,
    estimatedCost: 52000000,
    actualCost: 54000000,
    department: 'Ahmedabad Municipal Corporation',
    contractor: 'Patel Engineering',
    lastInspection: new Date('2025-05-12'),
    nextInspection: new Date('2025-11-12'), // OVERDUE inspection #2
    specs: {
      length: 320,
      width: 14.0,
      structureType: 'Reinforced Concrete U-Trough Underpass',
      loadRestriction: 'Max height clearance 4.5m'
    },
    documents: [
      {
        type: 'Completion Certificate',
        name: 'Underpass-Commissioning-DOC.pdf',
        ref: 'DOC-UP-2010-01',
        date: new Date('2010-08-15')
      }
    ],
    lifecycleHistory: [
      {
        stage: 'PLAN_DESIGN',
        date: new Date('2008-04-15'),
        description: 'Railway level crossing replacement underpass blueprint finalized',
        by: 'AMC Urban Infrastructure Cell',
        cost: 1200000
      },
      {
        stage: 'BUILD',
        date: new Date('2009-01-20'),
        description: 'Diaphragm wall construction, box jacking under railway lines completed',
        by: 'Patel Engineering',
        cost: 52800000
      },
      {
        stage: 'OPERATE',
        date: new Date('2010-08-01'),
        description: 'Underpass inaugurated eliminating railway crossing delays',
        by: 'Mayor & Municipal Commissioner',
        cost: 0
      }
    ]
  },

  // -------------------------------------------------------------
  // TRAFFIC ASSETS
  // -------------------------------------------------------------
  {
    assetId: 'TS-AHM-001',
    category: 'TRAFFIC',
    type: 'Traffic Signal',
    name: 'Junction Traffic Signal 01',
    location: {
      address: 'Shivranjani Cross Road Junction, Satellite, Ahmedabad',
      lat: 23.0238,
      lng: 72.5312,
      path: []
    },
    lifecycleStage: 'OPERATE',
    condition: 'GOOD',
    status: 'ACTIVE',
    constructionYear: 2022,
    designLife: 10,
    estimatedCost: 3500000,
    actualCost: 3400000,
    department: 'Ahmedabad Traffic Police & Smart City Ltd.',
    contractor: 'Siemens Mobility India',
    lastInspection: new Date('2025-12-05'),
    nextInspection: new Date('2026-12-05'),
    specs: {
      model: 'Siemens Sitraffic sX Adaptive Traffic Controller',
      installDate: new Date('2022-03-15')
    },
    documents: [
      {
        type: 'Quality Certificate',
        name: 'Signal-Controller-ISO-Calibration.pdf',
        ref: 'DOC-SIG-2022-QC',
        date: new Date('2022-03-20')
      }
    ],
    lifecycleHistory: [
      {
        stage: 'PLAN_DESIGN',
        date: new Date('2021-08-10'),
        description: 'Adaptive traffic signalization design with inductive loop detector integration',
        by: 'Smart City Mobility Wing',
        cost: 250000
      },
      {
        stage: 'BUILD',
        date: new Date('2022-01-05'),
        description: 'Gantry installation, LED aspect heads, and controller cabinet wiring',
        by: 'Siemens Mobility',
        cost: 3150000
      },
      {
        stage: 'OPERATE',
        date: new Date('2022-03-15'),
        description: 'Linked to Integrated Command and Control Centre (ICCC)',
        by: 'DCP Traffic Ahmedabad',
        cost: 0
      }
    ]
  },
  {
    assetId: 'CCTV-AHM-001',
    category: 'TRAFFIC',
    type: 'CCTV Camera',
    name: 'Highway CCTV 01',
    location: {
      address: 'Pakwan Cross Road Gantry, SG Highway, Ahmedabad',
      lat: 23.0375,
      lng: 72.5118,
      path: []
    },
    lifecycleStage: 'OPERATE',
    condition: 'GOOD',
    status: 'ACTIVE',
    constructionYear: 2023,
    designLife: 8,
    estimatedCost: 1800000,
    actualCost: 1750000,
    department: 'Gujarat Police Surveillance Grid',
    contractor: 'Honeywell Security Solutions',
    lastInspection: new Date('2026-01-15'),
    nextInspection: new Date('2027-01-15'),
    specs: {
      model: 'Honeywell 4K ANPR High-Speed Bullet with Optical Zoom',
      installDate: new Date('2023-05-10')
    },
    documents: [
      {
        type: 'Completion Certificate',
        name: 'ANPR-Camera-Commissioning-Acceptance.pdf',
        ref: 'DOC-CAM-2023-CC',
        date: new Date('2023-05-25')
      }
    ],
    lifecycleHistory: [
      {
        stage: 'PLAN_DESIGN',
        date: new Date('2022-11-01'),
        description: 'Corridor surveillance and ANPR coverage plan formulated',
        by: 'Police Technical Services',
        cost: 120000
      },
      {
        stage: 'BUILD',
        date: new Date('2023-04-01'),
        description: 'Camera mounting on steel gantry, fiber backhaul connection established',
        by: 'Honeywell Team',
        cost: 1630000
      },
      {
        stage: 'OPERATE',
        date: new Date('2023-05-20'),
        description: 'Continuous feed streaming to City Surveillance Command Center',
        by: 'Surveillance In-charge',
        cost: 0
      }
    ]
  }
];

// Inspections to seed
const seedInspections = [
  // 3+ inspections for RD-AHM-001 (Potholes, Cracking, Rutting)
  {
    assetId: 'RD-AHM-001',
    inspector: 'Rajesh Varma, Lead PWD Auditor',
    condition: 'GOOD',
    date: new Date('2024-03-10'),
    defects: [{ type: 'Surface deterioration', severity: 'LOW' }],
    remarks: 'Routine pre-monsoon survey. Pavement surface intact with minor hairline wear on slow lane.'
  },
  {
    assetId: 'RD-AHM-001',
    inspector: 'Rajesh Varma, Lead PWD Auditor',
    condition: 'FAIR',
    date: new Date('2024-11-15'),
    defects: [
      { type: 'Potholes', severity: 'MEDIUM' },
      { type: 'Cracking', severity: 'LOW' }
    ],
    remarks: 'Post-monsoon damage identified between km 2.4 and 3.8. Localized cracking along wheel path.'
  },
  {
    assetId: 'RD-AHM-001',
    inspector: 'Dr. Anita Joshi, Senior Highway Consultant',
    condition: 'FAIR',
    date: new Date('2025-07-20'),
    defects: [
      { type: 'Rutting', severity: 'MEDIUM' },
      { type: 'Potholes', severity: 'MEDIUM' }
    ],
    remarks: 'Heavy commercial freight wheel rutting recorded in central lane. Asphalt resurfacing recommended.'
  },

  // Inspections for BR-AHM-001 (Corrosion, Concrete cracking, Poor health)
  {
    assetId: 'BR-AHM-001',
    inspector: 'Vikram Desai, Senior Structural Assessor',
    condition: 'POOR',
    date: new Date('2024-06-15'),
    defects: [
      { type: 'Concrete cracking', severity: 'HIGH' },
      { type: 'Corrosion', severity: 'HIGH' }
    ],
    remarks: 'Subsurface rebar oxidation causing longitudinal concrete spalling at pier P3 and bearing pedestal.'
  },
  {
    assetId: 'BR-AHM-001',
    inspector: 'Dr. Anita Joshi, Central Structural Audit Board',
    condition: 'CRITICAL',
    date: new Date('2025-01-10'),
    defects: [
      { type: 'Concrete cracking', severity: 'HIGH' },
      { type: 'Expansion joint damage', severity: 'HIGH' },
      { type: 'Corrosion', severity: 'HIGH' },
      { type: 'Structural deterioration', severity: 'MEDIUM' }
    ],
    remarks: 'Severe degradation of expansion finger joints and shear key cracks. Speed limit restricted to 30 km/h.'
  },

  // Additional inspections for other assets
  {
    assetId: 'RD-AHM-002',
    inspector: 'Hiren Patel, Quality Inspector',
    condition: 'GOOD',
    date: new Date('2025-11-10'),
    defects: [],
    remarks: 'Surface smoothness and skid resistance meet IRC standards.'
  },
  {
    assetId: 'CV-AHM-001',
    inspector: 'M. K. Solanki, Drainage Engineer',
    condition: 'POOR',
    date: new Date('2025-09-05'),
    defects: [
      { type: 'Structural deterioration', severity: 'HIGH' },
      { type: 'Concrete cracking', severity: 'MEDIUM' }
    ],
    remarks: 'Scouring near foundation masonry and substantial mortar leaching.'
  },
  {
    assetId: 'UP-AHM-001',
    inspector: 'Hiren Patel, Municipal Engineer',
    condition: 'FAIR',
    date: new Date('2025-05-12'),
    defects: [{ type: 'Concrete cracking', severity: 'MEDIUM' }],
    remarks: 'Seepage traces noted on western retaining wall; sump pump operational.'
  },
  {
    assetId: 'TS-AHM-001',
    inspector: 'Pooja Shah, Electronics Engineer',
    condition: 'GOOD',
    date: new Date('2025-12-05'),
    defects: [],
    remarks: 'Signal phasing responsive to optical loop sensors.'
  }
];

// Maintenance records to seed
const seedMaintenance = [
  // 2 records for RD-AHM-001
  {
    assetId: 'RD-AHM-001',
    type: 'Crack Sealing & Joint Repair',
    description: 'Hot-pour rubberized bitumen crack sealing along km 2.0 to 4.5',
    cost: 450000,
    startDate: new Date('2024-12-01'),
    completionDate: new Date('2024-12-10'),
    priority: 'MEDIUM',
    status: 'COMPLETED',
    contractor: 'Apex Road Builders',
    remarks: 'Cracks routed, cleaned with hot compressed air, and sealed.'
  },
  {
    assetId: 'RD-AHM-001',
    type: 'Asphalt Milling & Pothole Remediation',
    description: 'Full width cold milling and hot mix asphalt patching for heavy rutted sections',
    cost: 1250000,
    startDate: new Date('2025-08-15'),
    completionDate: null,
    priority: 'HIGH',
    status: 'RECOMMENDED',
    contractor: 'GSRDC Division Fleet',
    remarks: 'Awaiting work order allocation for night shift road closure.'
  },

  // Record for BR-AHM-001
  {
    assetId: 'BR-AHM-001',
    type: 'Emergency Cathodic Protection & Jacketing',
    description: 'RCC micro-concreting jacketing for pier P3 and anti-corrosive zinc coating of rebars',
    cost: 3500000,
    startDate: null,
    completionDate: null,
    priority: 'URGENT',
    status: 'RECOMMENDED',
    contractor: 'Specialized Structural Repair Ltd.',
    remarks: 'Urgent intervention mandatory before upcoming monsoon.'
  },

  // Record for CV-AHM-001
  {
    assetId: 'CV-AHM-001',
    type: 'Decommissioning Preparation & Temporary Shoring',
    description: 'Installation of steel propping to stabilize culvert barrel prior to new bridge construction',
    cost: 600000,
    startDate: new Date('2025-11-01'),
    completionDate: new Date('2025-11-15'),
    priority: 'HIGH',
    status: 'COMPLETED',
    contractor: 'Gujarat Shoring Works',
    remarks: 'Temporary stabilization verified by structural engineer.'
  }
];

// Work orders to seed
const seedWorkOrders = [
  // 1 open work order for RD-AHM-001
  {
    assetId: 'RD-AHM-001',
    woNumber: 'WO-2026-0001',
    issue: 'Execute cold milling and resurfacing on Section 01 lane 2-3 to eliminate rutting hazards',
    priority: 'HIGH',
    assignedDepartment: 'Road Maintenance Rapid Taskforce',
    estimatedCost: 1250000,
    status: 'OPEN',
    maintenanceIndex: 1 // Links to second maintenance record of RD-AHM-001
  },
  {
    assetId: 'BR-AHM-001',
    woNumber: 'WO-2026-0002',
    issue: 'Structural bracing and expansion joint emergency renewal at Pier P3',
    priority: 'URGENT',
    assignedDepartment: 'Bridge & Heavy Structures Division',
    estimatedCost: 3500000,
    status: 'IN_PROGRESS',
    maintenanceIndex: 2
  }
];

module.exports = {
  seedAssets,
  seedInspections,
  seedMaintenance,
  seedWorkOrders
};
