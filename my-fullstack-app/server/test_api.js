const http = require('http');

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(`http://localhost:5000${path}`);
    const reqOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = http.request(reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, body: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🚀 Running automated API verification suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName} - ${details}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------
    // Test 1: GET /api/assets/RD-AHM-001/passport
    // -------------------------------------------------------------
    console.log('--- Test 1: Digital Asset Passport ---');
    const pRes = await request('/api/assets/RD-AHM-001/passport');
    assert(pRes.status === 200, 'GET /api/assets/RD-AHM-001/passport returns 200');
    const passport = pRes.body.data;
    assert(passport && passport.asset.assetId === 'RD-AHM-001', 'Passport contains asset RD-AHM-001');
    assert(Array.isArray(passport.inspections) && passport.inspections.length >= 3, 'Passport contains 3+ inspections');
    assert(Array.isArray(passport.maintenance) && passport.maintenance.length >= 2, 'Passport contains 2+ maintenance records');
    assert(Array.isArray(passport.workOrders) && passport.workOrders.length >= 1, 'Passport contains 1+ work order');
    assert(Array.isArray(passport.documents) && passport.documents.length >= 6, 'Passport contains 6 documents');
    assert(Array.isArray(passport.mergedChronologicalHistory) && passport.mergedChronologicalHistory.length > 5, 'Passport contains merged chronological history');
    assert(Boolean(pRes.body.disclaimer), 'Response includes engineering safety disclaimer');

    // -------------------------------------------------------------
    // Test 2: POST an inspection with HIGH defect -> auto-maintenance & move to MAINTAIN
    // -------------------------------------------------------------
    console.log('\n--- Test 2: Inspection Workflow Trigger ---');
    // First, verify RD-AHM-002 is in OPERATE
    const a2Before = await request('/api/assets/RD-AHM-002');
    assert(a2Before.body.data.lifecycleStage === 'OPERATE', 'RD-AHM-002 starts in OPERATE stage');

    const inspRes = await request('/api/inspections', {
      method: 'POST',
      body: {
        asset: 'RD-AHM-002',
        inspector: 'Senior Audit Engineer Test',
        condition: 'POOR',
        defects: [
          { type: 'Potholes', severity: 'HIGH' },
          { type: 'Cracking', severity: 'MEDIUM' }
        ],
        remarks: 'Severe localized base course failure'
      }
    });

    assert(inspRes.status === 201, 'POST /api/inspections with HIGH defect returns 201');
    assert(Boolean(inspRes.body.data.autoCreatedMaintenance), 'RECOMMENDED maintenance record was auto-created');
    assert(inspRes.body.data.autoCreatedMaintenance.status === 'RECOMMENDED', 'Auto-created maintenance status is RECOMMENDED');
    assert(inspRes.body.data.asset.lifecycleStage === 'MAINTAIN', 'Asset automatically moved to MAINTAIN stage');
    assert(
      inspRes.body.data.asset.lifecycleHistory.some((h) => h.stage === 'MAINTAIN'),
      'Lifecycle history contains auto-transition event'
    );

    // -------------------------------------------------------------
    // Test 3: POST work order -> maintenance SCHEDULED. Status progression to CLOSED
    // -------------------------------------------------------------
    console.log('\n--- Test 3: Work Order Linking and Status Progression ---');
    const woRes = await request('/api/work-orders', {
      method: 'POST',
      body: {
        asset: 'RD-AHM-002',
        issue: 'Pothole remediation and base stabilization',
        priority: 'HIGH',
        estimatedCost: 800000
      }
    });

    assert(woRes.status === 201, 'POST /api/work-orders returns 201');
    const workOrder = woRes.body.data.workOrder;
    assert(Boolean(workOrder.woNumber), `Work order assigned auto woNumber: ${workOrder.woNumber}`);
    assert(Boolean(workOrder.maintenanceId), 'Work order linked to maintenance record');
    assert(woRes.body.data.linkedMaintenance.status === 'SCHEDULED', 'Linked maintenance set to SCHEDULED');

    // Progress to IN_PROGRESS
    const patchInProg = await request(`/api/work-orders/${workOrder._id}/status`, {
      method: 'PATCH',
      body: { status: 'IN_PROGRESS' }
    });
    assert(patchInProg.status === 200, 'PATCH work order to IN_PROGRESS returns 200');
    assert(patchInProg.body.data.updatedMaintenance.status === 'IN_PROGRESS', 'Linked maintenance is IN_PROGRESS');

    // Progress to COMPLETED
    const patchComp = await request(`/api/work-orders/${workOrder._id}/status`, {
      method: 'PATCH',
      body: { status: 'COMPLETED' }
    });
    assert(patchComp.status === 200, 'PATCH work order to COMPLETED returns 200');
    assert(patchComp.body.data.updatedMaintenance.status === 'COMPLETED', 'Linked maintenance is COMPLETED');

    // Progress to CLOSED
    const patchClosed = await request(`/api/work-orders/${workOrder._id}/status`, {
      method: 'PATCH',
      body: { status: 'CLOSED' }
    });
    assert(patchClosed.status === 200, 'PATCH work order to CLOSED returns 200');
    assert(patchClosed.body.data.updatedMaintenance.status === 'VERIFIED', 'Linked maintenance is VERIFIED');
    assert(patchClosed.body.data.updatedAsset.lifecycleStage === 'OPERATE', 'Asset returned to OPERATE stage');
    assert(
      patchClosed.body.data.updatedAsset.condition === 'FAIR',
      `Condition improved one level from POOR to FAIR: current is ${patchClosed.body.data.updatedAsset.condition}`
    );

    // -------------------------------------------------------------
    // Test 4: Invalid lifecycle transition returns 400
    // -------------------------------------------------------------
    console.log('\n--- Test 4: Lifecycle Transition Rules ---');
    // RD-AHM-004 is in PLAN_DESIGN. Attempt to jump to MAINTAIN or OPERATE
    const badTrans = await request('/api/assets/RD-AHM-004/lifecycle', {
      method: 'POST',
      body: {
        targetStage: 'OPERATE',
        description: 'Illegal stage jump attempt'
      }
    });
    assert(badTrans.status === 400, 'Invalid forward jump (PLAN_DESIGN -> OPERATE) returns 400');
    assert(badTrans.body.success === false, 'Error response has success: false');

    // Valid forward transition PLAN_DESIGN -> BUILD
    const goodTrans = await request('/api/assets/RD-AHM-004/lifecycle', {
      method: 'POST',
      body: {
        targetStage: 'BUILD',
        description: 'Procurement complete, starting civil construction',
        by: 'Executive Engineer'
      }
    });
    assert(goodTrans.status === 200, 'Valid forward step (PLAN_DESIGN -> BUILD) returns 200');
    assert(goodTrans.body.data.lifecycleStage === 'BUILD', 'Asset stage updated to BUILD');

    // -------------------------------------------------------------
    // Test 5: GET /api/dashboard/stats returns all fields
    // -------------------------------------------------------------
    console.log('\n--- Test 5: Dashboard Statistics ---');
    const statsRes = await request('/api/dashboard/stats');
    assert(statsRes.status === 200, 'GET /api/dashboard/stats returns 200');
    const stats = statsRes.body.data;
    const requiredFields = [
      'totals',
      'roads',
      'structures',
      'traffic',
      'critical',
      'maintenanceDue',
      'overdueInspections',
      'estimatedMaintenanceCost',
      'perStage',
      'perCondition',
      'priorityCounts',
      'recentLifecycleEvents',
      'criticalAssets'
    ];
    for (const field of requiredFields) {
      assert(stats[field] !== undefined, `Dashboard stats has field: ${field}`);
    }
    assert(Array.isArray(stats.criticalAssets), 'criticalAssets is an array');
    if (stats.criticalAssets.length > 0) {
      assert(
        stats.criticalAssets[0].location && stats.criticalAssets[0].location.lat !== undefined,
        'criticalAssets includes coordinates'
      );
    }

    // -------------------------------------------------------------
    // Test 6: Analytics and Traffic Endpoints
    // -------------------------------------------------------------
    console.log('\n--- Test 6: Analytics & Traffic Endpoints ---');
    const condRes = await request('/api/analytics/conditions');
    assert(condRes.status === 200, 'GET /api/analytics/conditions returns 200');

    const lifeRes = await request('/api/analytics/lifecycle');
    assert(lifeRes.status === 200, 'GET /api/analytics/lifecycle returns 200');

    const trafficRes = await request('/api/traffic-assets');
    assert(trafficRes.status === 200, 'GET /api/traffic-assets returns 200');
    assert(Array.isArray(trafficRes.body.data) && trafficRes.body.data.length >= 2, 'Traffic assets returned');

    // -------------------------------------------------------------
    // Test 7: Global Query Filters
    // -------------------------------------------------------------
    console.log('\n--- Test 7: Asset Filtering ---');
    const filterRes = await request('/api/assets?category=ROAD&condition=FAIR');
    assert(filterRes.status === 200, 'GET /api/assets?category=ROAD&condition=FAIR returns 200');
    assert(
      filterRes.body.data.every((a) => a.category === 'ROAD' && a.condition === 'FAIR'),
      'All returned assets match filters'
    );

    console.log(`\n========================================`);
    console.log(`Summary: ${passed} passed, ${failed} failed`);
    console.log(`========================================\n`);

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test execution failed with error:', err);
    process.exit(1);
  }
}

runTests();
