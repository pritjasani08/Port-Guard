// ============================================================
// PORTGUARD AI — SAFETY RULE EVALUATION PANEL
// Visual pipeline: Detection → Rule → Alert
// ============================================================

import { ArrowDown, CheckCircle, XCircle } from 'lucide-react';
import { useIncidents } from '../../context/AppContext';
import { SAFETY_RULES } from '../../utils/constants';
import Card from '../ui/Card';
import './dashboard.css';

export default function SafetyRulePanel() {
  const { activeAlerts } = useIncidents();

  // Show the most recent active rule evaluation, or a default passing one
  const latestAlert = activeAlerts[0];
  const activeRule = latestAlert
    ? SAFETY_RULES.find(r => r.eventType === latestAlert.eventType)
    : null;

  // Build pipeline steps
  const steps = activeRule
    ? [
        { label: activeRule.detectionInput, status: 'detected' as const },
        { label: activeRule.evaluationStep, status: 'evaluated' as const },
        { label: activeRule.possibleOutcome, status: 'alert' as const },
      ]
    : [
        { label: 'PERSON detected by YOLOv8', status: 'detected' as const },
        { label: 'HELMET detected · JACKET detected', status: 'evaluated' as const },
        { label: 'NORMAL — PPE Compliant', status: 'pass' as const },
      ];

  const isFailing = activeRule !== null && activeRule !== undefined;
  const sevColor = isFailing
    ? (activeRule!.severity === 'CRITICAL' ? 'var(--critical)' : 'var(--warning)')
    : 'var(--safe)';

  return (
    <div className="rule-panel">
      <h3 className="section-title">SAFETY RULE EVALUATION</h3>
      <Card>
        <div className="rule-panel__pipeline">
          {steps.map((step, i) => (
            <div key={i}>
              <div className={`rule-panel__step rule-panel__step--${step.status}`}>
                <div className="rule-panel__step-icon">
                  {step.status === 'pass' ? (
                    <CheckCircle size={16} style={{ color: 'var(--safe)' }} />
                  ) : step.status === 'alert' ? (
                    <XCircle size={16} style={{ color: sevColor }} />
                  ) : (
                    <span className="rule-panel__step-num">{i + 1}</span>
                  )}
                </div>
                <span
                  className="rule-panel__step-label"
                  style={step.status === 'alert' ? { color: sevColor, fontWeight: 600 } : {}}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="rule-panel__arrow">
                  <ArrowDown size={14} />
                </div>
              )}
            </div>
          ))}
        </div>

        {latestAlert?.frameCount && (
          <div className="rule-panel__temporal">
            Detection confirmed across <strong>{latestAlert.frameCount}</strong> consecutive frames
            {latestAlert.detectionStability && (
              <> · Stability: <strong>{latestAlert.detectionStability}%</strong></>
            )}
          </div>
        )}

        {!isFailing && (
          <div className="rule-panel__pass">
            <CheckCircle size={14} style={{ color: 'var(--safe)' }} />
            <span>All safety rules are currently passing</span>
          </div>
        )}
      </Card>
    </div>
  );
}
