// ============================================================
// PORTGUARD AI — CORE TYPE SYSTEM
// ============================================================

// ===== ENUMS =====
export type EventType =
  | 'FIRE_DETECTED'
  | 'SMOKE_DETECTED'
  | 'HELMET_MISSING'
  | 'SAFETY_JACKET_MISSING'
  | 'PPE_COMPLIANT';

export type Severity = 'CRITICAL' | 'HIGH' | 'NORMAL';

export type IncidentStatus = 'OPEN' | 'REVIEWED';

export type CameraStatus = 'ONLINE' | 'OFFLINE';

export type ServiceHealth = 'OPERATIONAL' | 'DEGRADED' | 'DOWN';

export type EnvironmentMode = 'demo' | 'live';

// ===== BOUNDING BOX =====
export interface BoundingBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

// ===== DETECTION RESULT (from YOLOv8) =====
export interface DetectionResult {
  id: string;
  label: string; // "PERSON", "HELMET", "SAFETY_JACKET", "FIRE", "SMOKE"
  confidence: number;
  bbox: BoundingBox;
}

// ===== SAFETY EVALUATION (rule engine output) =====
export interface SafetyEvaluation {
  rule: string; // "PPE_CHECK", "FIRE_DETECTION", "SMOKE_DETECTION"
  result: 'PASS' | 'FAIL';
  severity: Severity;
  reason: string; // "Helmet not detected on person"
  frameCount?: number; // Temporal: confirmed across N frames
  detectionStability?: number; // 0-100
}

// ===== EVIDENCE =====
export interface Evidence {
  snapshotUrl?: string;
  detections: DetectionResult[];
  safetyEvaluation: SafetyEvaluation;
}

// ===== DETECTION EVENT (incident/alert) =====
export interface DetectionEvent {
  id: string;
  eventType: EventType;
  severity: Severity;
  cameraId: string;
  cameraName: string;
  zone: string;
  timestamp: string;
  confidence: number;
  evidence?: Evidence;
  status: IncidentStatus;
  frameCount?: number;
  detectionStability?: number;
  isDemo?: boolean;
}

// ===== CAMERA =====
export interface Camera {
  id: string;
  name: string;
  zone: string;
  status: CameraStatus;
  fps: number;
  lastUpdate: string;
  detections: DetectionResult[];
  currentSafetyStatus: Severity;
  streamUrl?: string;
  thumbnailUrl?: string;
}

// ===== SYSTEM =====
export interface SystemService {
  id: string;
  name: string;
  status: ServiceHealth;
  lastCheck: string;
  details?: string;
}

export interface SystemInfo {
  services: SystemService[];
  modelName: string;
  modelVersion: string;
  connectedCameras: number;
  totalCameras: number;
  serverUptime: string;
  lastSync: string;
  processingFps: number;
  apiLatency?: number;
}

// ===== AI DETECTION STATUS =====
export interface AIDetectionStatus {
  modelName: string;
  modelStatus: 'RUNNING' | 'STOPPED' | 'ERROR';
  inferenceFps: number;
  processingState: 'LIVE' | 'PAUSED' | 'OFFLINE';
  objectsDetected: number;
  averageConfidence: number;
  detectedObjects: { label: string; count: number }[];
}

// ===== NOTIFICATIONS =====
export interface AppNotification {
  id: string;
  eventType: EventType;
  severity: Severity;
  cameraId: string;
  cameraName: string;
  zone: string;
  timestamp: string;
  read: boolean;
  incidentId: string;
}

// ===== FILTERS =====
export interface IncidentFilters {
  eventType: EventType | 'ALL';
  severity: Severity | 'ALL';
  status: IncidentStatus | 'ALL';
  cameraId: string;
  zone: string;
  search: string;
}

// ===== SAFETY RULE (for visualization) =====
export interface SafetyRule {
  id: string;
  name: string;
  description: string;
  detectionInput: string;
  evaluationStep: string;
  possibleOutcome: string;
  severity: Severity;
  eventType: EventType;
}

// ===== APP STATE =====
export interface AppState {
  incidents: DetectionEvent[];
  cameras: Camera[];
  notifications: AppNotification[];
  systemInfo: SystemInfo;
  aiStatus: AIDetectionStatus;
  demoMode: boolean;
  sidebarCollapsed: boolean;
  selectedCamera: string | null;
  environmentMode: EnvironmentMode;
}

export type AppAction =
  | { type: 'SET_INCIDENTS'; payload: DetectionEvent[] }
  | { type: 'ADD_INCIDENT'; payload: DetectionEvent }
  | { type: 'UPDATE_INCIDENT_STATUS'; payload: { id: string; status: IncidentStatus } }
  | { type: 'SET_CAMERAS'; payload: Camera[] }
  | { type: 'UPDATE_CAMERA'; payload: Partial<Camera> & { id: string } }
  | { type: 'ADD_NOTIFICATION'; payload: AppNotification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'TOGGLE_DEMO_MODE' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SELECTED_CAMERA'; payload: string | null }
  | { type: 'UPDATE_AI_STATUS'; payload: Partial<AIDetectionStatus> }
  | { type: 'CLEAR_DEMO_DATA' }
  | { type: 'ADD_DETECTION_TO_CAMERA'; payload: { cameraId: string; detection: DetectionResult } }
  | { type: 'UPDATE_CAMERA_SAFETY'; payload: { cameraId: string; status: Severity } };
