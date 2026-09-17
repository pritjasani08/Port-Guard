// ============================================================
// PORTGUARD AI — LIVE CAMERA PANEL (Dashboard)
// ============================================================

import { useCameras } from '../../context/AppContext';
import DetectionOverlay from '../monitoring/DetectionOverlay';
import './dashboard.css';

export default function LiveCamera() {
  const { selectedCamera, cameras, selectCamera } = useCameras();
  const camera = selectedCamera;

  if (!camera) return null;

  return (
    <div className="live-camera">
      <div className="live-camera__header">
        <div className="live-camera__info">
          <span className="live-camera__id">{camera.id}</span>
          <span className="live-camera__name">{camera.name}</span>
          <span className="live-camera__zone">{camera.zone}</span>
        </div>
        <div className="live-camera__indicators">
          <span className="live-camera__live">
            <span className="live-dot" /> LIVE
          </span>
          <span className="live-camera__model">YOLOv8 · {camera.fps} FPS</span>
          <select
            className="live-camera__select"
            value={camera.id}
            onChange={e => selectCamera(e.target.value)}
            aria-label="Select camera"
          >
            {cameras.filter(c => c.status === 'ONLINE').map(c => (
              <option key={c.id} value={c.id}>{c.id} — {c.zone}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="live-camera__feed">
        <div className="cctv-frame">
          <div className="cctv-grid-overlay" />
          {/* CCTV timestamp overlay */}
          <div className="live-camera__timestamp">
            {new Date().toLocaleTimeString('en-US', { hour12: false })}
          </div>
          {/* Camera ID overlay */}
          <div className="live-camera__cam-overlay">{camera.id}</div>
          {/* Detection overlays */}
          {camera.detections.length > 0 && (
            <DetectionOverlay detections={camera.detections} />
          )}
        </div>
      </div>
    </div>
  );
}
