// ============================================================
// PORTGUARD AI — ACTIVE ALERTS PANEL (Dashboard)
// ============================================================

import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { useIncidents } from '../../context/AppContext';
import { SeverityBadge, EventBadge } from '../ui/SeverityBadge';
import EmptyState from '../ui/EmptyState';
import { formatTime, formatConfidenceDecimal } from '../../utils/formatting';
import './dashboard.css';

export default function ActiveAlerts() {
  const { activeAlerts } = useIncidents();
  const navigate = useNavigate();

  return (
    <div className="active-alerts">
      <div className="active-alerts__header">
        <h3 className="section-title">ACTIVE ALERTS</h3>
        <span className="active-alerts__count">{activeAlerts.length}</span>
      </div>

      <div className="active-alerts__list">
        {activeAlerts.length === 0 ? (
          <EmptyState variant="no-alerts" />
        ) : (
          activeAlerts.slice(0, 5).map((alert, idx) => (
            <div
              key={alert.id}
              className={`alert-item ${alert.severity === 'CRITICAL' && idx === 0 ? 'alert-item--pulse' : ''}`}
            >
              <div className="alert-item__left">
                <SeverityBadge severity={alert.severity} size="sm" />
                <EventBadge eventType={alert.eventType} size="sm" />
              </div>
              <div className="alert-item__content">
                <div className="alert-item__camera">
                  {alert.cameraId} · {alert.zone}
                </div>
                <div className="alert-item__meta">
                  {formatConfidenceDecimal(alert.confidence)} confidence · {formatTime(alert.timestamp)}
                  {alert.frameCount && ` · ${alert.frameCount} frames`}
                </div>
              </div>
              <button
                className="alert-item__action"
                onClick={() => navigate('/alerts')}
                aria-label={`Review alert: ${alert.eventType}`}
              >
                <Eye size={14} /> Review
              </button>
            </div>
          ))
        )}
      </div>

      {activeAlerts.length > 5 && (
        <button className="active-alerts__more" onClick={() => navigate('/alerts')}>
          View all {activeAlerts.length} alerts →
        </button>
      )}
    </div>
  );
}
