// ============================================================
// PORTGUARD AI — ACTIVE ALERTS PAGE
// ============================================================

import { useState } from 'react';
import { Eye } from 'lucide-react';
import { useIncidents } from '../context/AppContext';
import { SeverityBadge, EventBadge } from '../components/ui/SeverityBadge';
import EmptyState from '../components/ui/EmptyState';
import IncidentDrawer from '../components/alerts/IncidentDrawer';
import { formatRelativeTime, formatConfidenceDecimal } from '../utils/formatting';
import { EVENT_CONFIG } from '../utils/constants';
import type { DetectionEvent, Severity } from '../types';
import '../components/alerts/alerts.css';

export default function ActiveAlerts() {
  const { activeAlerts, acknowledgeIncident } = useIncidents();
  const [sevFilter, setSevFilter] = useState<Severity | 'ALL'>('ALL');
  const [selectedIncident, setSelectedIncident] = useState<DetectionEvent | null>(null);

  const filtered = sevFilter === 'ALL'
    ? activeAlerts
    : activeAlerts.filter(a => a.severity === sevFilter);

  return (
    <div className="animate-fade-in">
      {/* Filters */}
      <div className="alerts-page__filters">
        {(['ALL', 'CRITICAL', 'HIGH'] as const).map(sev => (
          <button
            key={sev}
            className={`alerts-page__filter-btn ${sevFilter === sev ? 'alerts-page__filter-btn--active' : ''}`}
            onClick={() => setSevFilter(sev)}
          >
            {sev === 'ALL' ? `All (${activeAlerts.length})` : `${sev} (${activeAlerts.filter(a => a.severity === sev).length})`}
          </button>
        ))}
      </div>

      {/* Alert List */}
      {filtered.length === 0 ? (
        <EmptyState variant="no-alerts" />
      ) : (
        <div className="alerts-list">
          {filtered.map((alert, idx) => {
            const eventCfg = EVENT_CONFIG[alert.eventType];
            return (
              <div
                key={alert.id}
                className={`alert-card alert-card--${alert.severity.toLowerCase()} ${idx === 0 && alert.severity === 'CRITICAL' ? 'alert-card--new' : ''}`}
                onClick={() => setSelectedIncident(alert)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setSelectedIncident(alert)}
              >
                <div className="alert-card__badges">
                  <SeverityBadge severity={alert.severity} size="sm" />
                  <EventBadge eventType={alert.eventType} size="sm" />
                </div>
                <div className="alert-card__content">
                  <div className="alert-card__event">
                    {eventCfg.emoji} {eventCfg.label}
                  </div>
                  <div className="alert-card__camera">
                    {alert.cameraId} · {alert.zone}
                  </div>
                  <div className="alert-card__meta">
                    {formatConfidenceDecimal(alert.confidence)} confidence · {formatRelativeTime(alert.timestamp)}
                    {alert.frameCount && ` · ${alert.frameCount} frames`}
                  </div>
                </div>
                <div className="alert-card__actions">
                  <button
                    className="alert-item__action"
                    onClick={e => { e.stopPropagation(); setSelectedIncident(alert); }}
                    aria-label="Review alert"
                  >
                    <Eye size={14} /> Review
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <IncidentDrawer
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onAcknowledge={acknowledgeIncident}
      />
    </div>
  );
}
