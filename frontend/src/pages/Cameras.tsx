// ============================================================
// PORTGUARD AI — CAMERAS PAGE
// ============================================================

import { useState } from 'react';
import { useCameras } from '../context/AppContext';
import CameraCard from '../components/monitoring/CameraCard';
import '../components/monitoring/monitoring.css';

export default function Cameras() {
  const { cameras, onlineCameras, offlineCameras, selectCamera } = useCameras();
  const [zoneFilter, setZoneFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ONLINE' | 'OFFLINE'>('ALL');

  const zones = [...new Set(cameras.map(c => c.zone))];

  let filtered = cameras;
  if (zoneFilter !== 'ALL') filtered = filtered.filter(c => c.zone === zoneFilter);
  if (statusFilter !== 'ALL') filtered = filtered.filter(c => c.status === statusFilter);

  return (
    <div className="animate-fade-in">
      <div className="cameras-filters">
        <select value={zoneFilter} onChange={e => setZoneFilter(e.target.value)} aria-label="Filter by zone">
          <option value="ALL">All Zones</option>
          {zones.map(z => <option key={z} value={z}>{z}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as typeof statusFilter)} aria-label="Filter by status">
          <option value="ALL">All Status</option>
          <option value="ONLINE">Online</option>
          <option value="OFFLINE">Offline</option>
        </select>
        <span className="cameras-filters__count">
          {filtered.length} cameras · {onlineCameras.length} online · {offlineCameras.length} offline
        </span>
      </div>

      <div className="camera-grid">
        {filtered.map(cam => (
          <CameraCard key={cam.id} camera={cam} onClick={() => selectCamera(cam.id)} />
        ))}
      </div>
    </div>
  );
}
