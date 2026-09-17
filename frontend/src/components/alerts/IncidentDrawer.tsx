// ============================================================
// PORTGUARD AI — INCIDENT DRAWER
// ============================================================

import { useState } from 'react';
import { CheckCircle, AlertTriangle, Clock, Camera, MapPin, Zap, Layers, Shield } from 'lucide-react';
import Drawer from '../ui/Drawer';
import Button from '../ui/Button';
import { SeverityBadge, EventBadge } from '../ui/SeverityBadge';
import type { DetectionEvent } from '../../types';
import { formatDateTime, formatConfidenceDecimal } from '../../utils/formatting';
import { TRUST_STRINGS } from '../../utils/constants';
import './alerts.css';

interface Props {
  incident: DetectionEvent | null;
  onClose: () => void;
  onAcknowledge: (id: string) => void;
}

export default function IncidentDrawer({ incident, onClose, onAcknowledge }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [acknowledging, setAcknowledging] = useState(false);

  if (!incident) return null;

  const handleAcknowledge = async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setAcknowledging(true);
    // Simulate brief delay
    await new Promise(r => setTimeout(r, 500));
    onAcknowledge(incident.id);
    setAcknowledging(false);
    setConfirming(false);
    onClose();
  };

  return (
    <Drawer open={!!incident} onClose={onClose} title="Incident Details">
      <div className="incident-drawer">
        {/* Severity + Event */}
        <div className="incident-drawer__badges">
          <SeverityBadge severity={incident.severity} />
          <EventBadge eventType={incident.eventType} />
        </div>

        {/* Evidence Frame */}
        <div className="incident-drawer__evidence">
          <div className="cctv-frame" style={{ aspectRatio: '16/10' }}>
            <div className="cctv-grid-overlay" />
            <div className="live-camera__cam-overlay">{incident.cameraId}</div>
            {incident.evidence?.detections && (
              <div className="detection-overlay">
                {incident.evidence.detections.map(det => (
                  <div
                    key={det.id}
                    className="detection-box"
                    style={{
                      left: `${det.bbox.x}%`,
                      top: `${det.bbox.y}%`,
                      width: `${det.bbox.w}%`,
                      height: `${det.bbox.h}%`,
                      borderColor: incident.severity === 'CRITICAL' ? 'var(--critical)' : 'var(--warning)',
                    }}
                  >
                    <span
                      className="detection-box__label"
                      style={{ backgroundColor: incident.severity === 'CRITICAL' ? 'var(--critical)' : 'var(--warning)' }}
                    >
                      {det.label.replace(/_/g, ' ')} {Math.round(det.confidence * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Detail Fields */}
        <div className="incident-drawer__details">
          <div className="incident-drawer__field">
            <span className="incident-drawer__field-icon"><Camera size={14} /></span>
            <span className="incident-drawer__field-label">Camera</span>
            <span className="incident-drawer__field-value">{incident.cameraId} — {incident.cameraName}</span>
          </div>
          <div className="incident-drawer__field">
            <span className="incident-drawer__field-icon"><MapPin size={14} /></span>
            <span className="incident-drawer__field-label">Zone</span>
            <span className="incident-drawer__field-value">{incident.zone}</span>
          </div>
          <div className="incident-drawer__field">
            <span className="incident-drawer__field-icon"><Clock size={14} /></span>
            <span className="incident-drawer__field-label">Timestamp</span>
            <span className="incident-drawer__field-value">{formatDateTime(incident.timestamp)}</span>
          </div>
          <div className="incident-drawer__field">
            <span className="incident-drawer__field-icon"><Zap size={14} /></span>
            <span className="incident-drawer__field-label">Confidence</span>
            <span className="incident-drawer__field-value">{formatConfidenceDecimal(incident.confidence)}</span>
          </div>
          {incident.frameCount && (
            <div className="incident-drawer__field">
              <span className="incident-drawer__field-icon"><Layers size={14} /></span>
              <span className="incident-drawer__field-label">Detection</span>
              <span className="incident-drawer__field-value">
                {incident.detectionStability}% stability · {incident.frameCount} frames
              </span>
            </div>
          )}
          <div className="incident-drawer__field">
            <span className="incident-drawer__field-icon"><Shield size={14} /></span>
            <span className="incident-drawer__field-label">Status</span>
            <span className="incident-drawer__field-value" style={{
              color: incident.status === 'OPEN' ? 'var(--warning)' : 'var(--safe)',
              fontWeight: 600,
            }}>
              {incident.status}
            </span>
          </div>
        </div>

        {/* Safety Evaluation */}
        {incident.evidence?.safetyEvaluation && (
          <div className="incident-drawer__evaluation">
            <h4>Safety Evaluation</h4>
            <div className="incident-drawer__eval-row">
              <span>Rule</span>
              <span>{incident.evidence.safetyEvaluation.rule}</span>
            </div>
            <div className="incident-drawer__eval-row">
              <span>Result</span>
              <span style={{ color: incident.evidence.safetyEvaluation.result === 'PASS' ? 'var(--safe)' : 'var(--critical)' }}>
                {incident.evidence.safetyEvaluation.result}
              </span>
            </div>
            <div className="incident-drawer__eval-row">
              <span>Reason</span>
              <span>{incident.evidence.safetyEvaluation.reason}</span>
            </div>
          </div>
        )}

        {/* Operator Action */}
        {incident.status === 'OPEN' && (
          <div className="incident-drawer__action">
            <h4>Operator Action</h4>
            <p className="incident-drawer__disclaimer">{TRUST_STRINGS.verification}</p>
            {confirming && (
              <div className="incident-drawer__confirm">
                <AlertTriangle size={16} style={{ color: 'var(--warning)' }} />
                <span>Confirm: Mark this incident as reviewed?</span>
              </div>
            )}
            <div className="incident-drawer__action-btns">
              <Button
                variant={confirming ? 'danger' : 'primary'}
                onClick={handleAcknowledge}
                loading={acknowledging}
                icon={<CheckCircle size={16} />}
              >
                {confirming ? 'Confirm — Mark as Reviewed' : 'Mark as Reviewed'}
              </Button>
              {confirming && (
                <Button variant="ghost" onClick={() => setConfirming(false)}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
        )}

        {incident.status === 'REVIEWED' && (
          <div className="incident-drawer__reviewed">
            <CheckCircle size={16} style={{ color: 'var(--safe)' }} />
            <span>This incident has been reviewed</span>
          </div>
        )}

        {incident.isDemo && (
          <div className="incident-drawer__demo-tag">
            DEMO DATA — Simulated incident
          </div>
        )}
      </div>
    </Drawer>
  );
}
