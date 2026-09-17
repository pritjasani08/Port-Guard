// ============================================================
// PORTGUARD AI — SETTINGS PAGE
// ============================================================

import { useState } from 'react';
import { Bell, Volume2, Monitor, RotateCcw } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useDemoMode } from '../context/AppContext';

export default function Settings() {
  const { demoMode, toggleDemo, clearDemoData } = useDemoMode();
  const [criticalNotif, setCriticalNotif] = useState(true);
  const [highNotif, setHighNotif] = useState(true);
  const [alertSound, setAlertSound] = useState(true);
  const [criticalPulse, setCriticalPulse] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');

  const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--border-light)', cursor: 'pointer' }}>
      <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-primary)' }}>{label}</span>
      <div
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onClick={() => onChange(!checked)}
        onKeyDown={e => e.key === 'Enter' && onChange(!checked)}
        style={{
          width: 40, height: 22, borderRadius: 11, padding: 2,
          background: checked ? 'var(--info)' : 'var(--border)',
          transition: 'background var(--transition)', cursor: 'pointer',
          display: 'flex', alignItems: 'center',
        }}
      >
        <div style={{
          width: 18, height: 18, borderRadius: '50%', background: 'white',
          transition: 'transform var(--transition)',
          transform: checked ? 'translateX(18px)' : 'translateX(0)',
        }} />
      </div>
    </label>
  );

  return (
    <div className="animate-fade-in" style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Notifications */}
      <div>
        <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bell size={14} /> NOTIFICATIONS
        </h3>
        <Card>
          <Toggle checked={criticalNotif} onChange={setCriticalNotif} label="Critical alerts" />
          <Toggle checked={highNotif} onChange={setHighNotif} label="High-priority alerts" />
        </Card>
      </div>

      {/* Alert Behavior */}
      <div>
        <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Volume2 size={14} /> ALERT BEHAVIOR
        </h3>
        <Card>
          <Toggle checked={alertSound} onChange={setAlertSound} label="Alert sound" />
          <Toggle checked={criticalPulse} onChange={setCriticalPulse} label="Critical alert pulse animation" />
          <Toggle checked={autoRefresh} onChange={setAutoRefresh} label="Auto-refresh dashboard" />
        </Card>
      </div>

      {/* Display */}
      <div>
        <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Monitor size={14} /> DISPLAY
        </h3>
        <Card>
          <div style={{ padding: 'var(--space-3) 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-primary)' }}>Information density</span>
            <div style={{ display: 'flex', gap: 4, background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', padding: 2 }}>
              {(['comfortable', 'compact'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setDensity(d)}
                  style={{
                    padding: '4px 12px', fontSize: 'var(--font-xs)', fontWeight: 500, borderRadius: 'var(--radius-sm)',
                    background: density === d ? 'var(--bg-elevated)' : 'transparent',
                    color: density === d ? 'var(--text-primary)' : 'var(--text-muted)',
                    transition: 'all var(--transition)', border: 'none', cursor: 'pointer',
                  }}
                >
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Demo */}
      <div>
        <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <RotateCcw size={14} /> DEMO
        </h3>
        <Card>
          <Toggle checked={demoMode} onChange={toggleDemo} label="Demo mode" />
          <div style={{ paddingTop: 'var(--space-3)' }}>
            <Button variant="secondary" size="sm" onClick={clearDemoData} icon={<RotateCcw size={14} />}>
              Reset demo data
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
