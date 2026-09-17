// ============================================================
// PORTGUARD AI — DASHBOARD PAGE
// ============================================================

import { useNavigate } from 'react-router-dom';
import KPIGrid from '../components/dashboard/KPIGrid';
import LiveCamera from '../components/dashboard/LiveCamera';
import SafetyStatus from '../components/dashboard/SafetyStatus';
import ActiveAlerts from '../components/dashboard/ActiveAlerts';
import AIDetectionPanel from '../components/dashboard/AIDetectionPanel';
import SafetyRulePanel from '../components/dashboard/SafetyRulePanel';
import { SeverityBadge, EventBadge } from '../components/ui/SeverityBadge';
import { useIncidents } from '../context/AppContext';
import { formatTime } from '../utils/formatting';

export default function Dashboard() {
  const { incidents } = useIncidents();
  const navigate = useNavigate();
  const recent = incidents.slice(0, 5);

  return (
    <div className="animate-fade-in">
      {/* KPI Row */}
      <KPIGrid />

      {/* Live Camera Feed */}
      <div className="dashboard__camera-section">
        <LiveCamera />
      </div>

      {/* Safety Status + Active Alerts */}
      <div className="dashboard__row">
        <SafetyStatus />
        <ActiveAlerts />
      </div>

      {/* AI Detection + Safety Rules */}
      <div className="dashboard__row">
        <AIDetectionPanel />
        <SafetyRulePanel />
      </div>

      {/* Recent Incidents */}
      <div className="recent-incidents">
        <div className="recent-incidents__header">
          <h3 className="section-title">RECENT INCIDENTS</h3>
          <button className="recent-incidents__link" onClick={() => navigate('/incidents')}>
            View all →
          </button>
        </div>
        <table className="recent-incidents__table">
          <thead>
            <tr>
              <th>Severity</th>
              <th>Event</th>
              <th>Camera</th>
              <th>Zone</th>
              <th>Time</th>
              <th>Confidence</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map(inc => (
              <tr key={inc.id}>
                <td><SeverityBadge severity={inc.severity} size="sm" /></td>
                <td><EventBadge eventType={inc.eventType} size="sm" /></td>
                <td>{inc.cameraId}</td>
                <td>{inc.zone}</td>
                <td style={{ fontVariantNumeric: 'tabular-nums' }}>{formatTime(inc.timestamp)}</td>
                <td>{Math.round(inc.confidence * 100)}%</td>
                <td>
                  <span style={{
                    color: inc.status === 'OPEN' ? 'var(--warning)' : 'var(--safe)',
                    fontSize: 'var(--font-xs)',
                    fontWeight: 600,
                  }}>
                    {inc.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
