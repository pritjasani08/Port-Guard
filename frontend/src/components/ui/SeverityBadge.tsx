// ============================================================
// PORTGUARD AI — SEVERITY BADGE
// Always: ICON + LABEL + COLOR (never color alone)
// ============================================================

import { CircleAlert, TriangleAlert, CircleCheck, Flame, CloudFog, HardHat, ShieldOff, ShieldCheck } from 'lucide-react';
import type { Severity, EventType } from '../../types';
import { SEVERITY_CONFIG, EVENT_CONFIG } from '../../utils/constants';

interface SeverityBadgeProps {
  severity: Severity;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

const SEV_ICONS = {
  CRITICAL: CircleAlert,
  HIGH: TriangleAlert,
  NORMAL: CircleCheck,
};

export function SeverityBadge({ severity, size = 'md', showLabel = true }: SeverityBadgeProps) {
  const config = SEVERITY_CONFIG[severity];
  const Icon = SEV_ICONS[severity];
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <span
      className={`badge badge--${size}`}
      style={{
        color: config.color,
        background: config.bgColor,
        borderColor: config.borderColor,
      }}
      aria-label={config.label}
    >
      <Icon size={iconSize} />
      {showLabel && <span>{config.label.toUpperCase()}</span>}
    </span>
  );
}

// Event-specific badge (shows event type)
interface EventBadgeProps {
  eventType: EventType;
  size?: 'sm' | 'md';
}

const EVENT_ICONS: Record<EventType, React.ComponentType<{ size?: number }>> = {
  FIRE_DETECTED: Flame,
  SMOKE_DETECTED: CloudFog,
  HELMET_MISSING: HardHat,
  SAFETY_JACKET_MISSING: ShieldOff,
  PPE_COMPLIANT: ShieldCheck,
};

export function EventBadge({ eventType, size = 'md' }: EventBadgeProps) {
  const config = EVENT_CONFIG[eventType];
  const Icon = EVENT_ICONS[eventType];
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <span
      className={`badge badge--${size}`}
      style={{
        color: config.color,
        background: config.bgColor,
        borderColor: config.borderColor,
      }}
      aria-label={config.label}
    >
      <Icon size={iconSize} />
      <span>{config.shortLabel}</span>
    </span>
  );
}
