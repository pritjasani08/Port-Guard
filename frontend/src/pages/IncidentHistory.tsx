// ============================================================
// PORTGUARD AI — INCIDENT HISTORY PAGE
// ============================================================

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useIncidents } from '../context/AppContext';
import { SeverityBadge, EventBadge } from '../components/ui/SeverityBadge';
import EmptyState from '../components/ui/EmptyState';
import IncidentDrawer from '../components/alerts/IncidentDrawer';
import { formatTime, formatConfidenceDecimal } from '../utils/formatting';
import type { DetectionEvent, EventType, Severity, IncidentStatus } from '../types';
import '../components/alerts/alerts.css';

type EventFilter = EventType | 'ALL';
type SevFilter = Severity | 'ALL';
type StatusFilter = IncidentStatus | 'ALL';

export default function IncidentHistory() {
  const { incidents, acknowledgeIncident } = useIncidents();
  const [eventFilter, setEventFilter] = useState<EventFilter>('ALL');
  const [sevFilter, setSevFilter] = useState<SevFilter>('ALL');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [search, setSearch] = useState('');
  const [selectedIncident, setSelectedIncident] = useState<DetectionEvent | null>(null);

  const eventTabs: { key: EventFilter; label: string }[] = [
    { key: 'ALL', label: 'All' },
    { key: 'FIRE_DETECTED', label: 'Fire' },
    { key: 'SMOKE_DETECTED', label: 'Smoke' },
    { key: 'HELMET_MISSING', label: 'Helmet' },
    { key: 'SAFETY_JACKET_MISSING', label: 'Jacket' },
    { key: 'PPE_COMPLIANT', label: 'Compliant' },
  ];

  const filtered = useMemo(() => {
    let result = [...incidents];
    if (eventFilter !== 'ALL') result = result.filter(i => i.eventType === eventFilter);
    if (sevFilter !== 'ALL') result = result.filter(i => i.severity === sevFilter);
    if (statusFilter !== 'ALL') result = result.filter(i => i.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(i =>
        i.cameraName.toLowerCase().includes(q) ||
        i.zone.toLowerCase().includes(q) ||
        i.cameraId.toLowerCase().includes(q) ||
        i.eventType.toLowerCase().includes(q)
      );
    }
    return result;
  }, [incidents, eventFilter, sevFilter, statusFilter, search]);

  const openCount = incidents.filter(i => i.status === 'OPEN').length;
  const reviewedCount = incidents.filter(i => i.status === 'REVIEWED').length;

  return (
    <div className="animate-fade-in">
      {/* Event Type Tabs */}
      <div className="incident-filters">
        <div className="incident-filters__tabs">
          {eventTabs.map(tab => (
            <button
              key={tab.key}
              className={`incident-filters__tab ${eventFilter === tab.key ? 'incident-filters__tab--active' : ''}`}
              onClick={() => setEventFilter(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <select value={sevFilter} onChange={e => setSevFilter(e.target.value as SevFilter)} aria-label="Filter severity">
          <option value="ALL">All Severity</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="NORMAL">Normal</option>
        </select>

        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as StatusFilter)} aria-label="Filter status">
          <option value="ALL">All Status</option>
          <option value="OPEN">Open ({openCount})</option>
          <option value="REVIEWED">Reviewed ({reviewedCount})</option>
        </select>

        <div className="incident-filters__search" style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search incidents..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 32, width: '100%' }}
            aria-label="Search incidents"
          />
        </div>

        <span className="incident-filters__count">{filtered.length} incidents</span>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState variant="no-incidents" />
      ) : (
        <div className="incident-table-wrap">
          <table className="incident-table">
            <thead>
              <tr>
                <th>Severity</th>
                <th>Event</th>
                <th>Camera</th>
                <th>Zone</th>
                <th>Time</th>
                <th>Confidence</th>
                <th>Frames</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inc => (
                <tr key={inc.id} onClick={() => setSelectedIncident(inc)}>
                  <td><SeverityBadge severity={inc.severity} size="sm" /></td>
                  <td><EventBadge eventType={inc.eventType} size="sm" /></td>
                  <td>{inc.cameraId}</td>
                  <td>{inc.zone}</td>
                  <td className="incident-table__confidence">{formatTime(inc.timestamp)}</td>
                  <td className="incident-table__confidence">{formatConfidenceDecimal(inc.confidence)}</td>
                  <td>{inc.frameCount || '—'}</td>
                  <td>
                    <span style={{
                      color: inc.status === 'OPEN' ? 'var(--warning)' : 'var(--safe)',
                      fontWeight: 600,
                      fontSize: 'var(--font-xs)',
                    }}>
                      {inc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <IncidentDrawer
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onAcknowledge={acknowledgeIncident}
      />
    </div>
  );
}
