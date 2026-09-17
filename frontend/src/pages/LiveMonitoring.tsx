// ============================================================
// PORTGUARD AI — LIVE MONITORING PAGE
// ============================================================

import { useState } from 'react';
import { Grid3x3, Monitor, Volume2, VolumeX } from 'lucide-react';
import { useCameras } from '../context/AppContext';
import CameraCard from '../components/monitoring/CameraCard';
import DetectionOverlay from '../components/monitoring/DetectionOverlay';
import '../components/monitoring/monitoring.css';

export default function LiveMonitoring() {
  const { selectedCamera, selectCamera, onlineCameras } = useCameras();
  const [gridView, setGridView] = useState(false);
  const [alertSound, setAlertSound] = useState(true);
  const primary = selectedCamera || onlineCameras[0];
  const secondaryCameras = onlineCameras.filter(c => c.id !== primary?.id).slice(0, 4);

  if (gridView) {
    return (
      <div className="animate-fade-in">
        <div className="monitoring-controls">
          <button className="monitoring-controls__btn" onClick={() => setGridView(false)}>
            <Monitor size={14} /> Single View
          </button>
          <button className="monitoring-controls__btn monitoring-controls__btn--active">
            <Grid3x3 size={14} /> Grid View
          </button>
          <button className="monitoring-controls__btn" onClick={() => setAlertSound(!alertSound)}>
            {alertSound ? <Volume2 size={14} /> : <VolumeX size={14} />}
            Alert Sound
          </button>
          <span className="cameras-filters__count">{onlineCameras.length} cameras online</span>
        </div>
        <div className="camera-grid">
          {onlineCameras.map(cam => (
            <CameraCard key={cam.id} camera={cam} onClick={() => { selectCamera(cam.id); setGridView(false); }} compact />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Controls */}
      <div className="monitoring-controls">
        <button className="monitoring-controls__btn monitoring-controls__btn--active">
          <Monitor size={14} /> Single View
        </button>
        <button className="monitoring-controls__btn" onClick={() => setGridView(true)}>
          <Grid3x3 size={14} /> Grid View
        </button>
        <button className="monitoring-controls__btn" onClick={() => setAlertSound(!alertSound)}>
          {alertSound ? <Volume2 size={14} /> : <VolumeX size={14} />}
          Alert Sound
        </button>
        <select
          className="live-camera__select"
          value={primary?.id || ''}
          onChange={e => selectCamera(e.target.value)}
          aria-label="Select camera"
        >
          {onlineCameras.map(c => (
            <option key={c.id} value={c.id}>{c.id} — {c.zone}</option>
          ))}
        </select>
        <span className="cameras-filters__count">{onlineCameras.length} cameras online</span>
      </div>

      {/* Monitoring Wall */}
      <div className="monitoring-wall">
        <div className="monitoring-wall__primary">
          {primary && (
            <div className="live-camera">
              <div className="live-camera__header">
                <div className="live-camera__info">
                  <span className="live-camera__id">{primary.id}</span>
                  <span className="live-camera__name">{primary.name}</span>
                  <span className="live-camera__zone">{primary.zone}</span>
                </div>
                <div className="live-camera__indicators">
                  <span className="live-camera__live"><span className="live-dot" /> LIVE</span>
                  <span className="live-camera__model">YOLOv8 · {primary.fps} FPS</span>
                </div>
              </div>
              <div className="live-camera__feed">
                <div className="cctv-frame" style={{ aspectRatio: '16/9' }}>
                  <div className="cctv-grid-overlay" />
                  <div className="live-camera__timestamp">{new Date().toLocaleTimeString('en-US', { hour12: false })}</div>
                  <div className="live-camera__cam-overlay">{primary.id}</div>
                  {primary.detections.length > 0 && <DetectionOverlay detections={primary.detections} />}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="monitoring-wall__secondary">
          {secondaryCameras.map(cam => (
            <CameraCard key={cam.id} camera={cam} onClick={() => selectCamera(cam.id)} compact />
          ))}
        </div>
      </div>
    </div>
  );
}
