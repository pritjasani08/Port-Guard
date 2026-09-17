// ============================================================
// PORTGUARD AI — CAMERA CARD
// ============================================================

import { WifiOff } from 'lucide-react';
import { formatTime } from '../../utils/formatting';
import type { Camera as CameraType } from '../../types';
import DetectionOverlay from './DetectionOverlay';
import './monitoring.css';

interface Props {
  camera: CameraType;
  onClick?: () => void;
  compact?: boolean;
}

export default function CameraCard({ camera, onClick, compact = false }: Props) {
  const isOffline = camera.status === 'OFFLINE';

  return (
    <div
      className={`camera-card ${isOffline ? 'camera-card--offline' : ''} ${compact ? 'camera-card--compact' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick?.()}
      aria-label={`${camera.id} - ${camera.name} - ${camera.status}`}
    >
      <div className="camera-card__feed">
        {isOffline ? (
          <div className="camera-card__offline">
            <WifiOff size={24} />
            <span>OFFLINE</span>
            <span className="camera-card__offline-time">Last seen: {formatTime(camera.lastUpdate)}</span>
          </div>
        ) : (
          <div className="cctv-frame camera-card__cctv">
            <div className="cctv-grid-overlay" />
            <div className="camera-card__cam-id">{camera.id}</div>
            {camera.detections.length > 0 && (
              <DetectionOverlay detections={camera.detections} />
            )}
          </div>
        )}
      </div>

      <div className="camera-card__info">
        <div className="camera-card__header">
          <span className="camera-card__id">{camera.id}</span>
          <span className={`camera-card__status ${isOffline ? 'camera-card__status--offline' : 'camera-card__status--online'}`}>
            <span className={`status-dot ${isOffline ? 'status-dot--offline' : 'status-dot--online'}`} />
            {camera.status}
          </span>
        </div>
        <span className="camera-card__name">{camera.name}</span>
        <span className="camera-card__zone">{camera.zone}</span>
        {!isOffline && !compact && (
          <span className="camera-card__fps">{camera.fps} FPS · Updated {formatTime(camera.lastUpdate)}</span>
        )}
      </div>
    </div>
  );
}
