// ============================================================
// PORTGUARD AI — SYSTEM STATUS PAGE
// ============================================================

import { Server, Cpu, Camera, Bell, Database, Globe, Activity, Clock, Wifi } from 'lucide-react';
import Card from '../components/ui/Card';
import { useApp } from '../context/AppContext';
import { formatTime } from '../utils/formatting';
import type { ServiceHealth } from '../types';

const SERVICE_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  'AI Model': Cpu,
  'Video Processing': Activity,
  'Camera Network': Camera,
  'Alert Engine': Bell,
  'Database': Database,
  'API': Globe,
};

const STATUS_COLORS: Record<ServiceHealth, string> = {
  OPERATIONAL: 'var(--safe)',
  DEGRADED: 'var(--warning)',
  DOWN: 'var(--critical)',
};

export default function SystemStatus() {
  const { state } = useApp();
  const sys = state.systemInfo;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Service Grid */}
      <div>
        <h3 className="section-title">SERVICES</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
          {sys.services.map(svc => {
            const Icon = SERVICE_ICONS[svc.name] || Server;
            return (
              <Card key={svc.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 'var(--radius)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: STATUS_COLORS[svc.status] }}>
                    <Icon size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{svc.name}</div>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{svc.details}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                    <span className="status-dot" style={{ background: STATUS_COLORS[svc.status] }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: STATUS_COLORS[svc.status], textTransform: 'uppercase' }}>
                      {svc.status}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* System Details */}
      <div>
        <h3 className="section-title">SYSTEM INFORMATION</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)' }}>
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {[
                { icon: <Cpu size={14} />, label: 'Model', value: `${sys.modelName} (${sys.modelVersion})` },
                { icon: <Activity size={14} />, label: 'Processing FPS', value: `${sys.processingFps}` },
                { icon: <Camera size={14} />, label: 'Connected Cameras', value: `${sys.connectedCameras} / ${sys.totalCameras}` },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{item.icon}</span>
                  <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', width: 140 }}>{item.label}</span>
                  <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-primary)', fontWeight: 500 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {[
                { icon: <Clock size={14} />, label: 'Server Uptime', value: sys.serverUptime },
                { icon: <Wifi size={14} />, label: 'Last Sync', value: sys.lastSync ? formatTime(sys.lastSync) : '—' },
                { icon: <Globe size={14} />, label: 'API Latency', value: sys.apiLatency ? `${sys.apiLatency}ms` : '—' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{item.icon}</span>
                  <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', width: 140 }}>{item.label}</span>
                  <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-primary)', fontWeight: 500 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {state.demoMode && (
        <div style={{ padding: '8px 16px', background: 'var(--warning-bg)', border: '1px solid var(--warning-border)', borderRadius: 8, fontSize: 12, fontWeight: 600, color: 'var(--warning)', textAlign: 'center' }}>
          DEMO ENVIRONMENT — System information is simulated
        </div>
      )}
    </div>
  );
}
