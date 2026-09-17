// ============================================================
// PORTGUARD AI — SAFETY ANALYTICS PAGE
// ============================================================

import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import Card from '../components/ui/Card';
import { useIncidents, useApp } from '../context/AppContext';
import { EVENT_CONFIG } from '../utils/constants';




export default function SafetyAnalytics() {
  const { incidents, todayIncidents } = useIncidents();
  const { state } = useApp();

  // Incidents by type
  const byType = useMemo(() => {
    const counts: Record<string, number> = {};
    incidents.forEach(inc => {
      const label = EVENT_CONFIG[inc.eventType].shortLabel;
      counts[label] = (counts[label] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [incidents]);

  // Severity distribution
  const bySeverity = useMemo(() => {
    const counts = { Critical: 0, High: 0, Normal: 0 };
    incidents.forEach(inc => { counts[inc.severity === 'CRITICAL' ? 'Critical' : inc.severity === 'HIGH' ? 'High' : 'Normal']++; });
    return [
      { name: 'Critical', value: counts.Critical, color: '#FF3B30' },
      { name: 'High', value: counts.High, color: '#FFB020' },
      { name: 'Normal', value: counts.Normal, color: '#22C55E' },
    ];
  }, [incidents]);

  // Daily trend (mock 7-day)
  const dailyTrend = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('en-US', { weekday: 'short' });
      const count = i === 0 ? todayIncidents.length : Math.floor(Math.random() * 12) + 3;
      days.push({ day: label, incidents: count });
    }
    return days;
  }, [todayIncidents]);

  // Status breakdown
  const openCount = incidents.filter(i => i.status === 'OPEN').length;
  const reviewedCount = incidents.filter(i => i.status === 'REVIEWED').length;

  const chartTooltipStyle = {
    contentStyle: { background: '#14263A', border: '1px solid #24384C', borderRadius: 8, color: '#F4F7FA', fontSize: 13 },
    itemStyle: { color: '#9AAABD' },
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Demo indicator */}
      {state.demoMode && (
        <div style={{ padding: '8px 16px', background: 'var(--warning-bg)', border: '1px solid var(--warning-border)', borderRadius: 8, fontSize: 12, fontWeight: 600, color: 'var(--warning)', textAlign: 'center' }}>
          DEMO DATA — Analytics based on simulated incidents
        </div>
      )}

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
        {[
          { label: 'Total Incidents', value: incidents.length },
          { label: 'Open', value: openCount, color: 'var(--warning)' },
          { label: 'Reviewed', value: reviewedCount, color: 'var(--safe)' },
          { label: 'Today', value: todayIncidents.length, color: 'var(--info)' },
        ].map(m => (
          <Card key={m.label}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{m.label}</span>
            <span style={{ fontSize: 28, fontWeight: 700, color: m.color || 'var(--text-primary)', display: 'block', lineHeight: 1.2, marginTop: 4 }}>{m.value}</span>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-4)' }}>
        {/* Incidents by Type */}
        <Card>
          <h3 className="section-title" style={{ marginBottom: 16 }}>INCIDENTS BY TYPE</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={byType}>
              <CartesianGrid strokeDasharray="3 3" stroke="#24384C" />
              <XAxis dataKey="name" tick={{ fill: '#9AAABD', fontSize: 12 }} axisLine={{ stroke: '#24384C' }} />
              <YAxis tick={{ fill: '#9AAABD', fontSize: 12 }} axisLine={{ stroke: '#24384C' }} />
              <Tooltip {...chartTooltipStyle} />
              <Bar dataKey="count" fill="#38BDF8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Severity Distribution */}
        <Card>
          <h3 className="section-title" style={{ marginBottom: 16 }}>SEVERITY DISTRIBUTION</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={bySeverity} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {bySeverity.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip {...chartTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8 }}>
            {bySeverity.map(s => (
              <span key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
                {s.name} ({s.value})
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Daily Trend */}
      <Card>
        <h3 className="section-title" style={{ marginBottom: 16 }}>DAILY TREND (7 DAYS)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={dailyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#24384C" />
            <XAxis dataKey="day" tick={{ fill: '#9AAABD', fontSize: 12 }} axisLine={{ stroke: '#24384C' }} />
            <YAxis tick={{ fill: '#9AAABD', fontSize: 12 }} axisLine={{ stroke: '#24384C' }} />
            <Tooltip {...chartTooltipStyle} />
            <Line type="monotone" dataKey="incidents" stroke="#38BDF8" strokeWidth={2} dot={{ fill: '#38BDF8', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
