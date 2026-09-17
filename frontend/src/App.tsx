// ============================================================
// PORTGUARD AI — APPLICATION ROOT
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import LiveMonitoring from './pages/LiveMonitoring';
import Cameras from './pages/Cameras';
import ActiveAlerts from './pages/ActiveAlerts';
import IncidentHistory from './pages/IncidentHistory';
import SafetyAnalytics from './pages/SafetyAnalytics';
import SystemStatus from './pages/SystemStatus';
import Settings from './pages/Settings';

// Import styles
import './styles/index.css';
import './components/ui/ui.css';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/monitoring" element={<LiveMonitoring />} />
            <Route path="/cameras" element={<Cameras />} />
            <Route path="/alerts" element={<ActiveAlerts />} />
            <Route path="/incidents" element={<IncidentHistory />} />
            <Route path="/analytics" element={<SafetyAnalytics />} />
            <Route path="/system" element={<SystemStatus />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
