// ============================================================
// PORTGUARD AI — KPI GRID
// ============================================================

import { Camera, TriangleAlert, FileWarning, Cpu } from 'lucide-react';
import Card from '../ui/Card';
import { useCameras, useIncidents, useApp } from '../../context/AppContext';
import './dashboard.css';

export default function KPIGrid() {
  const { cameras, onlineCameras } = useCameras();
  const { activeAlerts, criticalCount, highCount, todayIncidents } = useIncidents();
  const { state } = useApp();

  const kpis = [
    {
      label: 'Active Cameras',
      value: onlineCameras.length,
      meta: `${cameras.length} total · ${onlineCameras.length} online`,
      icon: <Camera size={20} />,
      color: 'var(--info)',
    },
    {
      label: 'Active Alerts',
      value: activeAlerts.length,
      meta: criticalCount > 0
        ? `${criticalCount} critical · ${highCount} high`
        : 'No active alerts',
      icon: <TriangleAlert size={20} />,
      color: activeAlerts.length > 0 ? 'var(--warning)' : 'var(--safe)',
    },
    {
      label: 'Incidents Today',
      value: todayIncidents.length,
      meta: `${todayIncidents.filter(i => i.status === 'REVIEWED').length} reviewed`,
      icon: <FileWarning size={20} />,
      color: 'var(--text-secondary)',
    },
    {
      label: 'AI Status',
      value: state.aiStatus.modelStatus === 'RUNNING' ? 'Active' : 'Offline',
      meta: `${state.aiStatus.modelName} · ${state.aiStatus.inferenceFps} FPS`,
      icon: <Cpu size={20} />,
      color: state.aiStatus.modelStatus === 'RUNNING' ? 'var(--safe)' : 'var(--critical)',
    },
  ];

  return (
    <div className="kpi-grid">
      {kpis.map(kpi => (
        <Card key={kpi.label} variant="kpi">
          <div className="kpi-card">
            <div className="kpi-card__icon" style={{ color: kpi.color, background: `color-mix(in srgb, ${kpi.color} 10%, transparent)` }}>
              {kpi.icon}
            </div>
            <div className="kpi-card__content">
              <span className="kpi-card__label">{kpi.label}</span>
              <span className="kpi-card__value">{kpi.value}</span>
              <span className="kpi-card__meta">{kpi.meta}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
