import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';

import Dashboard from './pages/Dashboard';
import AssetRegistry from './pages/AssetRegistry';
import InfrastructureMap from './pages/InfrastructureMap';
import AssetPassport from './pages/AssetPassport';
import Inspections from './pages/Inspections';
import MaintenanceWorkOrders from './pages/MaintenanceWorkOrders';
import LifecyclePage from './pages/LifecyclePage';
import TrafficControl from './pages/TrafficControl';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        {/* Top Header with 3px gold accent line */}
        <Header />

        <div className="app-body">
          {/* Solid Navy-800 Sidebar */}
          <Sidebar />

          {/* Main Content Viewport */}
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/assets" element={<AssetRegistry pageTitle="Infrastructure Asset Registry" />} />
              <Route path="/roads" element={<AssetRegistry defaultCategory="ROAD" pageTitle="State Highway & Road Network Registry" />} />
              <Route path="/structures" element={<AssetRegistry defaultCategory="STRUCTURE" pageTitle="Bridges, Flyovers & Structures Registry" />} />
              <Route path="/map" element={<InfrastructureMap />} />
              <Route path="/assets/:id" element={<AssetPassport />} />
              <Route path="/inspections" element={<Inspections />} />
              <Route path="/maintenance" element={<MaintenanceWorkOrders />} />
              <Route path="/lifecycle" element={<LifecyclePage />} />
              <Route path="/traffic" element={<TrafficControl />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>

        {/* Global Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}
