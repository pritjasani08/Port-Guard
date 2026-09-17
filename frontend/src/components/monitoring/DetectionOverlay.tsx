// ============================================================
// PORTGUARD AI — DETECTION OVERLAY (Bounding Boxes)
// ============================================================

import type { DetectionResult } from '../../types';
import './DetectionOverlay.css';

interface Props {
  detections: DetectionResult[];
}

function getDetectionColor(label: string): string {
  switch (label) {
    case 'FIRE': return 'var(--critical)';
    case 'SMOKE': return 'var(--warning)';
    case 'PERSON': return 'var(--info)';
    case 'HELMET': return 'var(--safe)';
    case 'SAFETY_JACKET': return 'var(--safe)';
    default: return 'var(--info)';
  }
}

function formatLabel(label: string): string {
  return label.replace(/_/g, ' ');
}

export default function DetectionOverlay({ detections }: Props) {
  return (
    <div className="detection-overlay">
      {detections.map(det => {
        const color = getDetectionColor(det.label);
        return (
          <div
            key={det.id}
            className="detection-box"
            style={{
              left: `${det.bbox.x}%`,
              top: `${det.bbox.y}%`,
              width: `${det.bbox.w}%`,
              height: `${det.bbox.h}%`,
              borderColor: color,
            }}
          >
            <span
              className="detection-box__label"
              style={{ backgroundColor: color }}
            >
              {formatLabel(det.label)} {Math.round(det.confidence * 100)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
