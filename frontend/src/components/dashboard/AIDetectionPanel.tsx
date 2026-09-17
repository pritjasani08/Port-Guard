// ============================================================
// PORTGUARD AI — AI DETECTION PANEL
// YOLOv8 model status and detected objects
// ============================================================

import { Cpu, Zap, Eye, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../ui/Card';
import './dashboard.css';

export default function AIDetectionPanel() {
  const { state } = useApp();
  const ai = state.aiStatus;

  const statusColor = ai.modelStatus === 'RUNNING' ? 'var(--safe)' :
                       ai.modelStatus === 'ERROR' ? 'var(--critical)' : 'var(--text-muted)';

  return (
    <div className="ai-panel">
      <h3 className="section-title">AI DETECTION</h3>
      <Card>
        <div className="ai-panel__grid">
          <div className="ai-panel__stat">
            <div className="ai-panel__stat-icon"><Cpu size={16} /></div>
            <div className="ai-panel__stat-info">
              <span className="ai-panel__stat-label">AI Model</span>
              <span className="ai-panel__stat-value">{ai.modelName}</span>
            </div>
            <span className="ai-panel__status" style={{ color: statusColor }}>
              <span className="status-dot" style={{ background: statusColor }} />
              {ai.modelStatus}
            </span>
          </div>

          <div className="ai-panel__stat">
            <div className="ai-panel__stat-icon"><Zap size={16} /></div>
            <div className="ai-panel__stat-info">
              <span className="ai-panel__stat-label">Inference</span>
              <span className="ai-panel__stat-value">{ai.inferenceFps} FPS</span>
            </div>
            <span className="ai-panel__processing">
              <span className="status-dot status-dot--info" />
              {ai.processingState}
            </span>
          </div>

          <div className="ai-panel__stat">
            <div className="ai-panel__stat-icon"><Eye size={16} /></div>
            <div className="ai-panel__stat-info">
              <span className="ai-panel__stat-label">Objects Detected</span>
              <span className="ai-panel__stat-value">{ai.objectsDetected}</span>
            </div>
          </div>

          <div className="ai-panel__stat">
            <div className="ai-panel__stat-icon"><Activity size={16} /></div>
            <div className="ai-panel__stat-info">
              <span className="ai-panel__stat-label">Avg Confidence</span>
              <span className="ai-panel__stat-value">{ai.averageConfidence}%</span>
            </div>
          </div>
        </div>

        {ai.detectedObjects.length > 0 && (
          <div className="ai-panel__objects">
            <span className="ai-panel__objects-title">Detected Objects</span>
            <div className="ai-panel__objects-list">
              {ai.detectedObjects.map(obj => (
                <span key={obj.label} className="ai-panel__object-tag">
                  {obj.label.replace(/_/g, ' ')} <strong>×{obj.count}</strong>
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
