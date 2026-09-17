// ============================================================
// PORTGUARD AI — SAFETY STATUS PANEL
// ============================================================

import { ShieldCheck, ShieldAlert, Flame } from 'lucide-react';
import { useIncidents } from '../../context/AppContext';
import { SeverityBadge } from '../ui/SeverityBadge';
import { formatTime } from '../../utils/formatting';
import { TRUST_STRINGS } from '../../utils/constants';
import type { Severity } from '../../types';
import './dashboard.css';

export default function SafetyStatus() {
  const { activeAlerts, criticalCount } = useIncidents();

  // Determine highest severity
  let status: Severity = 'NORMAL';
  let statusLabel = 'ALL CLEAR';
  let statusDesc = 'All monitored safety conditions are satisfied.';
  let StatusIcon = ShieldCheck;
  let latestAlert = activeAlerts[0];

  if (criticalCount > 0) {
    status = 'CRITICAL';
    statusLabel = 'CRITICAL';
    statusDesc = 'Immediate attention required.';
    StatusIcon = Flame;
  } else if (activeAlerts.length > 0) {
    status = 'HIGH';
    statusLabel = 'WARNING';
    statusDesc = 'Potential safety violation requires investigation.';
    StatusIcon = ShieldAlert;
  }

  const statusColors: Record<Severity, string> = {
    CRITICAL: 'var(--critical)',
    HIGH: 'var(--warning)',
    NORMAL: 'var(--safe)',
  };

  return (
    <div className={`safety-status safety-status--${status.toLowerCase()}`}>
      <div className="safety-status__header">
        <h3 className="safety-status__title">CURRENT SAFETY STATUS</h3>
        <SeverityBadge severity={status} />
      </div>

      <div className="safety-status__main">
        <div className="safety-status__icon" style={{ color: statusColors[status] }}>
          <StatusIcon size={36} />
        </div>
        <div className="safety-status__info">
          <span className="safety-status__label" style={{ color: statusColors[status] }}>
            {statusLabel}
          </span>
          <span className="safety-status__desc">{statusDesc}</span>
        </div>
      </div>

      {latestAlert && status !== 'NORMAL' && (
        <div className="safety-status__alert">
          <div className="safety-status__alert-row">
            <span className="safety-status__alert-key">Camera</span>
            <span>{latestAlert.cameraId} — {latestAlert.zone}</span>
          </div>
          <div className="safety-status__alert-row">
            <span className="safety-status__alert-key">Confidence</span>
            <span>{Math.round(latestAlert.confidence * 100)}%</span>
          </div>
          <div className="safety-status__alert-row">
            <span className="safety-status__alert-key">Detected</span>
            <span>{formatTime(latestAlert.timestamp)}</span>
          </div>
          {latestAlert.frameCount && (
            <div className="safety-status__alert-row">
              <span className="safety-status__alert-key">Stability</span>
              <span>{latestAlert.detectionStability}% across {latestAlert.frameCount} frames</span>
            </div>
          )}
        </div>
      )}

      <div className="safety-status__footer">
        <span>{TRUST_STRINGS.assisted}</span>
      </div>
    </div>
  );
}
