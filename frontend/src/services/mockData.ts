// ============================================================
// PORTGUARD AI — MOCK DATA
// All demo values clearly labeled. Never present as live data.
// ============================================================

import type {
  Camera,
  DetectionEvent,
  DetectionResult,
  SystemInfo,
  AIDetectionStatus,
} from '../types';

// ===== CAMERAS (24 total: 22 online, 2 offline) =====
export const MOCK_CAMERAS: Camera[] = [
  { id: 'CAM-01', name: 'Container Yard A - North', zone: 'Container Yard A', status: 'ONLINE', fps: 30, lastUpdate: new Date().toISOString(), detections: [], currentSafetyStatus: 'NORMAL' },
  { id: 'CAM-02', name: 'Container Yard A - South', zone: 'Container Yard A', status: 'ONLINE', fps: 30, lastUpdate: new Date().toISOString(), detections: [], currentSafetyStatus: 'NORMAL' },
  { id: 'CAM-03', name: 'Container Yard A - Gate', zone: 'Container Yard A', status: 'ONLINE', fps: 28, lastUpdate: new Date().toISOString(), detections: [], currentSafetyStatus: 'NORMAL' },
  { id: 'CAM-04', name: 'Container Yard B - West', zone: 'Container Yard B', status: 'ONLINE', fps: 30, lastUpdate: new Date().toISOString(), detections: [], currentSafetyStatus: 'NORMAL' },
  { id: 'CAM-05', name: 'Container Yard B - East', zone: 'Container Yard B', status: 'ONLINE', fps: 29, lastUpdate: new Date().toISOString(), detections: [], currentSafetyStatus: 'NORMAL' },
  { id: 'CAM-06', name: 'Container Yard B - Crane', zone: 'Container Yard B', status: 'ONLINE', fps: 25, lastUpdate: new Date().toISOString(), detections: [], currentSafetyStatus: 'NORMAL' },
  {
    id: 'CAM-07', name: 'Container Yard B - Main', zone: 'Container Yard B', status: 'ONLINE', fps: 28, lastUpdate: new Date().toISOString(),
    detections: [
      { id: 'd1', label: 'PERSON', confidence: 0.96, bbox: { x: 20, y: 30, w: 15, h: 35 } },
      { id: 'd2', label: 'HELMET', confidence: 0.91, bbox: { x: 22, y: 28, w: 8, h: 8 } },
      { id: 'd3', label: 'SAFETY_JACKET', confidence: 0.88, bbox: { x: 21, y: 38, w: 12, h: 18 } },
    ] as DetectionResult[],
    currentSafetyStatus: 'NORMAL',
  },
  { id: 'CAM-08', name: 'Loading Zone A - Dock', zone: 'Loading Zone A', status: 'ONLINE', fps: 30, lastUpdate: new Date().toISOString(), detections: [], currentSafetyStatus: 'NORMAL' },
  { id: 'CAM-09', name: 'Loading Zone A - Bay', zone: 'Loading Zone A', status: 'ONLINE', fps: 28, lastUpdate: new Date().toISOString(), detections: [], currentSafetyStatus: 'NORMAL' },
  { id: 'CAM-10', name: 'Loading Zone B - Main', zone: 'Loading Zone B', status: 'ONLINE', fps: 30, lastUpdate: new Date().toISOString(), detections: [], currentSafetyStatus: 'NORMAL' },
  { id: 'CAM-11', name: 'Loading Zone B - Ramp', zone: 'Loading Zone B', status: 'ONLINE', fps: 27, lastUpdate: new Date().toISOString(), detections: [], currentSafetyStatus: 'NORMAL' },
  {
    id: 'CAM-12', name: 'Loading Zone A - Entry', zone: 'Loading Zone A', status: 'ONLINE', fps: 30, lastUpdate: new Date().toISOString(),
    detections: [
      { id: 'd4', label: 'PERSON', confidence: 0.94, bbox: { x: 40, y: 35, w: 14, h: 32 } },
      { id: 'd5', label: 'PERSON', confidence: 0.89, bbox: { x: 65, y: 40, w: 13, h: 30 } },
    ] as DetectionResult[],
    currentSafetyStatus: 'NORMAL',
  },
  { id: 'CAM-13', name: 'Cargo Area - Section 1', zone: 'Cargo Area', status: 'ONLINE', fps: 30, lastUpdate: new Date().toISOString(), detections: [], currentSafetyStatus: 'NORMAL' },
  { id: 'CAM-14', name: 'Cargo Area - Section 2', zone: 'Cargo Area', status: 'ONLINE', fps: 29, lastUpdate: new Date().toISOString(), detections: [], currentSafetyStatus: 'NORMAL' },
  { id: 'CAM-15', name: 'Cargo Area - Forklift Zone', zone: 'Cargo Area', status: 'ONLINE', fps: 28, lastUpdate: new Date().toISOString(), detections: [], currentSafetyStatus: 'NORMAL' },
  { id: 'CAM-16', name: 'Gate Entrance - Main', zone: 'Gate Entrance', status: 'ONLINE', fps: 30, lastUpdate: new Date().toISOString(), detections: [], currentSafetyStatus: 'NORMAL' },
  { id: 'CAM-17', name: 'Gate Entrance - Vehicle', zone: 'Gate Entrance', status: 'ONLINE', fps: 30, lastUpdate: new Date().toISOString(), detections: [], currentSafetyStatus: 'NORMAL' },
  { id: 'CAM-18', name: 'Gate Exit', zone: 'Gate Exit', status: 'ONLINE', fps: 30, lastUpdate: new Date().toISOString(), detections: [], currentSafetyStatus: 'NORMAL' },
  { id: 'CAM-19', name: 'Berth 1 - Quay', zone: 'Berth 1', status: 'ONLINE', fps: 25, lastUpdate: new Date().toISOString(), detections: [], currentSafetyStatus: 'NORMAL' },
  { id: 'CAM-20', name: 'Berth 1 - Gangway', zone: 'Berth 1', status: 'ONLINE', fps: 28, lastUpdate: new Date().toISOString(), detections: [], currentSafetyStatus: 'NORMAL' },
  { id: 'CAM-21', name: 'Berth 2 - Quay', zone: 'Berth 2', status: 'ONLINE', fps: 26, lastUpdate: new Date().toISOString(), detections: [], currentSafetyStatus: 'NORMAL' },
  { id: 'CAM-22', name: 'Warehouse - Interior', zone: 'Warehouse', status: 'ONLINE', fps: 30, lastUpdate: new Date().toISOString(), detections: [], currentSafetyStatus: 'NORMAL' },
  // Offline cameras
  { id: 'CAM-23', name: 'Fuel Storage - Perimeter', zone: 'Fuel Storage', status: 'OFFLINE', fps: 0, lastUpdate: new Date(Date.now() - 3600000).toISOString(), detections: [], currentSafetyStatus: 'NORMAL' },
  { id: 'CAM-24', name: 'Admin Block - Parking', zone: 'Admin Block', status: 'OFFLINE', fps: 0, lastUpdate: new Date(Date.now() - 7200000).toISOString(), detections: [], currentSafetyStatus: 'NORMAL' },
];

// ===== HELPER: Create timestamps relative to now =====
function minutesAgo(m: number): string {
  return new Date(Date.now() - m * 60000).toISOString();
}

// ===== INCIDENTS (17 demo incidents covering all event types) =====
export const MOCK_INCIDENTS: DetectionEvent[] = [
  {
    id: 'INC-001', eventType: 'PPE_COMPLIANT', severity: 'NORMAL', cameraId: 'CAM-07', cameraName: 'Container Yard B - Main', zone: 'Container Yard B',
    timestamp: minutesAgo(2), confidence: 0.94, status: 'REVIEWED', frameCount: 15, detectionStability: 96,
    evidence: { snapshotUrl: undefined, detections: [{ id: 'e1', label: 'PERSON', confidence: 0.96, bbox: { x: 20, y: 30, w: 15, h: 35 } }, { id: 'e2', label: 'HELMET', confidence: 0.91, bbox: { x: 22, y: 28, w: 8, h: 8 } }], safetyEvaluation: { rule: 'PPE_CHECK', result: 'PASS', severity: 'NORMAL', reason: 'All required PPE detected on person', frameCount: 15, detectionStability: 96 } },
    isDemo: true,
  },
  {
    id: 'INC-002', eventType: 'HELMET_MISSING', severity: 'HIGH', cameraId: 'CAM-12', cameraName: 'Loading Zone A - Entry', zone: 'Loading Zone A',
    timestamp: minutesAgo(5), confidence: 0.94, status: 'OPEN', frameCount: 12, detectionStability: 88,
    evidence: { snapshotUrl: undefined, detections: [{ id: 'e3', label: 'PERSON', confidence: 0.94, bbox: { x: 40, y: 35, w: 14, h: 32 } }], safetyEvaluation: { rule: 'PPE_CHECK', result: 'FAIL', severity: 'HIGH', reason: 'Helmet not detected on person', frameCount: 12, detectionStability: 88 } },
    isDemo: true,
  },
  {
    id: 'INC-003', eventType: 'SAFETY_JACKET_MISSING', severity: 'HIGH', cameraId: 'CAM-14', cameraName: 'Cargo Area - Section 2', zone: 'Cargo Area',
    timestamp: minutesAgo(8), confidence: 0.91, status: 'OPEN', frameCount: 10, detectionStability: 82,
    evidence: { snapshotUrl: undefined, detections: [{ id: 'e4', label: 'PERSON', confidence: 0.92, bbox: { x: 50, y: 25, w: 16, h: 36 } }], safetyEvaluation: { rule: 'PPE_CHECK', result: 'FAIL', severity: 'HIGH', reason: 'Safety jacket not detected on person', frameCount: 10, detectionStability: 82 } },
    isDemo: true,
  },
  {
    id: 'INC-004', eventType: 'SMOKE_DETECTED', severity: 'HIGH', cameraId: 'CAM-19', cameraName: 'Berth 1 - Quay', zone: 'Berth 1',
    timestamp: minutesAgo(12), confidence: 0.78, status: 'REVIEWED', frameCount: 8, detectionStability: 72,
    evidence: { snapshotUrl: undefined, detections: [{ id: 'e5', label: 'SMOKE', confidence: 0.78, bbox: { x: 10, y: 5, w: 40, h: 30 } }], safetyEvaluation: { rule: 'SMOKE_DETECTION', result: 'FAIL', severity: 'HIGH', reason: 'Smoke detected in camera feed', frameCount: 8, detectionStability: 72 } },
    isDemo: true,
  },
  {
    id: 'INC-005', eventType: 'PPE_COMPLIANT', severity: 'NORMAL', cameraId: 'CAM-08', cameraName: 'Loading Zone A - Dock', zone: 'Loading Zone A',
    timestamp: minutesAgo(15), confidence: 0.97, status: 'REVIEWED', frameCount: 20, detectionStability: 98,
    evidence: { snapshotUrl: undefined, detections: [{ id: 'e6', label: 'PERSON', confidence: 0.97, bbox: { x: 30, y: 20, w: 14, h: 34 } }, { id: 'e7', label: 'HELMET', confidence: 0.95, bbox: { x: 32, y: 18, w: 8, h: 8 } }, { id: 'e8', label: 'SAFETY_JACKET', confidence: 0.93, bbox: { x: 31, y: 28, w: 12, h: 18 } }], safetyEvaluation: { rule: 'PPE_CHECK', result: 'PASS', severity: 'NORMAL', reason: 'All required PPE detected on person', frameCount: 20, detectionStability: 98 } },
    isDemo: true,
  },
  {
    id: 'INC-006', eventType: 'HELMET_MISSING', severity: 'HIGH', cameraId: 'CAM-04', cameraName: 'Container Yard B - West', zone: 'Container Yard B',
    timestamp: minutesAgo(20), confidence: 0.89, status: 'REVIEWED', frameCount: 9, detectionStability: 80,
    evidence: { snapshotUrl: undefined, detections: [{ id: 'e9', label: 'PERSON', confidence: 0.91, bbox: { x: 55, y: 30, w: 13, h: 33 } }], safetyEvaluation: { rule: 'PPE_CHECK', result: 'FAIL', severity: 'HIGH', reason: 'Helmet not detected on person', frameCount: 9, detectionStability: 80 } },
    isDemo: true,
  },
  {
    id: 'INC-007', eventType: 'PPE_COMPLIANT', severity: 'NORMAL', cameraId: 'CAM-16', cameraName: 'Gate Entrance - Main', zone: 'Gate Entrance',
    timestamp: minutesAgo(25), confidence: 0.93, status: 'REVIEWED', frameCount: 14, detectionStability: 91,
    isDemo: true,
  },
  {
    id: 'INC-008', eventType: 'SAFETY_JACKET_MISSING', severity: 'HIGH', cameraId: 'CAM-13', cameraName: 'Cargo Area - Section 1', zone: 'Cargo Area',
    timestamp: minutesAgo(30), confidence: 0.86, status: 'REVIEWED', frameCount: 7, detectionStability: 75,
    isDemo: true,
  },
  {
    id: 'INC-009', eventType: 'PPE_COMPLIANT', severity: 'NORMAL', cameraId: 'CAM-10', cameraName: 'Loading Zone B - Main', zone: 'Loading Zone B',
    timestamp: minutesAgo(35), confidence: 0.95, status: 'REVIEWED', frameCount: 18, detectionStability: 95,
    isDemo: true,
  },
  {
    id: 'INC-010', eventType: 'HELMET_MISSING', severity: 'HIGH', cameraId: 'CAM-22', cameraName: 'Warehouse - Interior', zone: 'Warehouse',
    timestamp: minutesAgo(42), confidence: 0.92, status: 'REVIEWED', frameCount: 11, detectionStability: 85,
    isDemo: true,
  },
  {
    id: 'INC-011', eventType: 'PPE_COMPLIANT', severity: 'NORMAL', cameraId: 'CAM-01', cameraName: 'Container Yard A - North', zone: 'Container Yard A',
    timestamp: minutesAgo(50), confidence: 0.96, status: 'REVIEWED', frameCount: 16, detectionStability: 94,
    isDemo: true,
  },
  {
    id: 'INC-012', eventType: 'SMOKE_DETECTED', severity: 'HIGH', cameraId: 'CAM-15', cameraName: 'Cargo Area - Forklift Zone', zone: 'Cargo Area',
    timestamp: minutesAgo(55), confidence: 0.71, status: 'REVIEWED', frameCount: 6, detectionStability: 65,
    isDemo: true,
  },
  {
    id: 'INC-013', eventType: 'PPE_COMPLIANT', severity: 'NORMAL', cameraId: 'CAM-17', cameraName: 'Gate Entrance - Vehicle', zone: 'Gate Entrance',
    timestamp: minutesAgo(65), confidence: 0.98, status: 'REVIEWED', frameCount: 22, detectionStability: 99,
    isDemo: true,
  },
  {
    id: 'INC-014', eventType: 'SAFETY_JACKET_MISSING', severity: 'HIGH', cameraId: 'CAM-09', cameraName: 'Loading Zone A - Bay', zone: 'Loading Zone A',
    timestamp: minutesAgo(75), confidence: 0.87, status: 'REVIEWED', frameCount: 8, detectionStability: 78,
    isDemo: true,
  },
  {
    id: 'INC-015', eventType: 'PPE_COMPLIANT', severity: 'NORMAL', cameraId: 'CAM-20', cameraName: 'Berth 1 - Gangway', zone: 'Berth 1',
    timestamp: minutesAgo(90), confidence: 0.94, status: 'REVIEWED', frameCount: 17, detectionStability: 93,
    isDemo: true,
  },
  {
    id: 'INC-016', eventType: 'HELMET_MISSING', severity: 'HIGH', cameraId: 'CAM-05', cameraName: 'Container Yard B - East', zone: 'Container Yard B',
    timestamp: minutesAgo(110), confidence: 0.90, status: 'REVIEWED', frameCount: 10, detectionStability: 83,
    isDemo: true,
  },
  {
    id: 'INC-017', eventType: 'PPE_COMPLIANT', severity: 'NORMAL', cameraId: 'CAM-02', cameraName: 'Container Yard A - South', zone: 'Container Yard A',
    timestamp: minutesAgo(130), confidence: 0.95, status: 'REVIEWED', frameCount: 19, detectionStability: 97,
    isDemo: true,
  },
];

// ===== SYSTEM INFO =====
export const MOCK_SYSTEM_INFO: SystemInfo = {
  services: [
    { id: 'svc-1', name: 'AI Model', status: 'OPERATIONAL', lastCheck: new Date().toISOString(), details: 'YOLOv8 Nano — GPU accelerated' },
    { id: 'svc-2', name: 'Video Processing', status: 'OPERATIONAL', lastCheck: new Date().toISOString(), details: 'Processing 22 active streams' },
    { id: 'svc-3', name: 'Camera Network', status: 'OPERATIONAL', lastCheck: new Date().toISOString(), details: '22 of 24 cameras connected' },
    { id: 'svc-4', name: 'Alert Engine', status: 'OPERATIONAL', lastCheck: new Date().toISOString(), details: 'Rule engine active' },
    { id: 'svc-5', name: 'Database', status: 'OPERATIONAL', lastCheck: new Date().toISOString(), details: 'PostgreSQL — responding' },
    { id: 'svc-6', name: 'API', status: 'OPERATIONAL', lastCheck: new Date().toISOString(), details: 'FastAPI — healthy' },
  ],
  modelName: 'YOLOv8 Nano',
  modelVersion: 'custom_yolov8_run',
  connectedCameras: 22,
  totalCameras: 24,
  serverUptime: '14d 7h 23m',
  lastSync: new Date().toISOString(),
  processingFps: 28,
  apiLatency: 12,
};

// ===== AI DETECTION STATUS =====
export const MOCK_AI_STATUS: AIDetectionStatus = {
  modelName: 'YOLOv8',
  modelStatus: 'RUNNING',
  inferenceFps: 28,
  processingState: 'LIVE',
  objectsDetected: 7,
  averageConfidence: 94.2,
  detectedObjects: [
    { label: 'PERSON', count: 3 },
    { label: 'HELMET', count: 2 },
    { label: 'SAFETY_JACKET', count: 2 },
  ],
};
