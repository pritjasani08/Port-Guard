// ============================================================
// PORTGUARD AI — EMPTY STATE COMPONENT
// ============================================================

import type { ReactNode } from 'react';
import { ShieldCheck, Camera, FileText, Server, AlertTriangle } from 'lucide-react';

type EmptyVariant = 'no-alerts' | 'no-incidents' | 'no-cameras' | 'camera-offline' | 'api-error' | 'no-data';

interface EmptyStateProps {
  variant?: EmptyVariant;
  title?: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

const DEFAULTS: Record<EmptyVariant, { icon: ReactNode; title: string; description: string }> = {
  'no-alerts': {
    icon: <ShieldCheck size={40} />,
    title: 'No Active Alerts',
    description: 'All monitored safety conditions are currently normal.',
  },
  'no-incidents': {
    icon: <FileText size={40} />,
    title: 'No Incidents Recorded',
    description: 'No safety incidents have been detected yet.',
  },
  'no-cameras': {
    icon: <Camera size={40} />,
    title: 'No Cameras Available',
    description: 'No camera feeds are currently connected.',
  },
  'camera-offline': {
    icon: <Camera size={40} />,
    title: 'Camera Offline',
    description: 'This camera is not currently connected.',
  },
  'api-error': {
    icon: <Server size={40} />,
    title: 'Connection Error',
    description: 'Unable to retrieve live system data.',
  },
  'no-data': {
    icon: <AlertTriangle size={40} />,
    title: 'Insufficient Data',
    description: 'Not enough data is available to display this information.',
  },
};

export default function EmptyState({ variant = 'no-data', title, description, action, icon }: EmptyStateProps) {
  const defaults = DEFAULTS[variant];
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        {icon || defaults.icon}
      </div>
      <h3 className="empty-state__title">{title || defaults.title}</h3>
      <p className="empty-state__desc">{description || defaults.description}</p>
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}
