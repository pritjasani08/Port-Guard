// ============================================================
// PORTGUARD AI — APPLICATION CONTEXT & STATE MANAGEMENT
// React Context + useReducer for global state
// ============================================================

import React, { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from 'react';
import type {
  AppState,
  AppAction,
  DetectionEvent,
  AppNotification,
  DetectionResult,
  EventType,
  Severity,
} from '../types';
import { createDataSource, getRealtimeSource } from '../services/api';
import { generateId, getCurrentTimestamp } from '../utils/formatting';
import { EVENT_CONFIG } from '../utils/constants';

// ===== INITIAL STATE =====
const initialState: AppState = {
  incidents: [],
  cameras: [],
  notifications: [],
  systemInfo: {
    services: [],
    modelName: 'YOLOv8',
    modelVersion: 'custom_yolov8_run',
    connectedCameras: 0,
    totalCameras: 0,
    serverUptime: '—',
    lastSync: '',
    processingFps: 0,
  },
  aiStatus: {
    modelName: 'YOLOv8',
    modelStatus: 'STOPPED',
    inferenceFps: 0,
    processingState: 'OFFLINE',
    objectsDetected: 0,
    averageConfidence: 0,
    detectedObjects: [],
  },
  demoMode: true,
  sidebarCollapsed: false,
  selectedCamera: 'CAM-07',
  environmentMode: 'demo',
};

// ===== REDUCER =====
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_INCIDENTS':
      return { ...state, incidents: action.payload };

    case 'ADD_INCIDENT':
      return {
        ...state,
        incidents: [action.payload, ...state.incidents],
      };

    case 'UPDATE_INCIDENT_STATUS':
      return {
        ...state,
        incidents: state.incidents.map(i =>
          i.id === action.payload.id
            ? { ...i, status: action.payload.status }
            : i
        ),
      };

    case 'SET_CAMERAS':
      return { ...state, cameras: action.payload };

    case 'UPDATE_CAMERA':
      return {
        ...state,
        cameras: state.cameras.map(c =>
          c.id === action.payload.id ? { ...c, ...action.payload } : c
        ),
      };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };

    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };

    case 'TOGGLE_DEMO_MODE':
      return { ...state, demoMode: !state.demoMode };

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };

    case 'SET_SELECTED_CAMERA':
      return { ...state, selectedCamera: action.payload };

    case 'UPDATE_AI_STATUS':
      return { ...state, aiStatus: { ...state.aiStatus, ...action.payload } };

    case 'ADD_DETECTION_TO_CAMERA':
      return {
        ...state,
        cameras: state.cameras.map(c =>
          c.id === action.payload.cameraId
            ? { ...c, detections: [...c.detections, action.payload.detection] }
            : c
        ),
      };

    case 'UPDATE_CAMERA_SAFETY':
      return {
        ...state,
        cameras: state.cameras.map(c =>
          c.id === action.payload.cameraId
            ? { ...c, currentSafetyStatus: action.payload.status }
            : c
        ),
      };

    case 'CLEAR_DEMO_DATA':
      return {
        ...state,
        incidents: state.incidents.filter(i => !i.isDemo),
        notifications: [],
        cameras: state.cameras.map(c => ({
          ...c,
          detections: [],
          currentSafetyStatus: 'NORMAL' as Severity,
        })),
      };

    default:
      return state;
  }
}

// ===== CONTEXT =====
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  simulateEvent: (eventType: EventType) => void;
  acknowledgeIncident: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

// ===== SIMULATION CONFIG =====
const SIMULATION_MAP: Record<EventType, {
  severity: Severity;
  cameras: string[];
  zones: string[];
  confidenceRange: [number, number];
  rule: string;
  reason: string;
}> = {
  FIRE_DETECTED: {
    severity: 'CRITICAL',
    cameras: ['CAM-07', 'CAM-13', 'CAM-19'],
    zones: ['Container Yard B', 'Cargo Area', 'Berth 1'],
    confidenceRange: [0.92, 0.99],
    rule: 'FIRE_DETECTION',
    reason: 'Fire detected in camera feed',
  },
  SMOKE_DETECTED: {
    severity: 'HIGH',
    cameras: ['CAM-15', 'CAM-06', 'CAM-21'],
    zones: ['Cargo Area', 'Container Yard B', 'Berth 2'],
    confidenceRange: [0.65, 0.85],
    rule: 'SMOKE_DETECTION',
    reason: 'Smoke detected in camera feed',
  },
  HELMET_MISSING: {
    severity: 'HIGH',
    cameras: ['CAM-12', 'CAM-08', 'CAM-22'],
    zones: ['Loading Zone A', 'Loading Zone A', 'Warehouse'],
    confidenceRange: [0.85, 0.96],
    rule: 'PPE_CHECK',
    reason: 'Helmet not detected on person',
  },
  SAFETY_JACKET_MISSING: {
    severity: 'HIGH',
    cameras: ['CAM-14', 'CAM-04', 'CAM-10'],
    zones: ['Cargo Area', 'Container Yard B', 'Loading Zone B'],
    confidenceRange: [0.82, 0.94],
    rule: 'PPE_CHECK',
    reason: 'Safety jacket not detected on person',
  },
  PPE_COMPLIANT: {
    severity: 'NORMAL',
    cameras: ['CAM-07', 'CAM-01', 'CAM-16'],
    zones: ['Container Yard B', 'Container Yard A', 'Gate Entrance'],
    confidenceRange: [0.90, 0.99],
    rule: 'PPE_CHECK',
    reason: 'All required PPE detected on person',
  },
};

// ===== PROVIDER =====
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load initial data from service layer
  useEffect(() => {
    const dataSource = createDataSource(state.environmentMode);

    Promise.all([
      dataSource.getCameras(),
      dataSource.getIncidents(),
      dataSource.getSystemStatus(),
      dataSource.getAIStatus(),
    ]).then(([cameras, incidents, _systemInfo, aiStatus]) => {
      dispatch({ type: 'SET_CAMERAS', payload: cameras });
      dispatch({ type: 'SET_INCIDENTS', payload: incidents });
      dispatch({ type: 'UPDATE_AI_STATUS', payload: aiStatus });
      // Set system info in state via a custom approach (store in ref or extend actions)
    }).catch(err => {
      console.error('[PortGuard] Failed to load initial data:', err);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Simulate event (demo mode)
  const simulateEvent = useCallback((eventType: EventType) => {
    const config = SIMULATION_MAP[eventType];
    const idx = Math.floor(Math.random() * config.cameras.length);
    const cameraId = config.cameras[idx];
    const zone = config.zones[idx];
    const camera = state.cameras.find(c => c.id === cameraId);
    const confidence = config.confidenceRange[0] + Math.random() * (config.confidenceRange[1] - config.confidenceRange[0]);
    const frameCount = Math.floor(Math.random() * 15) + 5;
    const stability = Math.floor(Math.random() * 20) + 75;
    const timestamp = getCurrentTimestamp();
    const id = generateId();

    // 1. Create detection result
    const detection: DetectionResult = {
      id: `det-${id}`,
      label: eventType === 'FIRE_DETECTED' ? 'FIRE' :
             eventType === 'SMOKE_DETECTED' ? 'SMOKE' :
             eventType === 'HELMET_MISSING' ? 'PERSON' :
             eventType === 'SAFETY_JACKET_MISSING' ? 'PERSON' : 'PERSON',
      confidence,
      bbox: {
        x: 15 + Math.random() * 50,
        y: 15 + Math.random() * 30,
        w: 10 + Math.random() * 20,
        h: 15 + Math.random() * 25,
      },
    };

    // 2. Create incident
    const incident: DetectionEvent = {
      id: `SIM-${id}`,
      eventType,
      severity: config.severity,
      cameraId,
      cameraName: camera?.name || cameraId,
      zone,
      timestamp,
      confidence: Math.round(confidence * 100) / 100,
      status: 'OPEN',
      frameCount,
      detectionStability: stability,
      isDemo: true,
      evidence: {
        detections: [detection],
        safetyEvaluation: {
          rule: config.rule,
          result: eventType === 'PPE_COMPLIANT' ? 'PASS' : 'FAIL',
          severity: config.severity,
          reason: config.reason,
          frameCount,
          detectionStability: stability,
        },
      },
    };

    // 3. Create notification
    const notification: AppNotification = {
      id: `notif-${id}`,
      eventType,
      severity: config.severity,
      cameraId,
      cameraName: camera?.name || cameraId,
      zone,
      timestamp,
      read: false,
      incidentId: incident.id,
    };

    // 4. Dispatch all updates
    dispatch({ type: 'ADD_INCIDENT', payload: incident });
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    dispatch({ type: 'ADD_DETECTION_TO_CAMERA', payload: { cameraId, detection } });
    dispatch({ type: 'UPDATE_CAMERA_SAFETY', payload: { cameraId, status: config.severity } });
    dispatch({ type: 'SET_SELECTED_CAMERA', payload: cameraId });

    // 5. Update AI status
    const eventConfig = EVENT_CONFIG[eventType];
    dispatch({
      type: 'UPDATE_AI_STATUS',
      payload: {
        objectsDetected: state.aiStatus.objectsDetected + 1,
        detectedObjects: [
          ...state.aiStatus.detectedObjects.map(obj =>
            obj.label === detection.label ? { ...obj, count: obj.count + 1 } : obj
          ),
          ...(state.aiStatus.detectedObjects.find(o => o.label === detection.label) ? [] : [{ label: detection.label, count: 1 }]),
        ],
      },
    });

    // Push to realtime source for any listeners
    const realtimeSource = getRealtimeSource();
    realtimeSource.pushEvent(incident);

    console.log(`[PortGuard Demo] Simulated: ${eventConfig.label} on ${cameraId} (${zone})`);
  }, [state.cameras, state.aiStatus]);

  // Acknowledge incident
  const acknowledgeIncident = useCallback((id: string) => {
    dispatch({ type: 'UPDATE_INCIDENT_STATUS', payload: { id, status: 'REVIEWED' } });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, simulateEvent, acknowledgeIncident }}>
      {children}
    </AppContext.Provider>
  );
}

// ===== HOOKS =====
export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

export function useIncidents() {
  const { state, acknowledgeIncident } = useApp();
  const activeAlerts = state.incidents.filter(i => i.status === 'OPEN' && i.severity !== 'NORMAL');
  const criticalCount = activeAlerts.filter(i => i.severity === 'CRITICAL').length;
  const highCount = activeAlerts.filter(i => i.severity === 'HIGH').length;
  const todayIncidents = state.incidents.filter(i => {
    const today = new Date();
    const incDate = new Date(i.timestamp);
    return incDate.toDateString() === today.toDateString();
  });

  return {
    incidents: state.incidents,
    activeAlerts,
    criticalCount,
    highCount,
    todayIncidents,
    acknowledgeIncident,
  };
}

export function useCameras() {
  const { state, dispatch } = useApp();
  const onlineCameras = state.cameras.filter(c => c.status === 'ONLINE');
  const offlineCameras = state.cameras.filter(c => c.status === 'OFFLINE');
  const selectedCamera = state.cameras.find(c => c.id === state.selectedCamera) || null;

  const selectCamera = (id: string | null) => {
    dispatch({ type: 'SET_SELECTED_CAMERA', payload: id });
  };

  return {
    cameras: state.cameras,
    onlineCameras,
    offlineCameras,
    selectedCamera,
    selectCamera,
  };
}

export function useNotifications() {
  const { state, dispatch } = useApp();
  const unreadCount = state.notifications.filter(n => !n.read).length;

  const markRead = (id: string) => dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  const clearAll = () => dispatch({ type: 'CLEAR_NOTIFICATIONS' });

  return {
    notifications: state.notifications,
    unreadCount,
    markRead,
    clearAll,
  };
}

export function useDemoMode() {
  const { state, dispatch, simulateEvent } = useApp();

  const toggleDemo = () => dispatch({ type: 'TOGGLE_DEMO_MODE' });
  const clearDemoData = () => dispatch({ type: 'CLEAR_DEMO_DATA' });

  return {
    demoMode: state.demoMode,
    environmentMode: state.environmentMode,
    toggleDemo,
    simulateEvent,
    clearDemoData,
  };
}
